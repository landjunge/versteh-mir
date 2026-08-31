import type { ActionPlan, PlannedOperation } from "./types.ts";

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      out[key] = sortKeys(obj[key]);
    }
    return out;
  }
  return value;
}

export function canonicalOperations(operations: PlannedOperation[]): string {
  const slim = operations.map((op) =>
    sortKeys({
      id: op.id,
      capability: op.capability,
      target: op.target,
      arguments: op.arguments,
      effect: op.effect,
      risk: op.risk,
      reversible: op.reversible,
    }),
  );
  return JSON.stringify(slim);
}

export function canonicalPlan(plan: {
  intentId: string;
  understandingRevision: number;
  operations: PlannedOperation[];
  expectedResult: string;
}): string {
  return JSON.stringify({
    expectedResult: plan.expectedResult,
    intentId: plan.intentId,
    operations: JSON.parse(canonicalOperations(plan.operations)),
    understandingRevision: plan.understandingRevision,
  });
}

export function hashCanonical(canonical: string): string {
  let h = 5381;
  for (let i = 0; i < canonical.length; i++) {
    h = (h << 5) + h + canonical.charCodeAt(i);
    h |= 0;
  }
  return `p${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function withPlanHash(
  plan: Omit<ActionPlan, "planHash"> & { planHash?: string },
): ActionPlan {
  const canonical = canonicalPlan(plan);
  return { ...plan, planHash: hashCanonical(canonical) };
}
