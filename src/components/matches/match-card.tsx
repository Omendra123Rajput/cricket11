import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IPL_TEAMS } from "@/lib/utils/constants";
import { formatMatchDateTime, getTimeUntil } from "@/lib/utils/format";
import type { Match, MatchStatus } from "@/types";
import { MapPin, Clock } from "lucide-react";

interface MatchCardProps {
  match: Match;
}

const statusStyles: Record<MatchStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  live: { label: "LIVE", className: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  abandoned: { label: "Abandoned", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
};

export function MatchCard({ match }: MatchCardProps) {
  const homeTeam = IPL_TEAMS[match.team_home as keyof typeof IPL_TEAMS];
  const awayTeam = IPL_TEAMS[match.team_away as keyof typeof IPL_TEAMS];
  const status = statusStyles[match.status];

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="glass rounded-xl p-4 hover:border-primary/20 transition-colors cursor-pointer space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Match {match.match_number}
          </span>
          <Badge variant="outline" className={`text-[10px] ${status.className}`}>
            {status.label}
          </Badge>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${homeTeam?.color}20`, color: homeTeam?.color }}
            >
              {match.team_home}
            </div>
            <span className="font-semibold text-sm">
              {homeTeam?.short || match.team_home}
            </span>
          </div>

          <span className="text-xs text-muted-foreground font-medium">vs</span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {awayTeam?.short || match.team_away}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${awayTeam?.color}20`, color: awayTeam?.color }}
            >
              {match.team_away}
            </div>
          </div>
        </div>

        {/* Result */}
        {match.result_summary && (
          <p className="text-xs text-center text-primary font-medium">
            {match.result_summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {match.status === "upcoming"
              ? getTimeUntil(match.start_time)
              : formatMatchDateTime(match.start_time)}
          </div>
          {match.venue && (
            <div className="flex items-center gap-1 truncate max-w-[50%]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{match.city || match.venue}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
