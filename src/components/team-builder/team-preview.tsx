"use client";

import { cn } from "@/lib/utils";
import { IPL_TEAMS, PLAYER_ROLES, ROLE_LABELS } from "@/lib/utils/constants";
import type { Player } from "@/types";

interface TeamPreviewProps {
  players: Player[];
  captainId: number | null;
  viceCaptainId: number | null;
  totalCredits: number;
}

export function TeamPreview({
  players,
  captainId,
  viceCaptainId,
  totalCredits,
}: TeamPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold">Team Preview</h3>
        <p className="text-sm text-muted-foreground">
          Total Credits: {totalCredits.toFixed(1)} / 100
        </p>
      </div>

      {PLAYER_ROLES.map((role) => {
        const rolePlayers = players.filter((p) => p.role === role);
        if (rolePlayers.length === 0) return null;

        return (
          <div key={role} className="space-y-1.5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {ROLE_LABELS[role]} ({rolePlayers.length})
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {rolePlayers.map((player) => {
                const isCaptain = player.id === captainId;
                const isViceCaptain = player.id === viceCaptainId;
                const teamInfo =
                  IPL_TEAMS[player.team as keyof typeof IPL_TEAMS];
                const teamColor = teamInfo?.color || "#666";

                return (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm",
                      isCaptain
                        ? "bg-primary/10 border border-primary/20"
                        : isViceCaptain
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-muted/20"
                    )}
                  >
                    <div
                      className="w-1 h-6 rounded-full shrink-0"
                      style={{ backgroundColor: teamColor }}
                    />
                    <span className="flex-1 truncate font-medium">
                      {player.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {player.team}
                    </span>
                    <span className="text-xs font-medium">
                      {player.credit_value}
                    </span>
                    {isCaptain && (
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        C
                      </span>
                    )}
                    {isViceCaptain && (
                      <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                        VC
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
