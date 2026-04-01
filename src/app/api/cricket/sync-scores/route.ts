import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchLiveScorecard } from "@/lib/cricket/api-client";
import { findBestPlayerMatch } from "@/lib/cricket/player-matcher";
import type { NormalizedPlayerStats } from "@/types/cricket";

// Minimum interval between real API calls — DB acts as shared cache across instances.
// 5 min × 42 calls per 3.5h match = ~42 hits/match, within the 100/day free tier limit.
const SYNC_INTERVAL_MS = 5 * 60 * 1000;

// Client-side polling calls this every 30s during live matches.
// GET /api/cricket/sync-scores?matchId=123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get match with external ID, scorecard, and last sync time
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, external_id, status, scorecard, last_synced_at")
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

  // DB-level cache: skip API call if synced recently (shared across all Vercel instances)
  const lastSynced = match.last_synced_at ? new Date(match.last_synced_at).getTime() : 0;
  if (Date.now() - lastSynced < SYNC_INTERVAL_MS && match.scorecard) {
    return NextResponse.json({
      ok: true,
      synced: false,
      cached: true,
      matchStatus: match.status,
      scores: (match.scorecard as { scores?: unknown[] })?.scores ?? [],
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

  for (const stat of playerStats) {
    const match = findBestPlayerMatch(stat.playerName, dbPlayers);
    if (!match) {
      console.warn(`[sync-scores] Unmatched player: "${stat.playerName}" — add to PLAYER_ALIASES`);
      continue;
    }
    if (match.confidence === "fuzzy") {
      console.log(`[sync-scores] Fuzzy match: "${stat.playerName}" → "${match.playerName}" (${match.score.toFixed(3)})`);
    }
    const playerId = match.playerId;

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
