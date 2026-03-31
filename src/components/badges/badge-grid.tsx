"use client";

import { motion } from "framer-motion";
import { BadgeCard } from "./badge-card";
import type { Badge, UserBadge } from "@/types";

interface BadgeGridProps {
  badges: Badge[];
  userBadges: UserBadge[];
  filterCategory?: string;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "batting", label: "Batting" },
  { key: "bowling", label: "Bowling" },
  { key: "streak", label: "Streak" },
  { key: "social", label: "Social" },
  { key: "special", label: "Special" },
];

export function BadgeGrid({
  badges,
  userBadges,
  filterCategory,
}: BadgeGridProps) {
  const earnedMap = new Map<number, string>();
  for (const ub of userBadges) {
    earnedMap.set(ub.badge_id, ub.earned_at);
  }

  const filtered = filterCategory && filterCategory !== "all"
    ? badges.filter((b) => b.category === filterCategory)
    : badges;

  // Sort: earned first, then by category
  const sorted = [...filtered].sort((a, b) => {
    const aEarned = earnedMap.has(a.id) ? 0 : 1;
    const bEarned = earnedMap.has(b.id) ? 0 : 1;
    if (aEarned !== bEarned) return aEarned - bEarned;
    return a.category.localeCompare(b.category);
  });

  const earnedCount = userBadges.length;
  const totalCount = badges.length;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {earnedCount} / {totalCount} badges earned
        </span>
        <div className="w-32 h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%`,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {sorted.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <BadgeCard
              badge={badge}
              earned={earnedMap.has(badge.id)}
              earnedAt={earnedMap.get(badge.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { CATEGORIES as BADGE_CATEGORIES };
