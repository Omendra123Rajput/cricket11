import type {
  ScoringRules,
  PointsBreakdown,
  LiveMatchStats,
  PlayerRole,
} from "@/types";
import defaultRulesJson from "../../../supabase/seed/scoring_rules.json";

const DEFAULT_RULES = defaultRulesJson as ScoringRules;

export function calculateFantasyPoints(
  stats: LiveMatchStats,
  playerRole: PlayerRole,
  rules: ScoringRules = DEFAULT_RULES
): PointsBreakdown {
  const details: PointsBreakdown["details"] = {};
  let batting = 0;
  let bowling = 0;
  let fielding = 0;
  let bonus = 0;

  // ============================================================
  // BATTING
  // ============================================================
  if (stats.runs_scored > 0 || stats.balls_faced > 0) {
    // Runs
    const runPts = stats.runs_scored * rules.batting.run;
    details.runs = runPts;
    batting += runPts;

    // Boundaries
    const fourPts = stats.fours * rules.batting.four_bonus;
    details.fours = fourPts;
    batting += fourPts;

    const sixPts = stats.sixes * rules.batting.six_bonus;
    details.sixes = sixPts;
    batting += sixPts;

    // Milestones
    let milestone = 0;
    if (stats.runs_scored >= 100) milestone = rules.batting.century;
    else if (stats.runs_scored >= 50) milestone = rules.batting.half_century;
    else if (stats.runs_scored >= 30) milestone = rules.batting.thirty_bonus;
    if (milestone > 0) {
      details.milestone_bonus = milestone;
      batting += milestone;
    }

    // Duck penalty
    if (
      stats.is_duck &&
      rules.batting.duck_applies_to.includes(playerRole)
    ) {
      details.duck_penalty = rules.batting.duck;
      batting += rules.batting.duck;
    }

    // Strike rate bonus (only if enough balls faced)
    if (stats.balls_faced >= rules.batting.min_balls_for_sr_bonus) {
      const sr = stats.strike_rate;
      for (const bracket of rules.batting.strike_rate_brackets) {
        const matchesMin = sr >= bracket.min;
        const matchesMax = bracket.max === null || sr <= bracket.max;
        if (matchesMin && matchesMax) {
          details.strike_rate_bonus = bracket.points;
          batting += bracket.points;
          break;
        }
      }
    }
  }

  // ============================================================
  // BOWLING
  // ============================================================
  if (stats.overs_bowled > 0) {
    // Wickets
    const wicketPts = stats.wickets * rules.bowling.wicket;
    details.wickets = wicketPts;
    bowling += wicketPts;

    // Wicket haul bonuses
    let haulBonus = 0;
    if (stats.wickets >= 5) haulBonus = rules.bowling.bonus_5w;
    else if (stats.wickets >= 4) haulBonus = rules.bowling.bonus_4w;
    else if (stats.wickets >= 3) haulBonus = rules.bowling.bonus_3w;
    if (haulBonus > 0) {
      details.wicket_haul_bonus = haulBonus;
      bowling += haulBonus;
    }

    // Maiden overs
    if (stats.maidens > 0) {
      const maidenPts = stats.maidens * rules.bowling.maiden;
      details.maiden_bonus = maidenPts;
      bowling += maidenPts;
    }

    // LBW/Bowled bonus
    if (stats.lbw_bowled_count > 0) {
      const lbwPts = stats.lbw_bowled_count * rules.bowling.lbw_bowled_bonus;
      details.lbw_bowled_bonus = lbwPts;
      bowling += lbwPts;
    }

    // Economy rate bonus (only if enough overs)
    if (stats.overs_bowled >= rules.bowling.min_overs_for_econ_bonus) {
      const econ = stats.economy;
      for (const bracket of rules.bowling.economy_brackets) {
        const matchesMin = econ >= bracket.min;
        const matchesMax = bracket.max === null || econ <= bracket.max;
        if (matchesMin && matchesMax) {
          details.economy_bonus = bracket.points;
          bowling += bracket.points;
          break;
        }
      }
    }
  }

  // ============================================================
  // FIELDING
  // ============================================================
  if (stats.catches > 0) {
    const catchPts = stats.catches * rules.fielding.catch;
    details.catches = catchPts;
    fielding += catchPts;

    // 3+ catches bonus
    if (stats.catches >= 3) {
      details.catch_bonus = rules.fielding.three_catch_bonus;
      fielding += rules.fielding.three_catch_bonus;
    }
  }

  if (stats.stumpings > 0) {
    const stumpPts = stats.stumpings * rules.fielding.stumping;
    details.stumpings = stumpPts;
    fielding += stumpPts;
  }

  if (stats.run_outs > 0) {
    // Direct run outs get more points
    const directPts = stats.direct_run_outs * rules.fielding.run_out_direct;
    const indirectPts =
      (stats.run_outs - stats.direct_run_outs) * rules.fielding.run_out_indirect;
    details.run_outs = directPts + indirectPts;
    fielding += directPts + indirectPts;
  }

  // ============================================================
  // BONUS (Playing XI)
  // ============================================================
  if (stats.in_playing_xi) {
    details.playing_xi = rules.other.playing_xi;
    bonus += rules.other.playing_xi;
  }

  const total = batting + bowling + fielding + bonus;

  return {
    batting,
    bowling,
    fielding,
    bonus,
    total,
    details,
  };
}

// Apply captain/VC multiplier
export function applyMultiplier(
  points: number,
  isCaptain: boolean,
  isViceCaptain: boolean,
  rules: ScoringRules = DEFAULT_RULES
): number {
  if (isCaptain) return points * rules.other.captain_multiplier;
  if (isViceCaptain) return points * rules.other.vice_captain_multiplier;
  return points;
}
