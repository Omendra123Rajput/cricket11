import { createAdminClient } from "@/lib/supabase/admin";
import type { Badge } from "@/types";

interface BadgeContext {
  userId: string;
  matchId?: number;
  contestId?: string;
}

/**
 * Evaluates all badge criteria for a user after a match or action.
 * Awards badges not already earned.
 */
export async function evaluateBadges(context: BadgeContext): Promise<string[]> {
  const supabase = createAdminClient();
  const awarded: string[] = [];

  // Fetch all badge definitions
  const { data: badges } = await supabase.from("badges").select("*");
  if (!badges) return awarded;

  // Fetch user's existing badges to avoid duplicates
  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", context.userId);

  const earnedBadgeIds = new Set(
    (existingBadges || []).map((b: { badge_id: number }) => b.badge_id)
  );

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", context.userId)
    .single();

  for (const badge of badges as Badge[]) {
    if (earnedBadgeIds.has(badge.id)) continue;

    const criteria = badge.criteria as Record<string, unknown>;
    const earned = await checkCriteria(supabase, context, profile, criteria);

    if (earned) {
      await supabase.from("user_badges").insert({
        user_id: context.userId,
        badge_id: badge.id,
        contest_id: context.contestId || null,
      });
      awarded.push(badge.slug);
    }
  }

  return awarded;
}

async function checkCriteria(
  supabase: ReturnType<typeof createAdminClient>,
  ctx: BadgeContext,
  profile: any,
  criteria: Record<string, unknown>
): Promise<boolean> {
  const type = criteria.type as string;

  switch (type) {
    case "streak_gte":
      return (profile?.streak_current || 0) >= (criteria.value as number);

    case "contests_joined_gte": {
      const { count } = await supabase
        .from("contest_members")
        .select("*", { count: "exact", head: true })
        .eq("user_id", ctx.userId);
      return (count || 0) >= (criteria.value as number);
    }

    case "contests_created_gte": {
      const { count } = await supabase
        .from("contests")
        .select("*", { count: "exact", head: true })
        .eq("created_by", ctx.userId);
      return (count || 0) >= (criteria.value as number);
    }

    case "contest_members_gte": {
      if (!ctx.contestId) return false;
      const { count } = await supabase
        .from("contest_members")
        .select("*", { count: "exact", head: true })
        .eq("contest_id", ctx.contestId);
      return (count || 0) >= (criteria.value as number);
    }

    case "team_points_gte": {
      if (!ctx.matchId) return false;
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("total_points")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);
      return (teams || []).some(
        (t: { total_points: number }) =>
          t.total_points >= (criteria.value as number)
      );
    }

    case "captain_points_gte": {
      if (!ctx.matchId) return false;
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select(
          "id, captain_player_id, fantasy_team_players(player_id, is_captain, points_earned)"
        )
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      for (const team of teams as any[]) {
        const captain = team.fantasy_team_players?.find(
          (p: any) => p.is_captain
        );
        if (captain && captain.points_earned >= (criteria.value as number)) {
          return true;
        }
      }
      return false;
    }

    case "player_sixes_gte": {
      if (!ctx.matchId) return false;
      // Check if any player in user's team hit N+ sixes
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("id, fantasy_team_players(player_id)")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      const playerIds = (teams as any[]).flatMap((t: any) =>
        (t.fantasy_team_players || []).map((p: any) => p.player_id)
      );
      if (playerIds.length === 0) return false;

      const { data: stats } = await supabase
        .from("live_match_stats")
        .select("sixes")
        .eq("match_id", ctx.matchId)
        .in("player_id", playerIds);

      return (stats || []).some(
        (s: { sixes: number }) => s.sixes >= (criteria.value as number)
      );
    }

    case "player_wickets_gte": {
      if (!ctx.matchId) return false;
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("id, fantasy_team_players(player_id)")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      const playerIds = (teams as any[]).flatMap((t: any) =>
        (t.fantasy_team_players || []).map((p: any) => p.player_id)
      );
      if (playerIds.length === 0) return false;

      const { data: stats } = await supabase
        .from("live_match_stats")
        .select("wickets")
        .eq("match_id", ctx.matchId)
        .in("player_id", playerIds);

      return (stats || []).some(
        (s: { wickets: number }) => s.wickets >= (criteria.value as number)
      );
    }

    case "player_maidens_gte": {
      if (!ctx.matchId) return false;
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("id, fantasy_team_players(player_id)")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      const playerIds = (teams as any[]).flatMap((t: any) =>
        (t.fantasy_team_players || []).map((p: any) => p.player_id)
      );
      if (playerIds.length === 0) return false;

      const { data: stats } = await supabase
        .from("live_match_stats")
        .select("maidens")
        .eq("match_id", ctx.matchId)
        .in("player_id", playerIds);

      return (stats || []).some(
        (s: { maidens: number }) => s.maidens >= (criteria.value as number)
      );
    }

    case "top2_finishes_gte": {
      const { count } = await supabase
        .from("season_leaderboard")
        .select("*", { count: "exact", head: true })
        .eq("user_id", ctx.userId)
        .lte("rank", 2);
      return (count || 0) >= (criteria.value as number);
    }

    case "low_credit_high_score": {
      if (!ctx.matchId) return false;
      const creditMax = criteria.credit_max as number;
      const pointsMin = criteria.points_min as number;

      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("id, fantasy_team_players(player_id, points_earned)")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      for (const team of teams as any[]) {
        for (const ftp of team.fantasy_team_players || []) {
          if (ftp.points_earned >= pointsMin) {
            const { data: player } = await supabase
              .from("players")
              .select("credit_value")
              .eq("id", ftp.player_id)
              .single();
            if (player && player.credit_value <= creditMax) return true;
          }
        }
      }
      return false;
    }

    case "captain_top_scorer_gte": {
      // Count matches where captain was top scorer on user's team
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select(
          "id, fantasy_team_players(player_id, is_captain, points_earned)"
        )
        .eq("user_id", ctx.userId);

      if (!teams) return false;
      let captainTopCount = 0;
      for (const team of teams as any[]) {
        const players = team.fantasy_team_players || [];
        if (players.length === 0) continue;
        const maxPoints = Math.max(
          ...players.map((p: any) => p.points_earned)
        );
        const captain = players.find((p: any) => p.is_captain);
        if (captain && captain.points_earned === maxPoints && maxPoints > 0) {
          captainTopCount++;
        }
      }
      return captainTopCount >= (criteria.value as number);
    }

    case "season_rank": {
      if (!ctx.contestId) return false;
      const { data: member } = await supabase
        .from("contest_members")
        .select("rank")
        .eq("contest_id", ctx.contestId)
        .eq("user_id", ctx.userId)
        .single();
      return member?.rank === (criteria.value as number);
    }

    case "all_players_scored_gte": {
      if (!ctx.matchId) return false;
      const { data: teams } = await supabase
        .from("fantasy_teams")
        .select("id, fantasy_team_players(points_earned)")
        .eq("user_id", ctx.userId)
        .eq("match_id", ctx.matchId);

      if (!teams) return false;
      for (const team of teams as any[]) {
        const players = team.fantasy_team_players || [];
        if (
          players.length === 11 &&
          players.every(
            (p: any) => p.points_earned >= (criteria.value as number)
          )
        ) {
          return true;
        }
      }
      return false;
    }

    case "matches_played_gte":
      return (
        (profile?.matches_played || 0) >= (criteria.value as number)
      );

    // comeback badge is complex — check on season end
    case "comeback":
      return false;

    default:
      return false;
  }
}
