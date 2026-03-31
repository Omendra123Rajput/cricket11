"use client";

import { useCallback, useMemo, useState } from "react";
import { TEAM_CONSTRAINTS } from "@/lib/utils/constants";
import { canAddPlayer, validateTeam } from "@/lib/fantasy/team-validator";
import type { Player, PlayerRole } from "@/types";

export type TeamBuilderStep = "select" | "captain" | "preview";

export function useTeamBuilder(allPlayers: Player[]) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<PlayerRole>("WK");
  const [step, setStep] = useState<TeamBuilderStep>("select");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered players for current role tab
  const filteredPlayers = useMemo(() => {
    let players = allPlayers.filter((p) => p.role === activeRole);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      players = players.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q)
      );
    }
    return players.sort((a, b) => b.credit_value - a.credit_value);
  }, [allPlayers, activeRole, searchQuery]);

  // Credits
  const usedCredits = useMemo(
    () => selectedPlayers.reduce((sum, p) => sum + p.credit_value, 0),
    [selectedPlayers]
  );
  const remainingCredits = TEAM_CONSTRAINTS.totalCredits - usedCredits;

  // Role counts
  const roleCounts = useMemo(() => {
    const counts: Record<PlayerRole, number> = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
    for (const p of selectedPlayers) {
      counts[p.role]++;
    }
    return counts;
  }, [selectedPlayers]);

  // Team counts
  const teamCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of selectedPlayers) {
      counts.set(p.team, (counts.get(p.team) || 0) + 1);
    }
    return counts;
  }, [selectedPlayers]);

  // Check if a player is selected
  const isSelected = useCallback(
    (playerId: number) => selectedPlayers.some((p) => p.id === playerId),
    [selectedPlayers]
  );

  // Check if player can be added
  const getPlayerStatus = useCallback(
    (player: Player) => {
      if (isSelected(player.id)) {
        return { selectable: true, reason: "Selected" };
      }
      const result = canAddPlayer(selectedPlayers, player);
      return { selectable: result.allowed, reason: result.reason };
    },
    [selectedPlayers, isSelected]
  );

  // Add player
  const addPlayer = useCallback(
    (player: Player) => {
      const check = canAddPlayer(selectedPlayers, player);
      if (!check.allowed) return false;
      setSelectedPlayers((prev) => [...prev, player]);
      return true;
    },
    [selectedPlayers]
  );

  // Remove player
  const removePlayer = useCallback(
    (playerId: number) => {
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
      if (captainId === playerId) setCaptainId(null);
      if (viceCaptainId === playerId) setViceCaptainId(null);
    },
    [captainId, viceCaptainId]
  );

  // Toggle player selection
  const togglePlayer = useCallback(
    (player: Player) => {
      if (isSelected(player.id)) {
        removePlayer(player.id);
      } else {
        addPlayer(player);
      }
    },
    [isSelected, addPlayer, removePlayer]
  );

  // Set captain
  const setCaptain = useCallback(
    (playerId: number) => {
      if (viceCaptainId === playerId) setViceCaptainId(null);
      setCaptainId(playerId);
    },
    [viceCaptainId]
  );

  // Set vice captain
  const setViceCaptain = useCallback(
    (playerId: number) => {
      if (captainId === playerId) setCaptainId(null);
      setViceCaptainId(playerId);
    },
    [captainId]
  );

  // Validation
  const validation = useMemo(() => {
    const withRoles = selectedPlayers.map((p) => ({
      ...p,
      isCaptain: p.id === captainId,
      isViceCaptain: p.id === viceCaptainId,
    }));
    return validateTeam(withRoles, captainId, viceCaptainId);
  }, [selectedPlayers, captainId, viceCaptainId]);

  // Can proceed to captain step?
  const canProceedToCaptain = selectedPlayers.length === 11;

  // Reset
  const reset = useCallback(() => {
    setSelectedPlayers([]);
    setCaptainId(null);
    setViceCaptainId(null);
    setStep("select");
    setSearchQuery("");
  }, []);

  return {
    // State
    selectedPlayers,
    captainId,
    viceCaptainId,
    activeRole,
    step,
    searchQuery,
    filteredPlayers,

    // Computed
    usedCredits,
    remainingCredits,
    roleCounts,
    teamCounts,
    validation,
    canProceedToCaptain,

    // Actions
    setActiveRole,
    setStep,
    setSearchQuery,
    togglePlayer,
    addPlayer,
    removePlayer,
    setCaptain,
    setViceCaptain,
    isSelected,
    getPlayerStatus,
    reset,
  };
}
