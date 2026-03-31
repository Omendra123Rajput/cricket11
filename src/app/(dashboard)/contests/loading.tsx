import { ContestCardSkeleton } from "@/components/ui/skeleton-card";

export default function ContestsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted/30 rounded animate-pulse" />
        <div className="h-9 w-28 bg-muted/20 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ContestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
