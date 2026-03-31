"use client";

import { cn } from "@/lib/utils";
import { IPL_TEAMS } from "@/lib/utils/constants";
import type { Player } from "@/types";

interface CaptainSelectorProps {
  players: Player[];
  captainId: number | null;
  viceCaptainId: number | null;
  onSetCaptain: (id: number) => void;
  onSetViceCaptain: (id: number) => void;
}

export function CaptainSelector({
  players,
  captainId,
  viceCaptainId,
  onSetCaptain,
  onSetViceCaptain,
}: CaptainSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold">Choose Captain & Vice Captain</h3>
        <p className="text-sm text-muted-foreground">
          Captain gets <span className="text-primary font-semibold">2x</span>{" "}
          points, Vice Captain gets{" "}
          <span className="text-primary font-semibold">1.5x</span> points
        </p>
      </div>

      <div className="space-y-2">
        {players.map((player) => {
          const isCaptain = player.id === captainId;
          const isViceCaptain = player.id === viceCaptainId;
          const teamInfo = IPL_TEAMS[player.team as keyof typeof IPL_TEAMS];
          const teamColor = teamInfo?.color || "#666";

          return (
            <div
              key={player.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
            >
              <div
                className="w-1 h-10 rounded-full shrink-0"
                style={{ backgroundColor: teamColor }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{player.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {player.team} · {player.role} · {player.credit_value} cr
                </div>
              </div>

              {/* Captain button */}
              <button
                onClick={() => onSetCaptain(player.id)}
                className={cn(
                  "w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                  isCaptain
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                C
              </button>

              {/* Vice Captain button */}
              <button
                onClick={() => onSetViceCaptain(player.id)}
                className={cn(
                  "w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                  isViceCaptain
                    ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                VC
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
