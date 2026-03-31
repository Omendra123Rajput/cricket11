import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPL_TEAMS } from "@/lib/utils/constants";
import { ContestLeaderboardLive } from "@/components/leaderboard/contest-leaderboard-live";
import { LiveMatchWrapper } from "@/components/matches/live-match-wrapper";
import { ArrowLeft } from "lucide-react";
import type { Match } from "@/types";

export default async function ContestMatchLeaderboardPage({
  params,
}: {
  params: Promise<{ contestId: string; matchId: string }>;
}) {
  const { contestId, matchId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch contest and match in parallel
  const [contestRes, matchRes] = await Promise.all([
    supabase.from("contests").select("id, name").eq("id", contestId).single(),
    supabase
      .from("matches")
      .select("*")
      .eq("id", Number(matchId))
      .single(),
  ]);

  if (!contestRes.data || !matchRes.data) notFound();

  const contest = contestRes.data;
  const match = matchRes.data as Match;
  const homeTeam = IPL_TEAMS[match.team_home as keyof typeof IPL_TEAMS];
  const awayTeam = IPL_TEAMS[match.team_away as keyof typeof IPL_TEAMS];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/contests/${contestId}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">{contest.name}</h1>
          <p className="text-xs text-muted-foreground">
            Match {match.match_number}: {homeTeam?.short || match.team_home} vs{" "}
            {awayTeam?.short || match.team_away}
          </p>
        </div>
      </div>

      {/* Live Score / Countdown */}
      {(match.status === "upcoming" || match.status === "live") && (
        <LiveMatchWrapper
          matchId={match.id}
          matchStatus={match.status}
          startTime={match.start_time}
          teamHome={match.team_home}
          teamAway={match.team_away}
        />
      )}

      {/* Match Leaderboard */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Match Leaderboard</CardTitle>
          <CardDescription>
            Fantasy points for this match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContestLeaderboardLive
            contestId={contestId}
            currentUserId={user?.id || null}
            matchId={Number(matchId)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
