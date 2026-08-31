import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createSession } from "../lib/versteh-mir/session.ts";
import type { View } from "../lib/versteh-mir/session.ts";

export type AdapterName = "demo" | "manual" | "grok-build";

export function parseCliArgs(argv: string[]): { adapter: AdapterName; help: boolean; error?: string } {
  let adapter: AdapterName = "demo";
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") return { adapter, help: true };
    if (arg === "--adapter") {
      const value = argv[i + 1];
      i += 1;
      if (value !== "demo" && value !== "manual" && value !== "grok-build") {
        return { adapter, help: false, error: "Adapter: demo, manual oder grok-build." };
      }
      adapter = value;
      continue;
    }
    if (arg?.startsWith("-")) {
      return { adapter, help: false, error: `Unbekanntes Flag: ${arg}` };
    }
  }
  return { adapter, help: false };
}

export const HELP = `Versteh-Mir — Terminal auf dem Mac

  npm run cli
  npm run cli -- --adapter demo
  npm run cli -- --adapter manual
  npm run cli -- --adapter grok-build

Grok Build CLI (separat, offiziell):

  curl -fsSL https://x.ai/cli/install.sh | bash
  grok

Versteh-Mir führt grok nicht aus. Sonst würde das zweite weiß umgangen.
Nur weiß gibt frei. ja, okay und weiter zählen nicht.
`;

function render(view: View): string {
  const lines = [
    "",
    `Versteh-Mir  ·  ${view.stageLabel}`,
    view.connectionLabel,
    "",
    view.atomText,
    "",
  ];
  if (view.signalsEnabled) lines.push("weiß  ·  unsicher  ·  gar nichts");
  return lines.join("\n");
}

export async function runCli(
  argv: string[],
  io: { stdin: NodeJS.ReadableStream; stdout: NodeJS.WritableStream } = { stdin, stdout },
): Promise<number> {
  const parsed = parseCliArgs(argv);
  if (parsed.help) {
    io.stdout.write(HELP);
    return 0;
  }
  if (parsed.error) {
    io.stdout.write(`${parsed.error}\n`);
    return 1;
  }

  const session = createSession({ adapter: parsed.adapter });
  io.stdout.write(`${render(session.view())}\n`);

  const rl = createInterface({ input: io.stdin, output: io.stdout, terminal: true });
  try {
    for (;;) {
      const line = (await rl.question("> ")).trim();
      if (!line) continue;
      if (line === "quit" || line === "exit") return 0;
      const view = session.submit(line, "keyboard");
      io.stdout.write(`${render(view)}\n`);
    }
  } finally {
    rl.close();
  }
}

const entry = process.argv[1]?.replace(/\\/g, "/");
if (entry?.endsWith("/src/cli/versteh-mir.ts") || entry?.endsWith("/cli/versteh-mir.ts")) {
  runCli(process.argv.slice(2)).then((code) => process.exit(code));
}
