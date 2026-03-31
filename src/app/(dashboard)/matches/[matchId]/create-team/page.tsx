"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeamBuilder } from "@/hooks/use-team-builder";
import { saveFantasyTeam } from "@/actions/teams";
import { CreditBar } from "@/components/team-builder/credit-bar";
import { RoleTabs } from "@/components/team-builder/role-tabs";
import { PlayerCard } from "@/components/team-builder/player-card";
import { CaptainSelector } from "@/components/team-builder/captain-selector";
import { TeamPreview } from "@/components/team-builder/team-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Search, Loader2, Save } from "lucide-react";
import type { Player } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

export default function CreateTeamPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contestId") || "";

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [matchInfo, setMatchInfo] = useState<{
    team_home: string;
    team_away: string;
    status: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const builder = useTeamBuilder(allPlayers);

  // Fetch match + players
  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch match
      const { data: match } = await supabase
        .from("matches")
        .select("team_home, team_away, status")
        .eq("id", Number(matchId))
        .single();

      if (match) {
        setMatchInfo(match);

        // Fetch players from both teams
        const { data: players } = await supabase
          .from("players")
          .select("*")
          .in("team", [match.team_home, match.team_away])
          .order("credit_value", { ascending: false });

        if (players) setAllPlayers(players as Player[]);
      }

      setLoadingData(false);
    }
    load();
  }, [matchId]);

  async function handleSave() {
    if (!builder.validation.valid) {
      toast.error(builder.validation.errors[0]);
      return;
    }
    if (!contestId) {
      toast.error("No contest selected");
      return;
    }

    setSaving(true);
    const result = await saveFantasyTeam({
      contest_id: contestId,
      match_id: Number(matchId),
      player_ids: builder.selectedPlayers.map((p) => p.id),
      captain_id: builder.captainId!,
      vice_captain_id: builder.viceCaptainId!,
      total_credits: builder.usedCredits,
    });
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      result.data?.updated ? "Team updated!" : "Team saved!"
    );
    router.push(`/contests/${contestId}`);
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!matchInfo) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Match not found
      </div>
    );
  }

  if (matchInfo.status !== "upcoming") {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">
          This match has already started. Team creation is locked.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            if (builder.step === "captain") builder.setStep("select");
            else if (builder.step === "preview") builder.setStep("captain");
            else router.back();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">
            {matchInfo.team_home} vs {matchInfo.team_away}
          </h1>
          <p className="text-xs text-muted-foreground">
            {builder.step === "select"
              ? "Select 11 players"
              : builder.step === "captain"
              ? "Choose Captain & Vice Captain"
              : "Review your team"}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Step {builder.step === "select" ? 1 : builder.step === "captain" ? 2 : 3}/3
        </div>
      </div>

      {/* Credit Bar (always visible) */}
      <CreditBar
        usedCredits={builder.usedCredits}
        remainingCredits={builder.remainingCredits}
        playerCount={builder.selectedPlayers.length}
      />

      {/* Step 1: Player Selection */}
      {builder.step === "select" && (
        <>
          <RoleTabs
            activeRole={builder.activeRole}
            onRoleChange={builder.setActiveRole}
            roleCounts={builder.roleCounts}
          />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={builder.searchQuery}
              onChange={(e) => builder.setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Player list */}
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {builder.filteredPlayers.map((player) => {
              const status = builder.getPlayerStatus(player);
              return (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isSelected={builder.isSelected(player.id)}
                  selectable={status.selectable}
                  reason={status.reason}
                  onToggle={() => builder.togglePlayer(player)}
                />
              );
            })}
            {builder.filteredPlayers.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No players found
              </p>
            )}
          </div>

          {/* Next button */}
          <Button
            className="w-full h-11"
            disabled={!builder.canProceedToCaptain}
            onClick={() => builder.setStep("captain")}
          >
            Choose Captain & VC
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}

      {/* Step 2: Captain Selection */}
      {builder.step === "captain" && (
        <>
          <CaptainSelector
            players={builder.selectedPlayers}
            captainId={builder.captainId}
            viceCaptainId={builder.viceCaptainId}
            onSetCaptain={builder.setCaptain}
            onSetViceCaptain={builder.setViceCaptain}
          />

          <Button
            className="w-full h-11"
            disabled={!builder.captainId || !builder.viceCaptainId}
            onClick={() => builder.setStep("preview")}
          >
            Preview Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}

      {/* Step 3: Preview & Save */}
      {builder.step === "preview" && (
        <>
          <TeamPreview
            players={builder.selectedPlayers}
            captainId={builder.captainId}
            viceCaptainId={builder.viceCaptainId}
            totalCredits={builder.usedCredits}
          />

          {!builder.validation.valid && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <ul className="text-sm text-destructive space-y-1">
                {builder.validation.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="w-full h-11"
            disabled={!builder.validation.valid || saving}
            onClick={handleSave}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Team
          </Button>
        </>
      )}
    </div>
  );
}
