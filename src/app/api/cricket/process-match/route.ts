import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateFantasyPoints, applyMultiplier } from "@/lib/fantasy/scoring-engine";
import { rankUsersForMatch } from "@/lib/fantasy/leaderboard";
import { updateStreaksForMatch } from "@/lib/fantasy/streaks";
import { evaluateBadges } from "@/lib/fantasy/badges";
import type { LiveMatchStats, ScoringRules, PlayerRole } from "@/types";

// POST /api/cricket/process-match
// Called after a match completes. Calculates fantasy points and updates leaderboards.
export async function POST(request: Request) {
  // Verify CRON_SECRET for server-to-server calls
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId } = await request.json();

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1. Verify match is completed
  const { data: match } = await supabase
    .from("matches")
    .select("id, status")
    .eq("id", matchId)
    .single();

  if (!match || match.status !== "completed") {
    return NextResponse.json({
      error: "Match must be completed before processing",
    });
  }

  // 2. Check if already processed
  const { count: existingPoints } = await supabase
    .from("fantasy_points")
    .select("*", { count: "exact", head: true })
    .eq("match_id", matchId);

  if (existingPoints && existingPoints > 0) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Already processed",
    });
  }

  // 3. Get all player stats for this match
  const { data: stats } = await supabase
    .from("live_match_stats")
    .select("*")
    .eq("match_id", matchId);

  if (!stats || stats.length === 0) {
    return NextResponse.json({ error: "No player stats found" });
  }

  // 4. Get player roles
  const playerIds = stats.map((s: any) => s.player_id);
  const { data: players } = await supabase
    .from("players")
    .select("id, role")
    .in("id", playerIds);

  const playerRoleMap = new Map<number, PlayerRole>();
  for (const p of players || []) {
    playerRoleMap.set(p.id, p.role as PlayerRole);
  }

  // 5. Calculate fantasy points for each player
  const pointsRows: {
    match_id: number;
    player_id: number;
    points_breakdown: object;
    total_points: number;
  }[] = [];

  for (const stat of stats as LiveMatchStats[]) {
    const role = playerRoleMap.get(stat.player_id) || "BAT";
    const breakdown = calculateFantasyPoints(stat, role);

    pointsRows.push({
      match_id: matchId,
      player_id: stat.player_id,
      points_breakdown: breakdown,
      total_points: breakdown.total,
    });
  }

  // Insert fantasy_points
  const { error: fpError } = await supabase
    .from("fantasy_points")
    .insert(pointsRows);

  if (fpError) {
    return NextResponse.json({ error: fpError.message }, { status: 500 });
  }

  // 6. Get all fantasy teams for this match
  const { data: teams } = await supabase
    .from("fantasy_teams")
    .select(`
      id,
      user_id,
      contest_id,
      fantasy_team_players (
        player_id,
        is_captain,
        is_vice_captain
      )
    `)
    .eq("match_id", matchId);

  if (!teams) {
    return NextResponse.json({ ok: true, teamsProcessed: 0 });
  }

  // Build points lookup
  const pointsMap = new Map<number, number>();
  for (const row of pointsRows) {
    pointsMap.set(row.player_id, row.total_points);
  }

  // 7. Calculate team totals and update player points
  for (const team of teams as any[]) {
    let teamTotal = 0;

    for (const ftp of team.fantasy_team_players) {
      const basePoints = pointsMap.get(ftp.player_id) || 0;
      const multiplied = applyMultiplier(
        basePoints,
        ftp.is_captain,
        ftp.is_vice_captain
      );

      // Update individual player points
      await supabase
        .from("fantasy_team_players")
        .update({ points_earned: multiplied })
        .eq("fantasy_team_id", team.id)
        .eq("player_id", ftp.player_id);

      teamTotal += multiplied;
    }

    // Update team total
    await supabase
      .from("fantasy_teams")
      .update({ total_points: teamTotal })
      .eq("id", team.id);
  }

  // 8. Update leaderboards per contest
  const contestIds = [...new Set(teams.map((t: any) => t.contest_id))];

  for (const contestId of contestIds) {
    const contestTeams = teams
      .filter((t: any) => t.contest_id === contestId)
      .map((t: any) => {
        let total = 0;
        for (const ftp of t.fantasy_team_players) {
          const base = pointsMap.get(ftp.player_id) || 0;
          total += applyMultiplier(base, ftp.is_captain, ftp.is_vice_captain);
        }
        return { userId: t.user_id, fantasyPoints: total };
      });

    const ranked = rankUsersForMatch(contestTeams);

    // Use the DB function for leaderboard update
    await supabase.rpc("update_contest_leaderboard", {
      p_contest_id: contestId,
      p_match_id: matchId,
    });
  }

  // 9. Update streaks
  await updateStreaksForMatch(matchId);

  // 10. Evaluate badges for all participating users
  const userIds = [...new Set(teams.map((t: any) => t.user_id))];
  const badgesAwarded: string[] = [];

  for (const userId of userIds) {
    for (const contestId of contestIds) {
      const awarded = await evaluateBadges({
        userId,
        matchId,
        contestId: contestId as string,
      });
      badgesAwarded.push(...awarded);
    }
  }

  return NextResponse.json({
    ok: true,
    playersProcessed: pointsRows.length,
    teamsProcessed: teams.length,
    contestsProcessed: contestIds.length,
    badgesAwarded: badgesAwarded.length,
  });
}
