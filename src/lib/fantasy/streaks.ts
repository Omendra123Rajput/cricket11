import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Updates streak for all users after a match completes.
 * Users who had a fantasy team for this match get streak incremented.
 * Users who didn't get their streak reset to 0.
 */
export async function updateStreaksForMatch(matchId: number) {
  const supabase = createAdminClient();

  // Get all users who had fantasy teams for this match
  const { data: teams } = await supabase
    .from("fantasy_teams")
    .select("user_id")
    .eq("match_id", matchId);

  const participantIds = new Set(
    (teams || []).map((t: { user_id: string }) => t.user_id)
  );

  if (participantIds.size === 0) return;

  // Get all profiles that are in any active contest
  const { data: allMembers } = await supabase
    .from("contest_members")
    .select("user_id");

  const allUserIds = [
    ...new Set((allMembers || []).map((m: { user_id: string }) => m.user_id)),
  ];

  for (const userId of allUserIds) {
    if (participantIds.has(userId)) {
      // Participated — increment streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("streak_current, streak_best, matches_played")
        .eq("id", userId)
        .single();

      if (profile) {
        const newStreak = (profile.streak_current || 0) + 1;
        const newBest = Math.max(newStreak, profile.streak_best || 0);
        await supabase
          .from("profiles")
          .update({
            streak_current: newStreak,
            streak_best: newBest,
            matches_played: (profile.matches_played || 0) + 1,
          })
          .eq("id", userId);
      }
    } else {
      // Did not participate — reset streak
      await supabase
        .from("profiles")
        .update({ streak_current: 0 })
        .eq("id", userId);
    }
  }
}
