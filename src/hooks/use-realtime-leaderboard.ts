"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/types";

interface UseRealtimeLeaderboardOptions {
  contestId: string | null;
  matchId?: number | null;
}

export function useRealtimeLeaderboard({
  contestId,
  matchId,
}: UseRealtimeLeaderboardOptions) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRanksRef = useRef<Map<string, number>>(new Map());

  const fetchLeaderboard = useCallback(async () => {
    if (!contestId) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get contest members with profiles and season points
      const { data: members, error: membersError } = await supabase
        .from("contest_members")
        .select("user_id, season_points, rank, profiles(display_name, avatar_url)")
        .eq("contest_id", contestId)
        .order("season_points", { ascending: false });

      if (membersError) {
        setError(membersError.message);
        return;
      }

      // If matchId provided, also get match-specific fantasy points
      let matchPointsMap = new Map<string, number>();
      if (matchId) {
        const { data: teams } = await supabase
          .from("fantasy_teams")
          .select("user_id, total_points")
          .eq("match_id", matchId)
          .eq("contest_id", contestId);

        if (teams) {
          for (const t of teams) {
            matchPointsMap.set(t.user_id, t.total_points);
          }
        }
      }

      const newEntries: LeaderboardEntry[] = (members || []).map(
        (m: any, index: number) => {
          const prevRank = prevRanksRef.current.get(m.user_id);
          const currentRank = index + 1;
          const rankChange =
            prevRank !== undefined ? prevRank - currentRank : 0;

          return {
            user_id: m.user_id,
            display_name: m.profiles?.display_name || "Unknown",
            avatar_url: m.profiles?.avatar_url || null,
            fantasy_points: matchId
              ? matchPointsMap.get(m.user_id) || 0
              : 0,
            position_points: 0,
            cumulative_points: m.season_points || 0,
            rank: currentRank,
            rank_change: rankChange,
          };
        }
      );

      // Store current ranks for next comparison
      const newRanks = new Map<string, number>();
      for (const entry of newEntries) {
        newRanks.set(entry.user_id, entry.rank);
      }
      prevRanksRef.current = newRanks;

      setEntries(newEntries);
    } catch {
      setError("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  }, [contestId, matchId]);

  // Initial fetch + Supabase Realtime subscription
  useEffect(() => {
    if (!contestId) return;

    fetchLeaderboard();

    const supabase = createClient();

    // Subscribe to changes on contest_members and fantasy_teams
    const channel = supabase
      .channel(`leaderboard-${contestId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contest_members",
          filter: `contest_id=eq.${contestId}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fantasy_teams",
          filter: `contest_id=eq.${contestId}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contestId, fetchLeaderboard]);

  return { entries, loading, error, refresh: fetchLeaderboard };
}
