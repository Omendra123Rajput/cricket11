import { describe, it, expect } from "vitest";
import { validateTeam, canAddPlayer } from "../team-validator";
import type { Player } from "@/types";
import type { SelectedPlayer } from "../team-validator";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 1,
    name: "Test Player",
    slug: "test-player",
    team: "CSK",
    role: "BAT",
    credit_value: 8.5,
    image_url: null,
    is_overseas: false,
    batting_style: null,
    bowling_style: null,
    meta: {},
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

function makeSelected(p: Player, captain = false, vc = false): SelectedPlayer {
  return { ...p, isCaptain: captain, isViceCaptain: vc };
}

// Build a valid 11-player team
function buildValidTeam(): { players: SelectedPlayer[]; captainId: number; vcId: number } {
  const players: SelectedPlayer[] = [
    makeSelected(makePlayer({ id: 1, role: "WK", team: "CSK", credit_value: 9 })),
    makeSelected(makePlayer({ id: 2, role: "BAT", team: "MI", credit_value: 9.5 })),
    makeSelected(makePlayer({ id: 3, role: "BAT", team: "RCB", credit_value: 9 })),
    makeSelected(makePlayer({ id: 4, role: "BAT", team: "KKR", credit_value: 8.5 })),
    makeSelected(makePlayer({ id: 5, role: "AR", team: "DC", credit_value: 9 })),
    makeSelected(makePlayer({ id: 6, role: "AR", team: "PBKS", credit_value: 8.5 })),
    makeSelected(makePlayer({ id: 7, role: "BOWL", team: "RR", credit_value: 9 })),
    makeSelected(makePlayer({ id: 8, role: "BOWL", team: "SRH", credit_value: 8.5 })),
    makeSelected(makePlayer({ id: 9, role: "BOWL", team: "GT", credit_value: 8 })),
    makeSelected(makePlayer({ id: 10, role: "BAT", team: "LSG", credit_value: 8.5 })),
    makeSelected(makePlayer({ id: 11, role: "BOWL", team: "CSK", credit_value: 7.5 })),
  ];
  return { players, captainId: 1, vcId: 2 };
}

describe("validateTeam", () => {
  it("validates a correct team", () => {
    const { players, captainId, vcId } = buildValidTeam();
    const result = validateTeam(players, captainId, vcId);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects team with wrong player count", () => {
    const { players, captainId, vcId } = buildValidTeam();
    const result = validateTeam(players.slice(0, 9), captainId, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("11"))).toBe(true);
  });

  it("rejects team exceeding credit limit", () => {
    const { players, captainId, vcId } = buildValidTeam();
    // Set all players to 10 credits = 110 total
    const expensive = players.map((p) => ({ ...p, credit_value: 10 }));
    const result = validateTeam(expensive, captainId, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("credits"))).toBe(true);
  });

  it("rejects team with too many from one IPL team", () => {
    const { players, captainId, vcId } = buildValidTeam();
    // Make all 11 from CSK
    const allCSK = players.map((p) => ({ ...p, team: "CSK" }));
    const result = validateTeam(allCSK, captainId, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Max 7"))).toBe(true);
  });

  it("rejects team with too many overseas players", () => {
    const { players, captainId, vcId } = buildValidTeam();
    // Make 5 overseas
    const tooManyOverseas = players.map((p, i) => ({
      ...p,
      is_overseas: i < 5,
    }));
    const result = validateTeam(tooManyOverseas, captainId, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("overseas"))).toBe(true);
  });

  it("rejects team without captain", () => {
    const { players, vcId } = buildValidTeam();
    const result = validateTeam(players, null, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Captain"))).toBe(true);
  });

  it("rejects team with same captain and VC", () => {
    const { players } = buildValidTeam();
    const result = validateTeam(players, 1, 1);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("different"))).toBe(true);
  });

  it("rejects team with no WK", () => {
    const { players, captainId, vcId } = buildValidTeam();
    // Change WK to BAT
    players[0] = makeSelected(
      makePlayer({ id: 1, role: "BAT", team: "CSK", credit_value: 9 })
    );
    const result = validateTeam(players, captainId, vcId);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("WK"))).toBe(true);
  });
});

describe("canAddPlayer", () => {
  it("allows adding when constraints met", () => {
    const current = [makePlayer({ id: 1, team: "CSK", role: "BAT" })];
    const newP = makePlayer({ id: 2, team: "MI", role: "BOWL" });
    const result = canAddPlayer(current, newP);
    expect(result.allowed).toBe(true);
  });

  it("rejects if team is full", () => {
    const current = Array.from({ length: 11 }, (_, i) =>
      makePlayer({ id: i + 1 })
    );
    const newP = makePlayer({ id: 99 });
    const result = canAddPlayer(current, newP);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("full");
  });

  it("rejects duplicate player", () => {
    const current = [makePlayer({ id: 1 })];
    const newP = makePlayer({ id: 1 });
    const result = canAddPlayer(current, newP);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Already");
  });

  it("rejects if not enough credits", () => {
    const current = Array.from({ length: 10 }, (_, i) =>
      makePlayer({ id: i + 1, credit_value: 9.5 })
    );
    // 10 * 9.5 = 95, adding 6.0 = 101 > 100
    const newP = makePlayer({ id: 99, credit_value: 6.0 });
    const result = canAddPlayer(current, newP);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("credits");
  });

  it("rejects 5th overseas player", () => {
    const current = Array.from({ length: 4 }, (_, i) =>
      makePlayer({ id: i + 1, is_overseas: true, team: ["CSK", "MI", "RCB", "KKR"][i] })
    );
    const newP = makePlayer({ id: 99, is_overseas: true, team: "DC" });
    const result = canAddPlayer(current, newP);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("overseas");
  });
});
