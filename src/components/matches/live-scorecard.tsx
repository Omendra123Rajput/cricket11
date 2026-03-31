"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { IPL_TEAMS } from "@/lib/utils/constants";
import { Activity, RefreshCw } from "lucide-react";

interface InningScore {
  r: number;
  w: number;
  o: number;
  inning: string;
}

interface LiveScorecardProps {
  teamHome: string;
  teamAway: string;
  scores: InningScore[];
  matchStatus: string;
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh?: () => void;
}

function TeamScore({
  teamCode,
  score,
  isCurrentInning,
}: {
  teamCode: string;
  score: InningScore | null;
  isCurrentInning: boolean;
}) {
  const team = IPL_TEAMS[teamCode as keyof typeof IPL_TEAMS];

  return (
    <motion.div
      layout
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isCurrentInning
          ? "bg-primary/5 border border-primary/20"
          : "bg-muted/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: `${team?.color}20`,
            color: team?.color,
          }}
        >
          {teamCode}
        </div>
        <div>
          <div className="font-semibold text-sm">
            {team?.short || teamCode}
          </div>
          {isCurrentInning && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] text-red-400">Batting</span>
            </div>
          )}
        </div>
      </div>

      {score ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${score.r}-${score.w}-${score.o}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-right"
          >
            <div className="text-xl font-bold tabular-nums">
              <motion.span
                key={score.r}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {score.r}
              </motion.span>
              <span className="text-muted-foreground">/{score.w}</span>
            </div>
            <div className="text-xs text-muted-foreground tabular-nums">
              ({score.o} ov)
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-sm text-muted-foreground">Yet to bat</div>
      )}
    </motion.div>
  );
}

export function LiveScorecard({
  teamHome,
  teamAway,
  scores,
  matchStatus,
  lastUpdated,
  loading,
  onRefresh,
}: LiveScorecardProps) {
  // Map scores to teams. Innings typically alternate home/away
  const homeScore = scores.find(
    (s) =>
      s.inning.toLowerCase().includes(teamHome.toLowerCase()) ||
      s.inning.toLowerCase().includes(
        (IPL_TEAMS[teamHome as keyof typeof IPL_TEAMS]?.name || "").toLowerCase()
      )
  );
  const awayScore = scores.find(
    (s) =>
      s.inning.toLowerCase().includes(teamAway.toLowerCase()) ||
      s.inning.toLowerCase().includes(
        (IPL_TEAMS[teamAway as keyof typeof IPL_TEAMS]?.name || "").toLowerCase()
      )
  );

  // Fallback: assign by order if name matching fails
  const score1 = homeScore || scores[0] || null;
  const score2 = awayScore || scores[1] || null;

  // Determine current inning (last inning with data)
  const currentInningTeam =
    scores.length === 1 ? teamHome : scores.length >= 2 ? teamAway : null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold">Live Score</span>
          {matchStatus === "live" && (
            <Badge
              variant="outline"
              className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] animate-pulse"
            >
              LIVE
            </Badge>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Scores */}
      <div className="space-y-2">
        <TeamScore
          teamCode={teamHome}
          score={score1}
          isCurrentInning={currentInningTeam === teamHome}
        />
        <TeamScore
          teamCode={teamAway}
          score={score2}
          isCurrentInning={currentInningTeam === teamAway}
        />
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-[10px] text-muted-foreground text-center">
          Updated {formatTimeAgo(lastUpdated)}
        </p>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
