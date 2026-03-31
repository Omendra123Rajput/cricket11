import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Calendar, ArrowRight, Zap } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Player";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hey, {displayName}!</h1>
          <p className="text-muted-foreground">
            Ready to build your winning team?
          </p>
        </div>
        <Link href="/contests/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Contest
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/contests/create">
          <Card className="glass border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Create Contest</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/contests/join">
          <Card className="glass border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm font-medium">Join Contest</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/matches">
          <Card className="glass border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Matches</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analytics">
          <Card className="glass border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-medium">Analytics</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Matches Preview */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Upcoming Matches</CardTitle>
          <Link
            href="/matches"
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Placeholder — will be dynamic from DB */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Match 1</div>
                </div>
                <div>
                  <div className="font-medium text-sm">CSK vs MI</div>
                  <div className="text-xs text-muted-foreground">
                    Mar 22, 7:30 PM
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Upcoming
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Match 2</div>
                </div>
                <div>
                  <div className="font-medium text-sm">RCB vs KKR</div>
                  <div className="text-xs text-muted-foreground">
                    Mar 23, 3:30 PM
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Upcoming
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Match data will populate once IPL schedule is seeded
            </p>
          </div>
        </CardContent>
      </Card>

      {/* My Contests Preview */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">My Contests</CardTitle>
          <Link
            href="/contests"
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No contests yet. Create one and invite your friends!
            </p>
            <Link href="/contests/create">
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Contest
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
