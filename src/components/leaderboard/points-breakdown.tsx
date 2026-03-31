"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PointsBreakdown } from "@/types";

interface PointsBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  playerRole: string;
  breakdown: PointsBreakdown | null;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  multipliedTotal?: number;
}

const DETAIL_LABELS: Record<string, { label: string; category: string }> = {
  runs: { label: "Runs Scored", category: "batting" },
  fours: { label: "Boundary Bonus (4s)", category: "batting" },
  sixes: { label: "Six Bonus (6s)", category: "batting" },
  strike_rate_bonus: { label: "Strike Rate Bonus", category: "batting" },
  milestone_bonus: { label: "Milestone Bonus", category: "batting" },
  duck_penalty: { label: "Duck Penalty", category: "batting" },
  wickets: { label: "Wickets", category: "bowling" },
  economy_bonus: { label: "Economy Rate Bonus", category: "bowling" },
  maiden_bonus: { label: "Maiden Over Bonus", category: "bowling" },
  lbw_bowled_bonus: { label: "LBW/Bowled Bonus", category: "bowling" },
  wicket_haul_bonus: { label: "Wicket Haul Bonus", category: "bowling" },
  catches: { label: "Catches", category: "fielding" },
  stumpings: { label: "Stumpings", category: "fielding" },
  run_outs: { label: "Run Outs", category: "fielding" },
  catch_bonus: { label: "3+ Catches Bonus", category: "fielding" },
  playing_xi: { label: "Playing XI", category: "bonus" },
};

const CATEGORY_COLORS: Record<string, string> = {
  batting: "text-blue-400",
  bowling: "text-green-400",
  fielding: "text-orange-400",
  bonus: "text-purple-400",
};

function PointRow({
  label,
  points,
  category,
  index,
}: {
  label: string;
  points: number;
  category: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between py-1.5"
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          points >= 0 ? CATEGORY_COLORS[category] || "" : "text-red-400"
        }`}
      >
        {points > 0 ? "+" : ""}
        {points}
      </span>
    </motion.div>
  );
}

export function PointsBreakdownModal({
  open,
  onOpenChange,
  playerName,
  playerRole,
  breakdown,
  isCaptain,
  isViceCaptain,
  multipliedTotal,
}: PointsBreakdownModalProps) {
  if (!breakdown) return null;

  const detailEntries = Object.entries(breakdown.details).filter(
    ([, value]) => value !== 0 && value !== undefined
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {playerName}
            <Badge variant="outline" className="text-[10px]">
              {playerRole}
            </Badge>
            {isCaptain && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">
                C
              </Badge>
            )}
            {isViceCaptain && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">
                VC
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Summaries */}
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { key: "batting", label: "BAT", value: breakdown.batting },
                { key: "bowling", label: "BOWL", value: breakdown.bowling },
                { key: "fielding", label: "FIELD", value: breakdown.fielding },
                { key: "bonus", label: "BONUS", value: breakdown.bonus },
              ] as const
            ).map((cat) => (
              <div
                key={cat.key}
                className="text-center p-2 rounded-lg bg-muted/20"
              >
                <div
                  className={`text-lg font-bold tabular-nums ${CATEGORY_COLORS[cat.key]}`}
                >
                  {cat.value}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">
                  {cat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Rows */}
          <div className="border-t border-border/50 pt-3">
            {detailEntries.map(([key, value], index) => {
              const meta = DETAIL_LABELS[key];
              return (
                <PointRow
                  key={key}
                  label={meta?.label || key}
                  points={value as number}
                  category={meta?.category || "bonus"}
                  index={index}
                />
              );
            })}
          </div>

          {/* Total */}
          <div className="border-t border-border/50 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Base Total</span>
              <span className="text-lg font-bold tabular-nums">
                {breakdown.total}
              </span>
            </div>

            {(isCaptain || isViceCaptain) && multipliedTotal !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {isCaptain ? "Captain (2x)" : "Vice Captain (1.5x)"}
                </span>
                <motion.span
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-bold tabular-nums text-primary"
                >
                  {multipliedTotal}
                </motion.span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
