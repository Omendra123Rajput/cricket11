import { describe, it, expect } from "vitest";
import { calculateFantasyPoints, applyMultiplier } from "../scoring-engine";
import type { LiveMatchStats, ScoringRules } from "@/types";
import rules from "../../../../supabase/seed/scoring_rules.json";

const defaultRules = rules as ScoringRules;

function makeStats(overrides: Partial<LiveMatchStats> = {}): LiveMatchStats {
  return {
    id: 1,
    match_id: 1,
    player_id: 1,
    runs_scored: 0,
    balls_faced: 0,
    fours: 0,
    sixes: 0,
    strike_rate: 0,
    overs_bowled: 0,
    wickets: 0,
    runs_conceded: 0,
    maidens: 0,
    economy: 0,
    catches: 0,
    stumpings: 0,
    run_outs: 0,
    is_duck: false,
    is_not_out: false,
    in_playing_xi: true,
    lbw_bowled_count: 0,
    direct_run_outs: 0,
    raw_data: {},
    last_synced_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("calculateFantasyPoints", () => {
  it("awards playing XI bonus", () => {
    const result = calculateFantasyPoints(makeStats(), "BAT", defaultRules);
    expect(result.bonus).toBe(4);
    expect(result.details.playing_xi).toBe(4);
    expect(result.total).toBe(4);
  });

  it("calculates batting runs correctly", () => {
    const stats = makeStats({
      runs_scored: 45,
      balls_faced: 30,
      fours: 4,
      sixes: 2,
      strike_rate: 150,
    });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);

    // 45 runs * 1 = 45
    expect(result.details.runs).toBe(45);
    // 4 fours * 1 = 4
    expect(result.details.fours).toBe(4);
    // 2 sixes * 2 = 4
    expect(result.details.sixes).toBe(4);
    // 30+ bonus = 4
    expect(result.details.milestone_bonus).toBe(4);
    // SR 150 bracket = 4
    expect(result.details.strike_rate_bonus).toBe(4);
  });

  it("awards half century bonus", () => {
    const stats = makeStats({
      runs_scored: 55,
      balls_faced: 35,
      strike_rate: 157.14,
    });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);
    expect(result.details.milestone_bonus).toBe(8);
  });

  it("awards century bonus", () => {
    const stats = makeStats({
      runs_scored: 102,
      balls_faced: 60,
      strike_rate: 170,
    });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);
    expect(result.details.milestone_bonus).toBe(16);
  });

  it("applies duck penalty for BAT", () => {
    const stats = makeStats({
      runs_scored: 0,
      balls_faced: 3,
      is_duck: true,
      strike_rate: 0,
    });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);
    expect(result.details.duck_penalty).toBe(-2);
  });

  it("does NOT apply duck penalty for BOWL", () => {
    const stats = makeStats({
      runs_scored: 0,
      balls_faced: 3,
      is_duck: true,
      strike_rate: 0,
    });
    const result = calculateFantasyPoints(stats, "BOWL", defaultRules);
    expect(result.details.duck_penalty).toBeUndefined();
  });

  it("calculates bowling points correctly", () => {
    const stats = makeStats({
      overs_bowled: 4,
      wickets: 3,
      runs_conceded: 24,
      economy: 6.0,
      maidens: 1,
      lbw_bowled_count: 2,
    });
    const result = calculateFantasyPoints(stats, "BOWL", defaultRules);

    // 3 wickets * 25 = 75
    expect(result.details.wickets).toBe(75);
    // 3w bonus = 4
    expect(result.details.wicket_haul_bonus).toBe(4);
    // 1 maiden * 12 = 12
    expect(result.details.maiden_bonus).toBe(12);
    // 2 lbw/bowled * 8 = 16
    expect(result.details.lbw_bowled_bonus).toBe(16);
    // economy 6.0 matches bracket (5-6) = 4
    expect(result.details.economy_bonus).toBe(4);
  });

  it("awards 5-wicket haul bonus", () => {
    const stats = makeStats({
      overs_bowled: 4,
      wickets: 5,
      runs_conceded: 20,
      economy: 5.0,
    });
    const result = calculateFantasyPoints(stats, "BOWL", defaultRules);
    expect(result.details.wicket_haul_bonus).toBe(16);
  });

  it("calculates fielding points correctly", () => {
    const stats = makeStats({
      catches: 3,
      stumpings: 1,
      run_outs: 2,
      direct_run_outs: 1,
    });
    const result = calculateFantasyPoints(stats, "WK", defaultRules);

    // 3 catches * 8 = 24
    expect(result.details.catches).toBe(24);
    // 3+ catch bonus = 4
    expect(result.details.catch_bonus).toBe(4);
    // 1 stumping * 12 = 12
    expect(result.details.stumpings).toBe(12);
    // 1 direct (12) + 1 indirect (6) = 18
    expect(result.details.run_outs).toBe(18);
    expect(result.fielding).toBe(58);
  });

  it("skips SR bonus if not enough balls faced", () => {
    const stats = makeStats({
      runs_scored: 18,
      balls_faced: 6,
      strike_rate: 300,
    });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);
    expect(result.details.strike_rate_bonus).toBeUndefined();
  });

  it("skips economy bonus if not enough overs", () => {
    const stats = makeStats({
      overs_bowled: 1,
      wickets: 1,
      economy: 4.0,
    });
    const result = calculateFantasyPoints(stats, "BOWL", defaultRules);
    expect(result.details.economy_bonus).toBeUndefined();
  });

  it("no batting/bowling for non-playing XI", () => {
    const stats = makeStats({ in_playing_xi: false });
    const result = calculateFantasyPoints(stats, "BAT", defaultRules);
    expect(result.total).toBe(0);
    expect(result.bonus).toBe(0);
  });
});

describe("applyMultiplier", () => {
  it("doubles points for captain", () => {
    expect(applyMultiplier(50, true, false, defaultRules)).toBe(100);
  });

  it("applies 1.5x for vice captain", () => {
    expect(applyMultiplier(50, false, true, defaultRules)).toBe(75);
  });

  it("returns original for regular player", () => {
    expect(applyMultiplier(50, false, false, defaultRules)).toBe(50);
  });
});
