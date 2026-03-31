// Unified cricket API client with caching and CricAPI integration

import * as cricapi from "./cricapi";
import { cacheGet, cacheSet, CACHE_TTL } from "./cache";
import type { NormalizedMatchData } from "@/types/cricket";

export async function fetchLiveScorecard(
  externalMatchId: string
): Promise<NormalizedMatchData | null> {
  // Check cache first
  const cacheKey = `scorecard:${externalMatchId}`;
  const cached = cacheGet<NormalizedMatchData>(cacheKey);
  if (cached) return cached;

  try {
    const scorecard = await cricapi.getScorecard(externalMatchId);
    const normalized = cricapi.normalizeScorecardData(scorecard);
    cacheSet(cacheKey, normalized, CACHE_TTL.SCORES);
    return normalized;
  } catch (error) {
    console.error(
      `[CricAPI] Failed to fetch scorecard for ${externalMatchId}:`,
      error
    );
    return null;
  }
}

export async function fetchCurrentMatches() {
  const cacheKey = "current-matches";
  const cached = cacheGet<Awaited<ReturnType<typeof cricapi.getMatches>>>(cacheKey);
  if (cached) return cached;

  try {
    const matches = await cricapi.getMatches();
    cacheSet(cacheKey, matches, CACHE_TTL.SCHEDULE);
    return matches;
  } catch (error) {
    console.error("[CricAPI] Failed to fetch current matches:", error);
    return null;
  }
}
