const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const ts = require("typescript");
const original = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
const { privateApi, privateContext } = require("../src/server/private-http.ts");
require.extensions[".ts"] = original;

test("Astro API bridge preserves request values, status and separate cookies", async () => {
  const request = new Request("https://example.test/api/secret?download=1", {
    method: "POST",
    headers: { Origin: "https://example.test", Cookie: "secret_browser=test" },
    body: JSON.stringify({ action: "login" }),
  });
  const response = await privateApi(request, async (req, res) => {
    assert.equal(req.headers.origin, "https://example.test");
    assert.equal(req.headers.cookie, "secret_browser=test");
    assert.deepEqual(req.body, { action: "login" });
    assert.equal(req.query.download, "1");
    res.setHeader("Set-Cookie", [
      "one=a; HttpOnly; Path=/",
      "two=b; HttpOnly; Path=/",
    ]);
    res.status(201).json({ ok: true });
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.getSetCookie().length, 2);
});
test("API bridge rejects malformed and oversized bodies before the handler", async () => {
  const handler = async () => {
    throw new Error("Must not reach handler");
  };
  for (const [body, status] of [
    ["not JSON", 400],
    [JSON.stringify({ data: "x".repeat(9000) }), 413],
  ]) {
    const response = await privateApi(
      new Request("https://example.test/api/secret", { method: "POST", body }),
      handler,
    );
    assert.equal(response.status, status);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});
test("private server context carries SSR security headers and status", () => {
  const ctx = privateContext(new Request("https://example.test/secret"));
  ctx.res.setHeader("Cache-Control", "private, no-store");
  ctx.res.status(404).end();
  assert.equal(ctx.response().status, 404);
  assert.equal(ctx.responseHeaders().get("Cache-Control"), "private, no-store");
});
