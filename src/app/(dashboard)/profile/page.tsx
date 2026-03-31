import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeGrid } from "@/components/badges/badge-grid";
import { Trophy, Flame, Target, Calendar } from "lucide-react";
import type { Profile, Badge as BadgeType, UserBadge } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile, badges, and user badges in parallel
  const [profileRes, badgesRes, userBadgesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id || "")
      .single(),
    supabase.from("badges").select("*").order("category"),
    supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", user?.id || ""),
  ]);

  const profile = profileRes.data as Profile | null;
  const badges = (badgesRes.data || []) as BadgeType[];
  const userBadges = (userBadgesRes.data || []) as UserBadge[];

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Player";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Card */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">
              {profile?.total_points || 0}
            </div>
            <div className="text-xs text-muted-foreground">Season Points</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">
              {profile?.matches_played || 0}
            </div>
            <div className="text-xs text-muted-foreground">Matches Played</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">
              {profile?.streak_current || 0}
            </div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold">{userBadges.length}</div>
            <div className="text-xs text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeGrid badges={badges} userBadges={userBadges} />
        </CardContent>
      </Card>
    </div>
  );
}
