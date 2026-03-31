"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IPL_TEAMS } from "@/lib/utils/constants";
import type { Player } from "@/types";
import { Check, Plus, Minus, Globe } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  selectable: boolean;
  reason?: string;
  onToggle: () => void;
}

export function PlayerCard({
  player,
  isSelected,
  selectable,
  reason,
  onToggle,
}: PlayerCardProps) {
  const teamInfo = IPL_TEAMS[player.team as keyof typeof IPL_TEAMS];
  const teamColor = teamInfo?.color || "#666";

  return (
    <button
      onClick={onToggle}
      disabled={!selectable && !isSelected}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : selectable
          ? "bg-muted/20 hover:bg-muted/40 border border-transparent"
          : "bg-muted/10 border border-transparent opacity-50 cursor-not-allowed"
      )}
    >
      {/* Team color bar */}
      <div
        className="w-1 h-10 rounded-full shrink-0"
        style={{ backgroundColor: teamColor }}
      />

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{player.name}</span>
          {player.is_overseas && (
            <Globe className="w-3 h-3 text-blue-400 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${teamColor}20`, color: teamColor }}
          >
            {player.team}
          </span>
          {!selectable && !isSelected && reason && (
            <span className="text-[10px] text-destructive">{reason}</span>
          )}
        </div>
      </div>

      {/* Credits */}
      <div className="text-right shrink-0">
        <div className="text-sm font-bold">{player.credit_value}</div>
        <div className="text-[10px] text-muted-foreground">credits</div>
      </div>

      {/* Selection indicator */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isSelected
            ? "bg-primary text-primary-foreground"
            : selectable
            ? "bg-muted/50 text-muted-foreground"
            : "bg-muted/30 text-muted-foreground/50"
        )}
      >
        {isSelected ? (
          <Minus className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}
