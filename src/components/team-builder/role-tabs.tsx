"use client";

import { cn } from "@/lib/utils";
import { PLAYER_ROLES, ROLE_LABELS, TEAM_CONSTRAINTS } from "@/lib/utils/constants";
import type { PlayerRole } from "@/types";

interface RoleTabsProps {
  activeRole: PlayerRole;
  onRoleChange: (role: PlayerRole) => void;
  roleCounts: Record<PlayerRole, number>;
}

export function RoleTabs({ activeRole, onRoleChange, roleCounts }: RoleTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-muted/30">
      {PLAYER_ROLES.map((role) => {
        const isActive = activeRole === role;
        const count = roleCounts[role];
        const max = TEAM_CONSTRAINTS.roles[role].max;
        const min = TEAM_CONSTRAINTS.roles[role].min;
        const isFull = count >= max;
        const meetsMin = count >= min;

        return (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={cn(
              "flex-1 py-2 px-2 rounded-md text-center transition-colors text-sm",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50 text-muted-foreground"
            )}
          >
            <div className="font-semibold text-xs">{role}</div>
            <div
              className={cn(
                "text-[10px] mt-0.5",
                isActive
                  ? "text-primary-foreground/70"
                  : isFull
                  ? "text-primary"
                  : meetsMin
                  ? "text-muted-foreground"
                  : "text-yellow-400"
              )}
            >
              {count}/{min}-{max}
            </div>
          </button>
        );
      })}
    </div>
  );
}
