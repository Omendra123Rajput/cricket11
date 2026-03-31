"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface LiveScoreData {
  ok: boolean;
  synced: boolean;
  matchStatus?: string;
  playerCount?: number;
  scores?: { r: number; w: number; o: number; inning: string }[];
}

export function useRealtimeScores(
  matchId: number | null,
  isLive: boolean,
  pollIntervalMs = 30000
) {
  const [data, setData] = useState<LiveScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchScores = useCallback(async () => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cricket/sync-scores?matchId=${matchId}`);
      const json = await res.json();

      if (json.ok) {
        setData(json);
        setLastUpdated(new Date());
      } else {
        setError(json.error || "Failed to sync");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (!matchId || !isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchScores();

    // Start polling
    intervalRef.current = setInterval(fetchScores, pollIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchId, isLive, pollIntervalMs, fetchScores]);

  return { data, loading, error, lastUpdated, refresh: fetchScores };
}
