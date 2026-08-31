import { z } from "zod";
import type { ActionPlan, ApprovalGrant, PlanningGrant } from "./types.ts";

const riskSchema = z.enum([
  "read",
  "local_change",
  "destructive",
  "external_send",
  "secret_access",
  "financial",
]);

export const ALLOWED_CAPABILITIES = ["read", "noop", "replace_sentence", "write"] as const;

const operationSchema = z.object({
  id: z.string().min(1),
  capability: z.enum(ALLOWED_CAPABILITIES),
  target: z.string().min(1),
  arguments: z.record(z.string(), z.unknown()),
  effect: z.string().min(1),
  risk: riskSchema,
  reversible: z.boolean(),
});

export const actionPlanSchema = z.object({
  id: z.string().min(1),
  intentId: z.string().min(1),
  understandingRevision: z.number().int().nonnegative(),
  operations: z.array(operationSchema).max(20),
  expectedResult: z.string().min(1),
  planHash: z.string().min(1),
});

export const approvalGrantSchema = z.object({
  sessionId: z.string().min(1),
  planHash: z.string().min(1),
  nonce: z.string().min(1),
  expiresAt: z.number().positive(),
  singleUse: z.literal(true),
  used: z.boolean(),
});

export const planningGrantSchema = z.object({
  sessionId: z.string().min(1),
  intentId: z.string().min(1),
  understandingRevision: z.number().int().nonnegative(),
  readOnly: z.literal(true),
});

export function parsePlan(input: unknown): { ok: true; plan: ActionPlan } | { ok: false; error: string } {
  const parsed = actionPlanSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Der Plan ist unvollständig oder ungültig." };
  return { ok: true, plan: parsed.data };
}

export function parseApprovalGrant(
  input: unknown,
): { ok: true; grant: ApprovalGrant } | { ok: false; error: string } {
  const parsed = approvalGrantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Die Freigabe ist ungültig." };
  return { ok: true, grant: parsed.data };
}

export function parsePlanningGrant(
  input: unknown,
): { ok: true; grant: PlanningGrant } | { ok: false; error: string } {
  const parsed = planningGrantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Die Lesefreigabe ist ungültig." };
  return { ok: true, grant: parsed.data };
}
