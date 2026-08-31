import { readOrientationResult } from "./meaning.ts";
import type { ActionPlan, ExecutionResult, IntentSpec, PlannedOperation } from "./types.ts";

export type PlanInspection = { ok: true } | { ok: false; reason: string };

const MAX_OPERATIONS = 6;
const MAX_TARGETS = 3;

function isDelete(op: PlannedOperation): boolean {
  return op.risk === "destructive" || /delete|unlink|remove|rm\b|löschen/i.test(op.capability);
}

function isSend(op: PlannedOperation): boolean {
  return op.risk === "external_send" || /send|upload|http|fetch|network|mail/i.test(op.capability);
}

function isSecret(op: PlannedOperation): boolean {
  return op.risk === "secret_access" || /secret|key|token|password|credential/i.test(op.capability);
}

function isCost(op: PlannedOperation): boolean {
  return op.risk === "financial" || /pay|charge|bill|invoice|purchase/i.test(op.capability);
}

function isChange(op: PlannedOperation): boolean {
  return op.risk === "local_change" || op.capability === "write" || op.capability === "replace_sentence";
}

function names(ops: PlannedOperation[]): string {
  const unique = [...new Set(ops.map((op) => op.target))];
  if (unique.length <= 1) return unique[0] ?? "";
  return `${unique.slice(0, -1).join(", ")} und ${unique.at(-1)}`;
}

export function criticalEffects(plan: ActionPlan) {
  return {
    change: plan.operations.filter(isChange),
    del: plan.operations.filter(isDelete),
    send: plan.operations.filter(isSend),
    secret: plan.operations.filter(isSecret),
    cost: plan.operations.filter(isCost),
    irreversible: plan.operations.filter((op) => !op.reversible),
  };
}

export function explainPlan(plan: ActionPlan): string {
  const fx = criticalEffects(plan);
  if (plan.operations.length === 0) {
    return "Es würde nichts gelesen, nichts verändert, nichts gelöscht und nichts gesendet. Stimmt das?";
  }
  const parts = [
    fx.change.length ? `Die Datei ${names(fx.change)} würde geändert.` : "Keine Datei würde verändert.",
    fx.del.length ? `Es würde gelöscht: ${names(fx.del)}.` : "Nichts würde gelöscht.",
    fx.send.length ? `Etwas würde den Rechner verlassen: ${names(fx.send)}.` : "Nichts würde den Rechner verlassen.",
    fx.secret.length ? `Es würden Geheimnisse benötigt: ${names(fx.secret)}.` : "Keine Geheimnisse würden gelesen.",
    fx.cost.length ? "Es würden Kosten entstehen." : "Es entstünden keine Kosten.",
  ];
  if (fx.irreversible.length) parts.push("Das wäre nicht rückgängig zu machen.");
  return `${parts.join(" ")} Stimmt das?`;
}

export function inspectPlan(plan: ActionPlan, intent?: IntentSpec | null): PlanInspection {
  if (plan.operations.length > MAX_OPERATIONS) {
    return { ok: false, reason: "Der Plan ist zu lang. Es müsste in kleinere Schritte geteilt werden." };
  }
  const targets = new Set(plan.operations.map((op) => op.target));
  if (targets.size > MAX_TARGETS) {
    return { ok: false, reason: "Der Plan betrifft zu viele Ziele auf einmal." };
  }
  const fx = criticalEffects(plan);
  const forbidden = (intent?.forbiddenEffects ?? []).join(" ").toLowerCase();
  const constraints = (intent?.constraints ?? []).join(" ").toLowerCase();
  if (fx.del.length && /lösch/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde löschen, obwohl das nicht erlaubt war." };
  }
  if (fx.send.length && /send/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde etwas senden, obwohl das nicht erlaubt war." };
  }
  if (fx.secret.length && /geheim/.test(forbidden)) {
    return { ok: false, reason: "Der Plan würde Geheimnisse brauchen, obwohl das nicht erlaubt war." };
  }
  if (intent?.nextAllowedStep === "orient_read" && (fx.change.length || fx.del.length || fx.send.length)) {
    return { ok: false, reason: "Zugelassen war nur lesen. Der Plan würde etwas verändern." };
  }
  if (/nur lesen/.test(constraints) && (fx.change.length || fx.del.length)) {
    return { ok: false, reason: "Zugelassen war nur lesen. Der Plan würde etwas verändern." };
  }
  if (/sonst nichts|nichts bauen|nicht bauen/.test(constraints) && fx.change.length > 1) {
    return { ok: false, reason: "Der Plan würde mehr ändern als erlaubt." };
  }
  if (plan.operations.some((op) => op.risk === "read" && isChange(op))) {
    return { ok: false, reason: "Der Plan widerspricht sich: als Lesen gekennzeichnet, würde aber ändern." };
  }
  const pretendsIdle = /^(nichts (wurde|würde) verändert|nichts passiert|es würde nichts)/i.test(
    plan.expectedResult.trim(),
  );
  if (pretendsIdle && (fx.change.length || fx.del.length || fx.send.length || fx.secret.length || fx.cost.length)) {
    return { ok: false, reason: "Der Plan widerspricht sich: die Zusammenfassung verschweigt die Wirkung." };
  }
  return { ok: true };
}

export function explainResult(result: ExecutionResult): string {
  if (result.blocked.length) return result.measuredSummary;
  const project = result.filesAfter["PROJECT.md"] ?? "";
  const unchanged =
    /nur gelesen/i.test(result.measuredSummary) || /nichts wurde verändert/i.test(result.measuredSummary);
  if (unchanged && /Offen: der nächste Schritt/i.test(project)) return readOrientationResult();
  return result.measuredSummary;
}
