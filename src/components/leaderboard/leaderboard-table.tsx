"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Minus, Trophy, Medal } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  showMatchPoints?: boolean;
  onUserClick?: (userId: string) => void;
  currentUserId?: string;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Trophy className="w-4 h-4 text-yellow-500" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-400/20 flex items-center justify-center">
        <Medal className="w-4 h-4 text-gray-400" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center">
        <Medal className="w-4 h-4 text-amber-700" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
      <span className="text-xs font-bold text-muted-foreground">{rank}</span>
    </div>
  );
}

function RankChange({ change }: { change: number }) {
  if (change > 0) {
    return (
      <motion.div
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-0.5 text-green-400"
      >
        <TrendingUp className="w-3 h-3" />
        <span className="text-[10px] font-medium">{change}</span>
      </motion.div>
    );
  }
  if (change < 0) {
    return (
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-0.5 text-red-400"
      >
        <TrendingDown className="w-3 h-3" />
        <span className="text-[10px] font-medium">{Math.abs(change)}</span>
      </motion.div>
    );
  }
  return <Minus className="w-3 h-3 text-muted-foreground" />;
}

export function LeaderboardTable({
  entries,
  loading,
  showMatchPoints = false,
  onUserClick,
  currentUserId,
}: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-muted/50" />
            <div className="w-8 h-8 rounded-full bg-muted/50" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 bg-muted/50 rounded" />
              <div className="h-2 w-16 bg-muted/50 rounded" />
            </div>
            <div className="h-5 w-12 bg-muted/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No leaderboard data yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <div className="w-8 text-center">#</div>
        <div className="w-8" />
        <div className="flex-1">Player</div>
        {showMatchPoints && <div className="w-16 text-right">Match</div>}
        <div className="w-16 text-right">Season</div>
        <div className="w-6" />
      </div>

      {/* Entries */}
      <AnimatePresence mode="popLayout">
        {entries.map((entry) => (
          <motion.div
            key={entry.user_id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, layout: { duration: 0.4 } }}
            onClick={() => onUserClick?.(entry.user_id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              currentUserId === entry.user_id
                ? "bg-primary/5 border border-primary/20"
                : "bg-muted/10 hover:bg-muted/20"
            } ${onUserClick ? "cursor-pointer" : ""}`}
          >
            <RankBadge rank={entry.rank} />

            <Avatar className="w-8 h-8">
              <AvatarImage src={entry.avatar_url || undefined} />
              <AvatarFallback className="text-[10px] font-bold">
                {entry.display_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {entry.display_name}
                {currentUserId === entry.user_id && (
                  <span className="text-[10px] text-primary ml-1">(You)</span>
                )}
              </div>
            </div>

            {showMatchPoints && (
              <div className="w-16 text-right">
                <span className="text-sm font-semibold tabular-nums">
                  {entry.fantasy_points}
                </span>
                <div className="text-[10px] text-muted-foreground">pts</div>
              </div>
            )}

            <div className="w-16 text-right">
              <motion.span
                key={entry.cumulative_points}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-sm font-bold tabular-nums text-primary"
              >
                {entry.cumulative_points}
              </motion.span>
              <div className="text-[10px] text-muted-foreground">season</div>
            </div>

            <div className="w-6 flex justify-center">
              <RankChange change={entry.rank_change || 0} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
