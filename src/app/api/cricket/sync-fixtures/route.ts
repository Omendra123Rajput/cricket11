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

  let matched = 0;
  let alreadyMapped = 0;
  let unmatched = 0;
  const mappings: { dbMatchId: number; apiMatchId: string; teams: string }[] = [];
  const unmatchedApiMatches: { apiId: string; teams: string; date: string }[] = [];

  for (const apiMatch of apiMatches) {
    // Resolve team codes from CricAPI full names
    const [team1Raw, team2Raw] = apiMatch.teams ?? [];
    const code1 = normalizeTeamName(team1Raw ?? "");
    const code2 = normalizeTeamName(team2Raw ?? "");

    if (!code1 || !code2) {
      // Not an IPL team (e.g., women's or other series matches mixed in)
      continue;
    }

    const apiDate = new Date(apiMatch.dateTimeGMT).getTime();

    // Find DB match by teams (either order) and date within ±24 hours
    const dbMatch = dbMatches.find((m) => {
      const dbDate = new Date(m.start_time).getTime();
      const sameTeams =
        (m.team_home === code1 && m.team_away === code2) ||
        (m.team_home === code2 && m.team_away === code1);
      const sameDay = Math.abs(dbDate - apiDate) < 24 * 60 * 60 * 1000;
      return sameTeams && sameDay;
    });

    if (!dbMatch) {
      unmatched++;
      unmatchedApiMatches.push({ apiId: apiMatch.id, teams: `${code1} vs ${code2}`, date: apiMatch.dateTimeGMT });
      continue;
    }

    if (dbMatch.external_id === apiMatch.id) {
      alreadyMapped++;
      continue;
    }

    // Update external_id
    const { error: updateError } = await supabase
      .from("matches")
      .update({ external_id: apiMatch.id })
      .eq("id", dbMatch.id);

    if (updateError) {
      console.error(`[sync-fixtures] Failed to update match ${dbMatch.id}:`, updateError);
      continue;
    }

    matched++;
    mappings.push({ dbMatchId: dbMatch.id, apiMatchId: apiMatch.id, teams: `${code1} vs ${code2}` });
  }

  console.log(`[sync-fixtures] Done: matched=${matched} alreadyMapped=${alreadyMapped} unmatched=${unmatched}`);

  return NextResponse.json({ ok: true, matched, alreadyMapped, unmatched, mappings, unmatchedApiMatches });
}
