import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchCard } from "@/components/matches/match-card";
import { Calendar, Radio, CheckCircle } from "lucide-react";
import type { Match } from "@/types";

export default async function MatchesPage() {
  const supabase = await createClient();

  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("season", 2026)
    .order("start_time", { ascending: true });

  const allMatches = (matches || []) as Match[];
  const upcoming = allMatches.filter((m) => m.status === "upcoming");
  const live = allMatches.filter((m) => m.status === "live");
  const completed = allMatches.filter((m) => m.status === "completed" || m.status === "abandoned");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">IPL 2026 Matches</h1>

      <Tabs defaultValue={live.length > 0 ? "live" : "upcoming"}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="upcoming" className="gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Live ({live.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Done ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {upcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState text="No upcoming matches" />
          )}
        </TabsContent>

        <TabsContent value="live" className="mt-4">
          {live.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {live.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState text="No live matches right now" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completed.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {completed.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState text="No completed matches yet" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="glass rounded-xl py-12 text-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
