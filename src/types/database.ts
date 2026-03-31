// Hand-written database types matching our Supabase schema
// Replace with `supabase gen types typescript` output once DB is live

export type MatchStatus = "upcoming" | "live" | "completed" | "abandoned";
export type PlayerRole = "WK" | "BAT" | "AR" | "BOWL";
export type ContestMemberRole = "admin" | "member";
export type BadgeCategory = "batting" | "bowling" | "streak" | "social" | "special";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  streak_current: number;
  streak_best: number;
  total_points: number;
  matches_played: number;
  first_place_count: number;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: number;
  name: string;
  slug: string;
  team: string;
  role: PlayerRole;
  credit_value: number;
  image_url: string | null;
  is_overseas: boolean;
  batting_style: string | null;
  bowling_style: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface Match {
  id: number;
  external_id: string | null;
  season: number;
  match_number: number | null;
  team_home: string;
  team_away: string;
  venue: string | null;
  city: string | null;
  start_time: string;
  status: MatchStatus;
  toss_winner: string | null;
  toss_decision: string | null;
  result_summary: string | null;
  scorecard: Record<string, unknown>;
  last_synced_at: string | null;
  created_at: string;
}

export interface Contest {
  id: string;
  name: string;
  created_by: string;
  invite_code: string;
  season: number;
  max_members: number;
  scoring_rules: ScoringRules;
  is_active: boolean;
  created_at: string;
}

export interface ContestMember {
  id: string;
  contest_id: string;
  user_id: string;
  role: ContestMemberRole;
  season_points: number;
  rank: number | null;
  joined_at: string;
}

export interface FantasyTeam {
  id: string;
  user_id: string;
  contest_id: string;
  match_id: number;
  captain_player_id: number | null;
  vice_captain_player_id: number | null;
  total_credits: number;
  total_points: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface FantasyTeamPlayer {
  id: string;
  fantasy_team_id: string;
  player_id: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  points_earned: number;
}

export interface LiveMatchStats {
  id: number;
  match_id: number;
  player_id: number;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  overs_bowled: number;
  wickets: number;
  runs_conceded: number;
  maidens: number;
  economy: number;
  catches: number;
  stumpings: number;
  run_outs: number;
  is_duck: boolean;
  is_not_out: boolean;
  in_playing_xi: boolean;
  lbw_bowled_count: number;
  direct_run_outs: number;
  raw_data: Record<string, unknown>;
  last_synced_at: string;
}

export interface FantasyPoints {
  id: number;
  match_id: number;
  player_id: number;
  points_breakdown: PointsBreakdown;
  total_points: number;
  calculated_at: string;
}

export interface SeasonLeaderboard {
  id: string;
  contest_id: string;
  user_id: string;
  match_id: number;
  fantasy_points: number;
  position_points: number;
  cumulative_points: number;
  rank: number | null;
  created_at: string;
}

export interface Badge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  criteria: Record<string, unknown>;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: number;
  contest_id: string | null;
  earned_at: string;
}

export interface AuditLog {
  id: number;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ============================================================
// Scoring Types
// ============================================================

export interface StrikeRateBracket {
  min: number;
  max: number | null;
  points: number;
}

export interface EconomyBracket {
  min: number;
  max: number | null;
  points: number;
}

export interface ScoringRules {
  version: number;
  batting: {
    run: number;
    four_bonus: number;
    six_bonus: number;
    thirty_bonus: number;
    half_century: number;
    century: number;
    duck: number;
    duck_applies_to: PlayerRole[];
    strike_rate_brackets: StrikeRateBracket[];
    min_balls_for_sr_bonus: number;
  };
  bowling: {
    wicket: number;
    bonus_3w: number;
    bonus_4w: number;
    bonus_5w: number;
    maiden: number;
    lbw_bowled_bonus: number;
    economy_brackets: EconomyBracket[];
    min_overs_for_econ_bonus: number;
  };
  fielding: {
    catch: number;
    stumping: number;
    run_out_direct: number;
    run_out_indirect: number;
    three_catch_bonus: number;
  };
  other: {
    playing_xi: number;
    captain_multiplier: number;
    vice_captain_multiplier: number;
  };
  season: {
    match_rank_1: number;
    match_rank_2: number;
    match_rank_other: number;
  };
}

export interface PointsBreakdown {
  batting: number;
  bowling: number;
  fielding: number;
  bonus: number;
  total: number;
  details: {
    runs?: number;
    fours?: number;
    sixes?: number;
    strike_rate_bonus?: number;
    milestone_bonus?: number;
    duck_penalty?: number;
    wickets?: number;
    economy_bonus?: number;
    maiden_bonus?: number;
    lbw_bowled_bonus?: number;
    wicket_haul_bonus?: number;
    catches?: number;
    stumpings?: number;
    run_outs?: number;
    catch_bonus?: number;
    playing_xi?: number;
  };
}

// ============================================================
// Joined / View Types (for queries with relations)
// ============================================================

export interface ContestWithMembers extends Contest {
  contest_members: (ContestMember & { profiles: Profile })[];
}

export interface FantasyTeamWithPlayers extends FantasyTeam {
  fantasy_team_players: (FantasyTeamPlayer & { players: Player })[];
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  fantasy_points: number;
  position_points: number;
  cumulative_points: number;
  rank: number;
  rank_change?: number;
}

export interface PlayerWithStats extends Player {
  recent_form?: {
    avg_points: number;
    matches: number;
    last_5_scores: number[];
  };
  selected_by_percent?: number;
}
