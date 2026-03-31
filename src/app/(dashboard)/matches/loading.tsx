import { MatchCardSkeleton } from "@/components/ui/skeleton-card";

export default function MatchesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted/30 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        {["Upcoming", "Live", "Completed"].map((tab) => (
          <div
            key={tab}
            className="h-9 w-24 bg-muted/20 rounded-lg animate-pulse"
          />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
