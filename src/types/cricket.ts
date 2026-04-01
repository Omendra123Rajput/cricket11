// CricAPI response types (https://www.cricapi.com/)

export interface CricAPIMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: CricAPITeamInfo[];
  score: CricAPIScore[];
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

export interface CricAPITeamInfo {
  name: string;
  shortname: string;
  img: string;
}

export interface CricAPIScore {
  r: number; // runs
  w: number; // wickets
  o: number; // overs
  inning: string;
}

export interface CricAPIScorecard {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  score: CricAPIScore[];
  scorecard: CricAPIScorecardInnings[];
  matchStarted: boolean;
  matchEnded: boolean;
}

export interface CricAPIScorecardInnings {
  batting: CricAPIBatsman[];
  bowling: CricAPIBowler[];
  catching: CricAPICatcher[];
  inning: string;
}

export interface CricAPIBatsman {
  batsman: CricAPIPlayerRef;
  dismissal: string;
  "dismissal-text": string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: number;
}

export interface CricAPIBowler {
  bowler: CricAPIPlayerRef;
  o: number;
  m: number;
  r: number;
  w: number;
  nb: number;
  wd: number;
  eco: number;
}

export interface CricAPICatcher {
  catcher?: CricAPIPlayerRef;
  fielder?: CricAPIPlayerRef; // legacy fallback
  catch?: number;
  catches?: number; // legacy fallback
  stumped?: number;
  stumpings?: number; // legacy fallback
  runout?: number;
  runouts?: number; // legacy fallback
}

export interface CricAPIPlayerRef {
  id: string;
  name: string;
}

// Normalized internal types (adapter output)

export interface NormalizedPlayerStats {
  playerName: string;
  externalPlayerId?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  oversBowled: number;
  wickets: number;
  runsConceded: number;
  maidens: number;
  economy: number;
  catches: number;
  stumpings: number;
  runOuts: number;
  isDuck: boolean;
  isNotOut: boolean;
  inPlayingXI: boolean;
  lbwBowledCount: number;
  directRunOuts: number;
}

export interface NormalizedMatchData {
  externalId: string;
  status: "upcoming" | "live" | "completed" | "abandoned";
  scores: CricAPIScore[];
  playerStats: NormalizedPlayerStats[];
  resultSummary?: string;
  tossWinner?: string;
  tossDecision?: string;
}
