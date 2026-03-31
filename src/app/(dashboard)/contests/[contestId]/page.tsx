import { notFound } from "next/navigation";
import Link from "next/link";
import { getContestById } from "@/actions/contests";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteLinkShare } from "@/components/contests/invite-link-share";
import { ContestLeaderboardLive } from "@/components/leaderboard/contest-leaderboard-live";
import {
  Trophy,
  Users,
  ArrowLeft,
  Crown,
  BarChart3,
} from "lucide-react";

export default async function ContestDetailPage({
  params,
}: {
  params: Promise<{ contestId: string }>;
}) {
  const { contestId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: contest, error } = await getContestById(contestId);

  if (error || !contest) {
    notFound();
  }

  const members = contest.contest_members || [];
  const isAdmin = members.some(
    (m: { user_id: string; role: string }) =>
      m.user_id === user?.id && m.role === "admin"
  );
  const memberCount = members.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/contests">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{contest.name}</h1>
          <p className="text-sm text-muted-foreground">
            {memberCount} / {contest.max_members} members
          </p>
        </div>
        {isAdmin && (
          <Badge variant="secondary" className="gap-1">
            <Crown className="w-3 h-3" />
            Admin
          </Badge>
        )}
      </div>

      {/* Invite Section */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invite Friends</CardTitle>
          <CardDescription>
            Share this code or link to invite friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteLinkShare
            inviteCode={contest.invite_code}
            contestName={contest.name}
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold">{memberCount}</div>
            <div className="text-xs text-muted-foreground">Members</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Matches Played</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-xl font-bold">IPL 2026</div>
            <div className="text-xs text-muted-foreground">Season</div>
          </CardContent>
        </Card>
      </div>

      {/* Scoring Rules Summary */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Season Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-yellow-500/10 p-3">
              <div className="text-lg font-bold text-yellow-400">+3</div>
              <div className="text-xs text-muted-foreground">1st Place</div>
            </div>
            <div className="rounded-lg bg-gray-400/10 p-3">
              <div className="text-lg font-bold text-gray-300">+2</div>
              <div className="text-xs text-muted-foreground">2nd Place</div>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3">
              <div className="text-lg font-bold text-red-400">-1</div>
              <div className="text-xs text-muted-foreground">Others</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Leaderboard (Realtime) */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Season Leaderboard</CardTitle>
          <CardDescription>
            Rankings across all IPL matches this season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContestLeaderboardLive
            contestId={contestId}
            currentUserId={user?.id || null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
