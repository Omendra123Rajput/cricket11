import { z } from "zod";

export const createContestSchema = z.object({
  name: z
    .string()
    .min(3, "Contest name must be at least 3 characters")
    .max(50, "Contest name must be under 50 characters"),
  max_members: z
    .number()
    .int()
    .min(2, "Need at least 2 members")
    .max(50, "Max 50 members allowed"),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;

export const joinContestSchema = z.object({
  invite_code: z
    .string()
    .min(6, "Invite code must be at least 6 characters")
    .max(12, "Invalid invite code"),
});

export type JoinContestInput = z.infer<typeof joinContestSchema>;
