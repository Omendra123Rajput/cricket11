"use server";

import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/utils/invite-code";
import { createContestSchema, joinContestSchema } from "@/lib/validators/contest";
import { revalidatePath } from "next/cache";
import defaultScoringRules from "../../supabase/seed/scoring_rules.json";

export async function createContest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const parsed = createContestSchema.safeParse({
    name: formData.get("name"),
    max_members: Number(formData.get("max_members")) || 50,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const inviteCode = generateInviteCode();

  // Create contest
  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .insert({
      name: parsed.data.name,
      created_by: user.id,
      invite_code: inviteCode,
      max_members: parsed.data.max_members,
      scoring_rules: defaultScoringRules,
    })
    .select()
    .single();

  if (contestError) {
    return { error: contestError.message };
  }

  // Add creator as admin member
  const { error: memberError } = await supabase
    .from("contest_members")
    .insert({
      contest_id: contest.id,
      user_id: user.id,
      role: "admin",
    });

  if (memberError) {
    return { error: memberError.message };
  }

  revalidatePath("/contests");
  return { data: contest };
}

export async function joinContest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const rawCode = String(formData.get("invite_code") || "").trim().toUpperCase();
  const parsed = joinContestSchema.safeParse({ invite_code: rawCode });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Find contest by invite code
  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select("id, name, max_members, is_active")
    .eq("invite_code", parsed.data.invite_code)
    .single();

  if (contestError || !contest) {
    return { error: "Contest not found. Check the invite code." };
  }

  if (!contest.is_active) {
    return { error: "This contest is no longer active." };
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("contest_members")
    .select("id")
    .eq("contest_id", contest.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { error: "You're already in this contest!", data: contest };
  }

  // Check member count
  const { count } = await supabase
    .from("contest_members")
    .select("*", { count: "exact", head: true })
    .eq("contest_id", contest.id);

  if (count && count >= contest.max_members) {
    return { error: "Contest is full." };
  }

  // Join
  const { error: joinError } = await supabase
    .from("contest_members")
    .insert({
      contest_id: contest.id,
      user_id: user.id,
      role: "member",
    });

  if (joinError) {
    return { error: joinError.message };
  }

  revalidatePath("/contests");
  return { data: contest };
}

export async function leaveContest(contestId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Can't leave if you're the admin
  const { data: membership } = await supabase
    .from("contest_members")
    .select("role")
    .eq("contest_id", contestId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role === "admin") {
    return { error: "Contest admins cannot leave. Close the contest instead." };
  }

  const { error } = await supabase
    .from("contest_members")
    .delete()
    .eq("contest_id", contestId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/contests");
  return { data: true };
}

export async function getMyContests() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from("contest_members")
    .select(`
      role,
      season_points,
      rank,
      contests (
        id,
        name,
        invite_code,
        max_members,
        is_active,
        created_at,
        created_by
      )
    `)
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  return { data: data || [], error };
}

export async function getContestById(contestId: string) {
  const supabase = await createClient();

  const { data: contest, error } = await supabase
    .from("contests")
    .select(`
      *,
      contest_members (
        id,
        user_id,
        role,
        season_points,
        rank,
        joined_at,
        profiles (
          id,
          display_name,
          avatar_url,
          total_points,
          streak_current
        )
      )
    `)
    .eq("id", contestId)
    .single();

  return { data: contest, error };
}
