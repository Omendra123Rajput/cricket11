// CricAPI adapter (https://www.cricapi.com/)
// Free tier: 100K hits/hour

import type {
  CricAPIMatch,
  CricAPIScorecard,
  NormalizedMatchData,
  NormalizedPlayerStats,
} from "@/types/cricket";

const BASE_URL = "https://api.cricapi.com/v1";

function getApiKey(): string {
  const key = process.env.CRICAPI_KEY;
  if (!key) throw new Error("CRICAPI_KEY environment variable is not set");
  return key;
}

async function fetchCricAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("apikey", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 }, // no Next.js cache for live data
  });

  if (!res.ok) {
    throw new Error(`CricAPI error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.status !== "success") {
    console.error(`[CricAPI] Failure:`, JSON.stringify({ status: json.status, reason: json.reason, info: json.info }));
    throw new Error(`CricAPI: ${json.reason || json.status || "Unknown error"}`);
  }

  return json.data;
}

// Get list of current/recent matches
export async function getMatches(): Promise<CricAPIMatch[]> {
  return fetchCricAPI<CricAPIMatch[]>("currentMatches", {
    offset: "0",
  });
}

// Get detailed scorecard for a specific match
export async function getScorecard(matchId: string): Promise<CricAPIScorecard> {
  return fetchCricAPI<CricAPIScorecard>("match_scorecard", {
    id: matchId,
  });
}

// Get match info
export async function getMatchInfo(matchId: string): Promise<CricAPIMatch> {
  return fetchCricAPI<CricAPIMatch>("match_info", {
    id: matchId,
  });
}

// Get all matches in a series (used for fixture sync)
export async function getSeriesMatches(seriesId: string): Promise<CricAPIMatch[]> {
  const data = await fetchCricAPI<{ matchList?: CricAPIMatch[] }>("series_info", { id: seriesId });
  return data.matchList || [];
}

// Normalize scorecard into our internal format
export function normalizeScorecardData(
  scorecard: CricAPIScorecard
): NormalizedMatchData {
  const playerStatsMap = new Map<string, NormalizedPlayerStats>();

  // Determine match status
  let status: NormalizedMatchData["status"] = "upcoming";
  if (scorecard.matchEnded) {
    status = "completed";
  } else if (scorecard.matchStarted) {
    status = "live";
  }

  // Process each innings
  for (const innings of scorecard.scorecard || []) {
    // Batting stats
    for (const bat of innings.batting || []) {
      const name = bat.batsman.name;
      const existing = playerStatsMap.get(name) || createEmptyStats(name);
      existing.runs = bat.r;
      existing.balls = bat.b;
      existing.fours = bat["4s"];
      existing.sixes = bat["6s"];
      existing.strikeRate = bat.sr;
      existing.inPlayingXI = true;
      existing.isNotOut = !bat.dismissal || bat.dismissal === "not out";
      existing.isDuck = bat.r === 0 && !existing.isNotOut && bat.b > 0;

      // Check for LBW/Bowled dismissals in text
      const dismissalText = (bat["dismissal-text"] || "").toLowerCase();
      if (dismissalText.includes("lbw") || dismissalText.startsWith("b ")) {
        // This player was dismissed by LBW or bowled — credit the bowler later
      }

      playerStatsMap.set(name, existing);
    }

    // Bowling stats
    for (const bowl of innings.bowling || []) {
      const name = bowl.bowler.name;
      const existing = playerStatsMap.get(name) || createEmptyStats(name);
      existing.oversBowled = bowl.o;
      existing.wickets = bowl.w;
      existing.runsConceded = bowl.r;
      existing.maidens = bowl.m;
      existing.economy = bowl.eco;
      existing.inPlayingXI = true;
      playerStatsMap.set(name, existing);
    }

    // Fielding stats
    for (const field of innings.catching || []) {
      const name = field.fielder.name;
      const existing = playerStatsMap.get(name) || createEmptyStats(name);
      existing.catches = (existing.catches || 0) + (field.catches || 0);
      existing.stumpings = (existing.stumpings || 0) + (field.stumpings || 0);
      existing.runOuts = (existing.runOuts || 0) + (field.runouts || 0);
      existing.inPlayingXI = true;
      playerStatsMap.set(name, existing);
    }
  }

  // Count LBW/bowled dismissals per bowler
  for (const innings of scorecard.scorecard || []) {
    for (const bat of innings.batting || []) {
      const dismissalText = (bat["dismissal-text"] || "").toLowerCase();
      if (dismissalText.includes("lbw") || /^b\s/.test(dismissalText)) {
        // Extract bowler name from dismissal text
        // Patterns: "lbw b BowlerName" or "b BowlerName"
        const bowlerMatch = dismissalText.match(/b\s+(.+)$/);
        if (bowlerMatch) {
          const bowlerName = bowlerMatch[1].trim();
          // Find the bowler in our stats (case insensitive partial match)
          for (const [name, stats] of playerStatsMap) {
            if (name.toLowerCase().includes(bowlerName.toLowerCase()) ||
                bowlerName.toLowerCase().includes(name.toLowerCase().split(" ").pop() || "")) {
              stats.lbwBowledCount++;
              break;
            }
          }
        }
      }
    }
  }

  return {
    externalId: scorecard.id,
    status,
    scores: scorecard.score || [],
    playerStats: Array.from(playerStatsMap.values()),
    resultSummary: scorecard.status,
  };
}

function createEmptyStats(name: string): NormalizedPlayerStats {
  return {
    playerName: name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
    oversBowled: 0,
    wickets: 0,
    runsConceded: 0,
    maidens: 0,
    economy: 0,
    catches: 0,
    stumpings: 0,
    runOuts: 0,
    isDuck: false,
    isNotOut: false,
    inPlayingXI: false,
    lbwBowledCount: 0,
    directRunOuts: 0,
  };
}
