"use client";

import { TEAM_CONSTRAINTS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

interface CreditBarProps {
  usedCredits: number;
  remainingCredits: number;
  playerCount: number;
}

export function CreditBar({
  usedCredits,
  remainingCredits,
  playerCount,
}: CreditBarProps) {
  const percentage = (usedCredits / TEAM_CONSTRAINTS.totalCredits) * 100;
  const isOverBudget = remainingCredits < 0;

  return (
    <div className="glass rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Players: <span className="text-foreground font-semibold">{playerCount}</span>/11
        </span>
        <span className="text-muted-foreground">
          Credits:{" "}
          <span
            className={cn(
              "font-semibold",
              isOverBudget ? "text-destructive" : "text-foreground"
            )}
          >
            {usedCredits.toFixed(1)}
          </span>
          /{TEAM_CONSTRAINTS.totalCredits}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isOverBudget
              ? "bg-destructive"
              : percentage > 90
              ? "bg-yellow-500"
              : "bg-primary"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-center">
        <span
          className={cn(
            "text-xs font-medium",
            isOverBudget ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {remainingCredits.toFixed(1)} credits remaining
        </span>
      </div>
    </div>
  );
}
