"use client";

import { useRealtimeLeaderboard } from "@/hooks/use-realtime-leaderboard";
import { LeaderboardTable } from "./leaderboard-table";

interface ContestLeaderboardLiveProps {
  contestId: string;
  currentUserId: string | null;
  matchId?: number;
}

export function ContestLeaderboardLive({
  contestId,
  currentUserId,
  matchId,
}: ContestLeaderboardLiveProps) {
  const { entries, loading } = useRealtimeLeaderboard({
    contestId,
    matchId,
  });

  return (
    <LeaderboardTable
      entries={entries}
      loading={loading}
      showMatchPoints={!!matchId}
      currentUserId={currentUserId || undefined}
    />
  );
}
