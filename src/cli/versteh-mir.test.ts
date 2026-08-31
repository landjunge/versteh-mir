import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HELP, parseCliArgs } from "./versteh-mir.ts";

describe("parseCliArgs", () => {
  it("defaults to demo", () => {
    assert.deepEqual(parseCliArgs([]), { adapter: "demo", help: false });
  });

  it("accepts grok-build without connecting it", () => {
    assert.deepEqual(parseCliArgs(["--adapter", "grok-build"]), { adapter: "grok-build", help: false });
  });

  it("rejects unknown adapters", () => {
    const parsed = parseCliArgs(["--adapter", "cursor"]);
    assert.equal(parsed.error, "Adapter: demo, manual oder grok-build.");
  });

  it("prints mac install help", () => {
    assert.equal(parseCliArgs(["--help"]).help, true);
    assert.match(HELP, /install\.sh/);
    assert.match(HELP, /führt grok nicht aus/);
  });
});
