import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLiveScorecard } from "@/lib/cricket/api-client";
import type { NormalizedPlayerStats } from "@/types/cricket";

// Client-side polling calls this every 30s during live matches.
// GET /api/cricket/sync-scores?matchId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get match with external ID
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, external_id, status")
    .eq("id", Number(matchId))
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Only sync if match is live or has external_id
  if (!match.external_id) {
    return NextResponse.json({
      ok: true,
      synced: false,
      reason: "No external_id mapped for this match",
    });
  }

  if (match.status !== "live" && match.status !== "upcoming") {
    return NextResponse.json({
      ok: true,
      synced: false,
      reason: `Match status is ${match.status}, skipping sync`,
    });
  }

  // Fetch from CricAPI
  const data = await fetchLiveScorecard(match.external_id);

  if (!data) {
    return NextResponse.json({
      ok: false,
      error: "Failed to fetch from cricket API",
    });
  }

  // Update match status and scorecard
  const matchUpdate: Record<string, unknown> = {
    scorecard: { scores: data.scores },
    last_synced_at: new Date().toISOString(),
  };

  if (data.status !== match.status) {
    matchUpdate.status = data.status;
  }
  if (data.resultSummary) {
    matchUpdate.result_summary = data.resultSummary;
  }

  await supabase
    .from("matches")
    .update(matchUpdate)
    .eq("id", match.id);

  // Upsert player stats
  if (data.playerStats.length > 0) {
    await upsertPlayerStats(supabase, match.id, data.playerStats);
  }

  return NextResponse.json({
    ok: true,
    synced: true,
    matchStatus: data.status,
    playerCount: data.playerStats.length,
    scores: data.scores,
  });
}

async function upsertPlayerStats(
  supabase: ReturnType<typeof createAdminClient>,
  matchId: number,
  playerStats: NormalizedPlayerStats[]
) {
  // Get all players from DB to match by name
  const { data: dbPlayers } = await supabase
    .from("players")
    .select("id, name");

  if (!dbPlayers) return;

  // Create name -> id mapping (fuzzy: last name match)
  const nameMap = new Map<string, number>();
  for (const p of dbPlayers) {
    nameMap.set(p.name.toLowerCase(), p.id);
    // Also map by last name for partial matches
    const lastName = p.name.split(" ").pop()?.toLowerCase();
    if (lastName) nameMap.set(lastName, p.id);
  }

  for (const stat of playerStats) {
    // Try exact match first, then last name
    let playerId =
      nameMap.get(stat.playerName.toLowerCase()) ||
      nameMap.get(stat.playerName.split(" ").pop()?.toLowerCase() || "");

    if (!playerId) continue; // Skip unmatched players

    const row = {
      match_id: matchId,
      player_id: playerId,
      runs_scored: stat.runs,
      balls_faced: stat.balls,
      fours: stat.fours,
      sixes: stat.sixes,
      strike_rate: stat.strikeRate,
      overs_bowled: stat.oversBowled,
      wickets: stat.wickets,
      runs_conceded: stat.runsConceded,
      maidens: stat.maidens,
      economy: stat.economy,
      catches: stat.catches,
      stumpings: stat.stumpings,
      run_outs: stat.runOuts,
      is_duck: stat.isDuck,
      is_not_out: stat.isNotOut,
      in_playing_xi: stat.inPlayingXI,
      lbw_bowled_count: stat.lbwBowledCount,
      direct_run_outs: stat.directRunOuts,
      last_synced_at: new Date().toISOString(),
    };

    await supabase
      .from("live_match_stats")
      .upsert(row, { onConflict: "match_id,player_id" });
  }
}
