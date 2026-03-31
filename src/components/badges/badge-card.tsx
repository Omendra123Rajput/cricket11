"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Badge } from "@/types";

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  earnedAt?: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  batting: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  bowling: "from-green-500/20 to-green-600/10 border-green-500/30",
  streak: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  social: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  special: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
};

export function BadgeCard({ badge, earned, earnedAt }: BadgeCardProps) {
  const categoryStyle =
    CATEGORY_STYLES[badge.category] || CATEGORY_STYLES.special;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border bg-gradient-to-b transition-all ${
              earned
                ? categoryStyle
                : "from-muted/20 to-muted/10 border-border/30 opacity-40 grayscale"
            }`}
          >
            <span className="text-2xl" role="img" aria-label={badge.name}>
              {badge.icon}
            </span>
            <span className="text-[10px] font-medium text-center leading-tight">
              {badge.name}
            </span>
            {earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
              >
                <span className="text-[8px] text-white font-bold">✓</span>
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <p className="font-semibold text-xs">{badge.name}</p>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
          {earned && earnedAt && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Earned {new Date(earnedAt).toLocaleDateString("en-IN")}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
