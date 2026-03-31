import Link from "next/link";
import { getMyContests } from "@/actions/contests";
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
import { Trophy, Plus, Users, Crown, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export default async function ContestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await getMyContests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Contests</h1>
        <div className="flex gap-2">
          <Link href="/contests/join">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Join
            </Button>
          </Link>
          <Link href="/contests/create">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </Link>
        </div>
      </div>

      {memberships && memberships.length > 0 ? (
        <div className="space-y-3">
          {memberships.map((membership: any) => {
            const contest = membership.contests;
            if (!contest) return null;

            const isAdmin = membership.role === "admin";

            return (
              <Link key={contest.id} href={`/contests/${contest.id}`}>
                <Card className="glass border-border/50 hover:border-primary/20 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">
                            {contest.name}
                          </h3>
                          {isAdmin && (
                            <Crown className="w-3 h-3 text-yellow-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>
                            Created {formatDate(contest.created_at)}
                          </span>
                          <Badge
                            variant={contest.is_active ? "default" : "secondary"}
                            className="text-[10px] h-4 px-1.5"
                          >
                            {contest.is_active ? "Active" : "Closed"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold">
                          {membership.season_points}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          season pts
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="glass border-border/50">
          <CardContent className="py-12 text-center">
            <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No contests yet. Create one and invite your friends!
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contests/join">
                <Button size="sm" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Contest
                </Button>
              </Link>
              <Link href="/contests/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contest
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
