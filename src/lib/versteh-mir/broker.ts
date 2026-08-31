import type { ActionPlan, ApprovalGrant, ExecutionResult, PlanningGrant } from "./types.ts";

export const INITIAL_FILES: Record<string, string> = {
  "README.md": "# Versteh-Mir\n\nNicht besser prompten. Erst dasselbe meinen.\n",
  "PROJECT.md": "Offen: der nächste Schritt ist noch nicht gewählt.\n",
};

const ALLOWED = new Set(Object.keys(INITIAL_FILES));

export class MemoryBroker {
  files: Record<string, string>;
  usedNonces = new Set<string>();

  constructor(files: Record<string, string> = { ...INITIAL_FILES }) {
    this.files = { ...files };
  }

  snapshot(): Record<string, string> {
    return { ...this.files };
  }

  executeRead(plan: ActionPlan, grant: PlanningGrant): ExecutionResult {
    if (grant.sessionId !== grant.sessionId) {
      return this.blocked(plan, "Sitzung passt nicht.");
    }
    if (grant.intentId !== plan.intentId || grant.understandingRevision !== plan.understandingRevision) {
      return this.blocked(plan, "Die Lesefreigabe gilt nicht für diesen Plan.");
    }
    for (const op of plan.operations) {
      if (op.risk !== "read") {
        return this.blocked(plan, "Ohne Handlungsfreigabe darf nichts verändert werden.");
      }
      if (!ALLOWED.has(op.target)) {
        return this.blocked(plan, `Ziel ${op.target} liegt nicht im Testbereich.`);
      }
    }
    return {
      planHash: plan.planHash,
      completed: plan.operations.map((op) => op.id),
      blocked: [],
      failed: [],
      measuredSummary: "Im Testbereich wurde nur gelesen. Sonst wurde nichts verändert.",
      filesAfter: this.snapshot(),
    };
  }

  execute(plan: ActionPlan, grant: ApprovalGrant, sessionId: string, now: number): ExecutionResult {
    if (grant.sessionId !== sessionId) {
      return this.blocked(plan, "Die Freigabe gehört zu einer anderen Sitzung.");
    }
    if (grant.planHash !== plan.planHash) {
      return this.blocked(plan, "Die Freigabe gilt nicht für diesen Plan.");
    }
    if (grant.used || this.usedNonces.has(grant.nonce)) {
      return this.blocked(plan, "Die Freigabe wurde bereits verwendet.");
    }
    if (now > grant.expiresAt) {
      return this.blocked(plan, "Die Freigabe ist abgelaufen.");
    }

    const completed: string[] = [];
    for (const op of plan.operations) {
      if (!ALLOWED.has(op.target) && op.capability !== "noop") {
        return this.blocked(plan, `Ziel ${op.target} liegt nicht im Testbereich.`);
      }
      if (op.capability === "read" || op.capability === "noop") {
        completed.push(op.id);
        continue;
      }
      if (op.capability === "replace_sentence") {
        const current = this.files[op.target];
        if (current == null) return this.blocked(plan, `Datei ${op.target} fehlt.`);
        const replacement = String(op.arguments.replacement ?? "");
        this.files[op.target] = replaceProjectSentence(current, replacement);
        completed.push(op.id);
        continue;
      }
      if (op.capability === "write") {
        this.files[op.target] = String(op.arguments.content ?? "");
        completed.push(op.id);
        continue;
      }
      return this.blocked(plan, `Unbekannte Fähigkeit: ${op.capability}`);
    }

    this.usedNonces.add(grant.nonce);
    grant.used = true;
    const changed = plan.operations
      .filter((op) => op.risk === "local_change")
      .map((op) => op.target);
    const measuredSummary = changed.length
      ? `${changed.join(", ")} wurde geändert. Sonst wurde nichts verändert.`
      : "Nichts wurde verändert.";
    return {
      planHash: plan.planHash,
      completed,
      blocked: [],
      failed: [],
      measuredSummary,
      filesAfter: this.snapshot(),
    };
  }

  private blocked(plan: ActionPlan, message: string): ExecutionResult {
    return {
      planHash: plan.planHash,
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
