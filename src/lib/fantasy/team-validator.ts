import { TEAM_CONSTRAINTS } from "@/lib/utils/constants";
import type { Player, PlayerRole } from "@/types";

export interface TeamValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SelectedPlayer extends Player {
  isCaptain: boolean;
  isViceCaptain: boolean;
}

export function validateTeam(
  players: SelectedPlayer[],
  captainId: number | null,
  viceCaptainId: number | null
): TeamValidationResult {
  const errors: string[] = [];
  const { totalPlayers, totalCredits, maxPerTeam, maxOverseas, roles } =
    TEAM_CONSTRAINTS;

  // Exact 11 players
  if (players.length !== totalPlayers) {
    errors.push(`Select exactly ${totalPlayers} players (${players.length}/11)`);
  }

  // Total credits
  const credits = players.reduce((sum, p) => sum + p.credit_value, 0);
  if (credits > totalCredits) {
    errors.push(
      `Total credits (${credits}) exceed limit of ${totalCredits}`
    );
  }

  // Max players per IPL team
  const teamCounts = new Map<string, number>();
  for (const p of players) {
    teamCounts.set(p.team, (teamCounts.get(p.team) || 0) + 1);
  }
  for (const [team, count] of teamCounts) {
    if (count > maxPerTeam) {
      errors.push(`Max ${maxPerTeam} players from ${team} (you have ${count})`);
    }
  }

  // Max overseas
  const overseasCount = players.filter((p) => p.is_overseas).length;
  if (overseasCount > maxOverseas) {
    errors.push(
      `Max ${maxOverseas} overseas players (you have ${overseasCount})`
    );
  }

  // Role constraints
  const roleCounts: Record<PlayerRole, number> = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
  for (const p of players) {
    roleCounts[p.role]++;
  }
  for (const [role, constraints] of Object.entries(roles)) {
    const count = roleCounts[role as PlayerRole];
    if (count < constraints.min) {
      errors.push(`Need at least ${constraints.min} ${role} (have ${count})`);
    }
    if (count > constraints.max) {
      errors.push(`Max ${constraints.max} ${role} allowed (have ${count})`);
    }
  }

  // Captain and Vice Captain
  if (!captainId) {
    errors.push("Select a Captain");
  }
  if (!viceCaptainId) {
    errors.push("Select a Vice Captain");
  }
  if (captainId && viceCaptainId && captainId === viceCaptainId) {
    errors.push("Captain and Vice Captain must be different players");
  }
  if (captainId && !players.find((p) => p.id === captainId)) {
    errors.push("Captain must be in your team");
  }
  if (viceCaptainId && !players.find((p) => p.id === viceCaptainId)) {
    errors.push("Vice Captain must be in your team");
  }

  return { valid: errors.length === 0, errors };
}

export function canAddPlayer(
  currentPlayers: Player[],
  newPlayer: Player
): { allowed: boolean; reason?: string } {
  const { totalPlayers, totalCredits, maxPerTeam, maxOverseas, roles } =
    TEAM_CONSTRAINTS;

  if (currentPlayers.length >= totalPlayers) {
    return { allowed: false, reason: "Team is full (11/11)" };
  }

  // Check if already selected
  if (currentPlayers.find((p) => p.id === newPlayer.id)) {
    return { allowed: false, reason: "Already selected" };
  }

  // Credits check
  const currentCredits = currentPlayers.reduce((sum, p) => sum + p.credit_value, 0);
  if (currentCredits + newPlayer.credit_value > totalCredits) {
    return { allowed: false, reason: "Not enough credits" };
  }

  // Team limit
  const sameTeam = currentPlayers.filter((p) => p.team === newPlayer.team).length;
  if (sameTeam >= maxPerTeam) {
    return { allowed: false, reason: `Max ${maxPerTeam} from ${newPlayer.team}` };
  }

  // Overseas limit
  if (newPlayer.is_overseas) {
    const overseasCount = currentPlayers.filter((p) => p.is_overseas).length;
    if (overseasCount >= maxOverseas) {
      return { allowed: false, reason: `Max ${maxOverseas} overseas players` };
    }
  }

  // Role limit
  const roleCount = currentPlayers.filter((p) => p.role === newPlayer.role).length;
  const maxForRole = roles[newPlayer.role].max;
  if (roleCount >= maxForRole) {
    return { allowed: false, reason: `Max ${maxForRole} ${newPlayer.role}` };
  }

  return { allowed: true };
}
