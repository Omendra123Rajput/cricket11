import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSeriesMatches } from "@/lib/cricket/cricapi";
import { normalizeTeamName } from "@/lib/cricket/team-normalizer";
import { IPL_2026_SERIES_ID } from "@/lib/utils/constants";

// Populates matches.external_id by mapping real CricAPI UUIDs to our DB matches.
// Protected by CRON_SECRET. Run once manually then daily via cron.
// GET /api/cricket/sync-fixtures
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch all IPL 2026 matches from CricAPI
  let apiMatches;
  try {
    apiMatches = await getSeriesMatches(IPL_2026_SERIES_ID);
  } catch (err) {
    console.error("[sync-fixtures] Failed to fetch series matches:", err);
    return NextResponse.json({ error: "CricAPI series fetch failed" }, { status: 502 });
  }

  if (!apiMatches.length) {
    return NextResponse.json({ error: "No matches returned from CricAPI" }, { status: 502 });
  }

  // Fetch all DB matches for this season
  const { data: dbMatches, error: dbError } = await supabase
    .from("matches")
    .select("id, team_home, team_away, start_time, external_id")
    .eq("season", 2026);

  if (dbError || !dbMatches) {
    return NextResponse.json({ error: "DB fetch failed" }, { status: 500 });
  }

  // Group API matches by team pair key (sorted alphabetically, e.g. "CSK|MI")
  const teamPairKey = (a: string, b: string) => [a, b].sort().join("|");

  // Build API groups: team pair → sorted by date
  const apiGroups = new Map<string, typeof apiMatches>();
  for (const apiMatch of apiMatches) {
    const [t1Raw, t2Raw] = apiMatch.teams ?? [];
    const c1 = normalizeTeamName(t1Raw ?? "");
    const c2 = normalizeTeamName(t2Raw ?? "");
    if (!c1 || !c2) continue;
    const key = teamPairKey(c1, c2);
    if (!apiGroups.has(key)) apiGroups.set(key, []);
    apiGroups.get(key)!.push(apiMatch);
  }
  for (const arr of apiGroups.values()) {
    arr.sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime());
  }

  // Build DB groups: team pair → sorted by start_time
  const dbGroups = new Map<string, typeof dbMatches>();
  for (const m of dbMatches) {
    const key = teamPairKey(m.team_home, m.team_away);
    if (!dbGroups.has(key)) dbGroups.set(key, []);
    dbGroups.get(key)!.push(m);
  }
  for (const arr of dbGroups.values()) {
    arr.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }

  let matched = 0;
  let alreadyMapped = 0;
  let unmatched = 0;
  const mappings: { dbMatchId: number; apiMatchId: string; teams: string }[] = [];
  const unmatchedApiMatches: { apiId: string; teams: string; date: string }[] = [];

  // Match chronologically within each team pair
  for (const [key, apiArr] of apiGroups) {
    const dbArr = dbGroups.get(key);
    for (let i = 0; i < apiArr.length; i++) {
      const apiMatch = apiArr[i];
      const [t1Raw, t2Raw] = apiMatch.teams ?? [];
      const c1 = normalizeTeamName(t1Raw ?? "") ?? t1Raw;
      const c2 = normalizeTeamName(t2Raw ?? "") ?? t2Raw;
      const label = `${c1} vs ${c2}`;

      if (!dbArr || i >= dbArr.length) {
        unmatched++;
        unmatchedApiMatches.push({ apiId: apiMatch.id, teams: label, date: apiMatch.dateTimeGMT });
        continue;
      }

      const dbMatch = dbArr[i];

      if (dbMatch.external_id === apiMatch.id) {
        alreadyMapped++;
        continue;
      }

      // Update external_id AND start_time to real API date
      const { error: updateError } = await supabase
        .from("matches")
        .update({
          external_id: apiMatch.id,
          start_time: apiMatch.dateTimeGMT,
        })
        .eq("id", dbMatch.id);

      if (updateError) {
        console.error(`[sync-fixtures] Failed to update match ${dbMatch.id}:`, updateError);
        continue;
      }

      matched++;
      mappings.push({ dbMatchId: dbMatch.id, apiMatchId: apiMatch.id, teams: label });
    }
  }

  console.log(`[sync-fixtures] Done: matched=${matched} alreadyMapped=${alreadyMapped} unmatched=${unmatched}`);

  return NextResponse.json({ ok: true, matched, alreadyMapped, unmatched, mappings, unmatchedApiMatches });
}
