import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const dir = dirname(fileURLToPath(import.meta.url));
const plugin = readFileSync(join(dir, "versteh-mir.plugin.zsh"), "utf8");
const completion = readFileSync(join(dir, "_versteh-mir"), "utf8");

describe("zsh plugin", () => {
  it("starts the versteh-mir CLI, not grok", () => {
    assert.match(plugin, /versteh-mir\(\)/);
    assert.match(plugin, /src\/cli\/versteh-mir\.ts/);
    assert.match(plugin, /experimental-strip-types/);
    assert.doesNotMatch(plugin, /grok -p|exec grok|alias grok=/);
  });

  it("completes only the three adapters", () => {
    assert.match(completion, /#compdef versteh-mir/);
    assert.match(completion, /demo manual grok-build/);
  });
});
