export const IPL_TEAMS = {
  CSK: { name: "Chennai Super Kings", short: "CSK", color: "#FCCA06" },
  MI: { name: "Mumbai Indians", short: "MI", color: "#004BA0" },
  RCB: { name: "Royal Challengers Bengaluru", short: "RCB", color: "#EC1C24" },
  KKR: { name: "Kolkata Knight Riders", short: "KKR", color: "#3A225D" },
  DC: { name: "Delhi Capitals", short: "DC", color: "#00247D" },
  PBKS: { name: "Punjab Kings", short: "PBKS", color: "#DD1F2D" },
  RR: { name: "Rajasthan Royals", short: "RR", color: "#EA1A85" },
  SRH: { name: "Sunrisers Hyderabad", short: "SRH", color: "#FF822A" },
  GT: { name: "Gujarat Titans", short: "GT", color: "#1C1C2B" },
  LSG: { name: "Lucknow Super Giants", short: "LSG", color: "#A72056" },
} as const;

export type IPLTeamCode = keyof typeof IPL_TEAMS;

export const PLAYER_ROLES = ["WK", "BAT", "AR", "BOWL"] as const;
export type PlayerRole = (typeof PLAYER_ROLES)[number];

export const ROLE_LABELS: Record<PlayerRole, string> = {
  WK: "Wicket Keeper",
  BAT: "Batsman",
  AR: "All Rounder",
  BOWL: "Bowler",
};

export const TEAM_CONSTRAINTS = {
  totalPlayers: 11,
  totalCredits: 100,
  maxPerTeam: 7,
  maxOverseas: 4,
  roles: {
    WK: { min: 1, max: 4 },
    BAT: { min: 1, max: 6 },
    AR: { min: 1, max: 4 },
    BOWL: { min: 1, max: 6 },
  },
} as const;

export const SEASON_POINTS = {
  rank1: 3,
  rank2: 2,
  rankOther: -1,
} as const;

export const APP_NAME = "CrickContest";
