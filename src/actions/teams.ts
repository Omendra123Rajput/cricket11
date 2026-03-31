"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface SaveTeamInput {
  contest_id: string;
  match_id: number;
  player_ids: number[];
  captain_id: number;
  vice_captain_id: number;
  total_credits: number;
}

export async function saveFantasyTeam(input: SaveTeamInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Validate basic inputs
  if (input.player_ids.length !== 11) {
    return { error: "You must select exactly 11 players" };
  }
  if (!input.captain_id || !input.vice_captain_id) {
    return { error: "Captain and Vice Captain are required" };
  }
  if (input.captain_id === input.vice_captain_id) {
    return { error: "Captain and Vice Captain must be different" };
  }
  if (input.total_credits > 100) {
    return { error: "Total credits exceed 100" };
  }

  // Check if match is still upcoming (not locked)
  const { data: match } = await supabase
    .from("matches")
    .select("status")
    .eq("id", input.match_id)
    .single();

  if (!match || match.status !== "upcoming") {
    return { error: "This match has already started. Team creation is locked." };
  }

  // Check if user is in the contest
  const { data: membership } = await supabase
    .from("contest_members")
    .select("id")
    .eq("contest_id", input.contest_id)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return { error: "You are not a member of this contest" };
  }

  // Check for existing team (upsert)
  const { data: existingTeam } = await supabase
    .from("fantasy_teams")
    .select("id, is_locked")
    .eq("user_id", user.id)
    .eq("contest_id", input.contest_id)
    .eq("match_id", input.match_id)
    .single();

  if (existingTeam?.is_locked) {
    return { error: "Your team is locked. Cannot edit after match starts." };
  }

  // If existing team, delete old players and update
  if (existingTeam) {
    await supabase
      .from("fantasy_team_players")
      .delete()
      .eq("fantasy_team_id", existingTeam.id);

    const { error: updateError } = await supabase
      .from("fantasy_teams")
      .update({
        captain_player_id: input.captain_id,
        vice_captain_player_id: input.vice_captain_id,
        total_credits: input.total_credits,
      })
      .eq("id", existingTeam.id);

    if (updateError) {
      return { error: updateError.message };
    }

    // Insert new players
    const playerRows = input.player_ids.map((pid) => ({
      fantasy_team_id: existingTeam.id,
      player_id: pid,
      is_captain: pid === input.captain_id,
      is_vice_captain: pid === input.vice_captain_id,
    }));

    const { error: playersError } = await supabase
      .from("fantasy_team_players")
      .insert(playerRows);

    if (playersError) {
      return { error: playersError.message };
    }

    revalidatePath(`/contests/${input.contest_id}`);
    return { data: { id: existingTeam.id, updated: true } };
  }

  // Create new team
  const { data: team, error: teamError } = await supabase
    .from("fantasy_teams")
    .insert({
      user_id: user.id,
      contest_id: input.contest_id,
      match_id: input.match_id,
      captain_player_id: input.captain_id,
      vice_captain_player_id: input.vice_captain_id,
      total_credits: input.total_credits,
    })
    .select()
    .single();

  if (teamError) {
    return { error: teamError.message };
  }

  // Insert players
  const playerRows = input.player_ids.map((pid) => ({
    fantasy_team_id: team.id,
    player_id: pid,
    is_captain: pid === input.captain_id,
    is_vice_captain: pid === input.vice_captain_id,
  }));

  const { error: playersError } = await supabase
    .from("fantasy_team_players")
    .insert(playerRows);

  if (playersError) {
    return { error: playersError.message };
  }

  revalidatePath(`/contests/${input.contest_id}`);
  return { data: { id: team.id, updated: false } };
}

export async function getMyTeamForMatch(
  contestId: string,
  matchId: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null };

  const { data, error } = await supabase
    .from("fantasy_teams")
    .select(`
      *,
      fantasy_team_players (
        player_id,
        is_captain,
        is_vice_captain,
        points_earned
      )
    `)
    .eq("user_id", user.id)
    .eq("contest_id", contestId)
    .eq("match_id", matchId)
    .single();

  return { data, error };
}
