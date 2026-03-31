import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IPL_TEAMS } from "@/lib/utils/constants";
import { formatMatchDateTime, getTimeUntil } from "@/lib/utils/format";
import { ArrowLeft, MapPin, Clock, Users, PlusCircle } from "lucide-react";
import { LiveMatchWrapper } from "@/components/matches/live-match-wrapper";
import type { Match } from "@/types";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const supabase = await createClient();

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", Number(matchId))
    .single();

  if (!match) notFound();

  const typedMatch = match as Match;
  const homeTeam = IPL_TEAMS[typedMatch.team_home as keyof typeof IPL_TEAMS];
  const awayTeam = IPL_TEAMS[typedMatch.team_away as keyof typeof IPL_TEAMS];

  // Fetch user's contests to show "Create Team" buttons
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userContests: { contest_id: string; contests: { name: string } }[] = [];
  if (user) {
    const { data } = await supabase
      .from("contest_members")
      .select("contest_id, contests(name)")
      .eq("user_id", user.id);
    userContests = (data || []) as any;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/matches">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">
            Match {typedMatch.match_number}
          </h1>
          <p className="text-xs text-muted-foreground">IPL 2026</p>
        </div>
      </div>

      {/* Match Card */}
      <Card className="glass border-border/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6 space-y-6">
          {/* Status */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={
                typedMatch.status === "live"
                  ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                  : typedMatch.status === "upcoming"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {typedMatch.status === "live" ? "🔴 LIVE" : typedMatch.status.toUpperCase()}
            </Badge>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between px-4">
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold mx-auto"
                style={{
                  backgroundColor: `${homeTeam?.color}20`,
                  color: homeTeam?.color,
                }}
              >
                {typedMatch.team_home}
              </div>
              <div className="font-semibold">{homeTeam?.name || typedMatch.team_home}</div>
            </div>

            <div className="text-2xl font-bold text-muted-foreground">VS</div>

            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold mx-auto"
                style={{
                  backgroundColor: `${awayTeam?.color}20`,
                  color: awayTeam?.color,
                }}
              >
                {typedMatch.team_away}
              </div>
              <div className="font-semibold">{awayTeam?.name || typedMatch.team_away}</div>
            </div>
          </div>

          {/* Result */}
          {typedMatch.result_summary && (
            <p className="text-sm text-center text-primary font-medium">
              {typedMatch.result_summary}
            </p>
          )}

          {/* Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {typedMatch.status === "upcoming"
                ? `Starts in ${getTimeUntil(typedMatch.start_time)}`
                : formatMatchDateTime(typedMatch.start_time)}
            </div>
            {typedMatch.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {typedMatch.city}
              </div>
            )}
          </div>

          {typedMatch.venue && (
            <p className="text-xs text-muted-foreground text-center">
              {typedMatch.venue}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Live Score / Countdown */}
      {(typedMatch.status === "upcoming" || typedMatch.status === "live") && (
        <LiveMatchWrapper
          matchId={typedMatch.id}
          matchStatus={typedMatch.status}
          startTime={typedMatch.start_time}
          teamHome={typedMatch.team_home}
          teamAway={typedMatch.team_away}
        />
      )}

      {/* Create Team for Contest */}
      {typedMatch.status === "upcoming" && userContests.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Create Team for This Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userContests.map((uc) => (
              <Link
                key={uc.contest_id}
                href={`/matches/${matchId}/create-team?contestId=${uc.contest_id}`}
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <span className="text-sm font-medium">
                    {uc.contests?.name || "Contest"}
                  </span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Create Team
                  </Button>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {typedMatch.status === "upcoming" && userContests.length === 0 && (
        <Card className="glass border-border/50">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Join a contest first to create teams for this match
            </p>
            <Link href="/contests">
              <Button size="sm" variant="outline">
                Browse Contests
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
