import { hashCanonical, canonicalPlan } from "./hash.ts";
import { parseApprovalGrant, parsePlan, parsePlanningGrant } from "./schema.ts";
import type { ActionPlan, ApprovalGrant, ExecutionResult, PlanningGrant } from "./types.ts";

export const INITIAL_FILES: Record<string, string> = {
  "README.md": "# Versteh-Mir\n\nNicht besser prompten. Erst dasselbe meinen.\n",
  "PROJECT.md": "Offen: der nächste Schritt ist noch nicht gewählt.\n",
};

const BLOCKED_RISKS = new Set(["destructive", "external_send", "secret_access", "financial"]);

export function resolveTarget(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t || t.includes("\0")) return null;
  if (t.includes("/") || t.includes("\\") || t.includes("..")) return null;
  if (t === "." || t.startsWith(".")) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(t)) return null;
  return t;
}

type Issued = {
  sessionId: string;
  planHash: string;
  expiresAt: number;
  used: boolean;
};

export class MemoryBroker {
  private files: Record<string, string>;
  private issued = new Map<string, Issued>();
  private currentSessionId: string | null = null;

  constructor(files: Record<string, string> = { ...INITIAL_FILES }) {
    this.files = { ...files };
  }

  bindSession(sessionId: string) {
    this.currentSessionId = sessionId;
  }

  snapshot(): Record<string, string> {
    return { ...this.files };
  }

  reset() {
    this.files = { ...INITIAL_FILES };
    this.issued.clear();
    this.currentSessionId = null;
  }

  issue(grant: ApprovalGrant): string | null {
    const parsed = parseApprovalGrant(grant);
    if (!parsed.ok) return parsed.error;
    const existing = this.issued.get(parsed.grant.nonce);
    if (existing) {
      if (existing.planHash === parsed.grant.planHash && existing.sessionId === parsed.grant.sessionId) {
        return null;
      }
      return "Diese Freigabe wurde schon ausgestellt.";
    }
    this.issued.set(parsed.grant.nonce, {
      sessionId: parsed.grant.sessionId,
      planHash: parsed.grant.planHash,
      expiresAt: parsed.grant.expiresAt,
      used: false,
    });
    return null;
  }

  executeRead(plan: ActionPlan, grant: PlanningGrant): ExecutionResult {
    const parsedGrant = parsePlanningGrant(grant);
    if (!parsedGrant.ok) return this.blocked(plan, parsedGrant.error);
    const parsedPlan = parsePlan(plan);
    if (!parsedPlan.ok) return this.blocked(plan, parsedPlan.error);
    if (this.currentSessionId && parsedGrant.grant.sessionId !== this.currentSessionId) {
      return this.blocked(plan, "Die Lesefreigabe gehört zu einer anderen Sitzung.");
    }
    if (
      parsedGrant.grant.intentId !== parsedPlan.plan.intentId ||
      parsedGrant.grant.understandingRevision !== parsedPlan.plan.understandingRevision
    ) {
      return this.blocked(plan, "Die Lesefreigabe gilt nicht für diesen Plan.");
    }
    for (const op of parsedPlan.plan.operations) {
      if (op.risk !== "read" || (op.capability !== "read" && op.capability !== "noop")) {
        return this.blocked(plan, "Ohne Handlungsfreigabe darf nichts verändert werden.");
      }
      const target = resolveTarget(op.target);
      if (!target || !(target in this.files)) {
        return this.blocked(plan, `Ziel ${op.target} liegt nicht im Testbereich.`);
      }
    }
    return {
      planHash: parsedPlan.plan.planHash,
      completed: parsedPlan.plan.operations.map((op) => op.id),
      blocked: [],
      failed: [],
      measuredSummary: "Im Testbereich wurde nur gelesen. Sonst wurde nichts verändert.",
      filesAfter: this.snapshot(),
    };
  }

  execute(plan: ActionPlan, grant: ApprovalGrant | null | undefined, sessionId: string, now: number): ExecutionResult {
    if (!grant) return this.blocked(plan, "Keine Handlungsfreigabe.");
    const parsedGrant = parseApprovalGrant(grant);
    if (!parsedGrant.ok) return this.blocked(plan, parsedGrant.error);
    const parsedPlan = parsePlan(plan);
    if (!parsedPlan.ok) return this.blocked(plan, parsedPlan.error);

    const issued = this.issued.get(parsedGrant.grant.nonce);
    if (!issued) return this.blocked(plan, "Die Freigabe wurde nicht ausgestellt.");
    if (issued.used || parsedGrant.grant.used) {
      issued.used = true;
      return this.blocked(plan, "Die Freigabe wurde bereits verwendet.");
    }
    if (now > issued.expiresAt || now > parsedGrant.grant.expiresAt) {
      issued.used = true;
      return this.blocked(plan, "Die Freigabe ist abgelaufen.");
    }
    if (parsedGrant.grant.sessionId !== sessionId || issued.sessionId !== sessionId) {
      issued.used = true;
      return this.blocked(plan, "Die Freigabe gehört zu einer anderen Sitzung.");
    }

    const recomputed = hashCanonical(canonicalPlan(parsedPlan.plan));
    if (
      recomputed !== parsedPlan.plan.planHash ||
      recomputed !== parsedGrant.grant.planHash ||
      recomputed !== issued.planHash
    ) {
      issued.used = true;
      return this.blocked(plan, "Die Freigabe gilt nicht für diesen Plan.");
    }

    const before = this.snapshot();
    const completed: string[] = [];
    for (const op of parsedPlan.plan.operations) {
      const stopped = this.applyOperation(op);
      if (stopped) {
        this.files = before;
        issued.used = true;
        grant.used = true;
        return this.blocked(plan, stopped);
      }
      completed.push(op.id);
    }

    issued.used = true;
    grant.used = true;
    const changed = parsedPlan.plan.operations
      .filter((op) => op.risk === "local_change")
      .map((op) => op.target);
    const measuredSummary = this.measure(before, changed);
    return {
      planHash: recomputed,
      completed,
      blocked: [],
      failed: [],
      measuredSummary,
      filesAfter: this.snapshot(),
    };
  }

  private applyOperation(op: ActionPlan["operations"][number]): string | null {
    if (BLOCKED_RISKS.has(op.risk)) {
      return "Diese Wirkung ist in diesem Stand nicht erlaubt.";
    }
    const target = resolveTarget(op.target);
    if (!target) return `Ungültiges Ziel: ${op.target}`;
    if (!(target in this.files)) return `Ziel ${target} liegt nicht im Testbereich.`;
    if (op.capability === "read" || op.capability === "noop") return null;
    if (op.capability === "replace_sentence") {
      this.files[target] = replaceProjectSentence(this.files[target] ?? "", String(op.arguments.replacement ?? ""));
      return null;
    }
    if (op.capability === "write") {
      this.files[target] = String(op.arguments.content ?? "");
      return null;
    }
    return `Unbekannte Fähigkeit: ${op.capability}`;
  }

  private measure(before: Record<string, string>, expectedTargets: string[]): string {
    const changed = Object.keys(this.files).filter((name) => this.files[name] !== before[name]);
    const extra = Object.keys(this.files).filter((name) => !(name in before));
    if (extra.length) {
      this.files = before;
      return "Zusätzliche Dateien sind nicht erlaubt.";
    }
    if (changed.some((name) => !expectedTargets.includes(name))) {
      this.files = before;
      return "Es wurde etwas außerhalb des Plans verändert.";
    }
    return changed.length
      ? `${changed.join(", ")} wurde geändert. Sonst wurde nichts verändert.`
      : "Nichts wurde verändert.";
  }

  private blocked(plan: ActionPlan | { planHash?: string }, message: string): ExecutionResult {
    return {
      planHash: plan.planHash ?? "",
      completed: [],
      blocked: [message],
      failed: [],
      measuredSummary: message,
      filesAfter: this.snapshot(),
    };
  }
}

export function replaceProjectSentence(file: string, replacement: string): string {
  const lines = file.split("\n");
  if (lines.length >= 3 && lines[2] !== undefined) {
    lines[2] = replacement;
    return lines.join("\n");
  }
  return `${file.trimEnd()}\n\n${replacement}\n`;
}
