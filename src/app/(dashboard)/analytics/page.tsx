import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Trophy } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's contests
  const { data: memberRows } = await supabase
    .from("contest_members")
    .select("contest_id, season_points, contests(name)")
    .eq("user_id", user?.id || "");

  const contests = (memberRows || []) as any[];

  // Fetch user's recent fantasy teams with points
  const { data: recentTeams } = await supabase
    .from("fantasy_teams")
    .select("match_id, total_points, created_at, matches(match_number, team_home, team_away)")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(20);

  const teams = (recentTeams || []) as any[];

  // Stats calculations
  const totalMatches = teams.length;
  const avgPoints =
    totalMatches > 0
      ? Math.round(
          teams.reduce((sum: number, t: any) => sum + t.total_points, 0) /
            totalMatches
        )
      : 0;
  const bestScore =
    totalMatches > 0
      ? Math.max(...teams.map((t: any) => t.total_points))
      : 0;
  const totalContests = contests.length;

  // Prepare chart data (last 10 matches, oldest first)
  const chartData = teams
    .slice(0, 10)
    .reverse()
    .map((t: any) => ({
      label: `M${t.matches?.match_number || "?"}`,
      points: t.total_points,
      match: `${t.matches?.team_home || "?"} vs ${t.matches?.team_away || "?"}`,
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">{avgPoints}</div>
            <div className="text-xs text-muted-foreground">Avg Points</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">{bestScore}</div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">{totalMatches}</div>
            <div className="text-xs text-muted-foreground">Teams Created</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">{totalContests}</div>
            <div className="text-xs text-muted-foreground">Active Contests</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Fantasy Points Trend</CardTitle>
          <CardDescription>Your last 10 match performances</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <AnalyticsCharts data={chartData} />
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Play some matches to see your performance trend
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contest Rankings */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">My Contests</CardTitle>
          <CardDescription>Season points across all contests</CardDescription>
        </CardHeader>
        <CardContent>
          {contests.length > 0 ? (
            <div className="space-y-2">
              {contests.map((c: any) => (
                <div
                  key={c.contest_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                >
                  <span className="text-sm font-medium">
                    {c.contests?.name || "Contest"}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">
                      {c.season_points}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Join a contest to see your rankings
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
