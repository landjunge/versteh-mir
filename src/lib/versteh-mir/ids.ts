import type { IdFactory } from "./types.ts";

export function liveIds(): IdFactory {
  let n = 0;
  return {
    now: () => Date.now(),
    id: (prefix: string) => {
      n += 1;
      const rand =
        typeof globalThis.crypto?.randomUUID === "function"
          ? globalThis.crypto.randomUUID()
          : `${n}-${Math.random().toString(16).slice(2)}`;
      return `${prefix}_${rand}`;
    },
  };
}

export function testIds(start = 1_700_000_000_000): IdFactory & {
  advance: (ms: number) => void;
} {
  let t = start;
  let n = 0;
  return {
    now: () => t,
    id: (prefix: string) => `${prefix}_${++n}`,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

export function iso(ms: number): string {
  return new Date(ms).toISOString();
}
