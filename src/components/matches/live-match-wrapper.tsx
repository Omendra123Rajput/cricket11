"use client";

import { useRealtimeScores } from "@/hooks/use-realtime-scores";
import { LiveScorecard } from "./live-scorecard";
import { MatchCountdown } from "./match-countdown";

interface LiveMatchWrapperProps {
  matchId: number;
  matchStatus: string;
  startTime: string;
  teamHome: string;
  teamAway: string;
}

export function LiveMatchWrapper({
  matchId,
  matchStatus,
  startTime,
  teamHome,
  teamAway,
}: LiveMatchWrapperProps) {
  const isLive = matchStatus === "live";
  const { data, loading, lastUpdated, refresh } = useRealtimeScores(
    matchId,
    isLive
  );

  if (matchStatus === "upcoming") {
    return (
      <div className="glass rounded-xl p-6">
        <div className="text-center mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Match starts in
          </span>
        </div>
        <MatchCountdown startTime={startTime} />
      </div>
    );
  }

  if (isLive || (data && data.scores)) {
    return (
      <div className="glass rounded-xl p-4">
        <LiveScorecard
          teamHome={teamHome}
          teamAway={teamAway}
          scores={data?.scores || []}
          matchStatus={data?.matchStatus || matchStatus}
          lastUpdated={lastUpdated}
          loading={loading}
          onRefresh={refresh}
        />
      </div>
    );
  }

  return null;
}
