const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { Miniflare, convertV4MiniflareOptions } = require("miniflare");

test("Worker authenticates server requests and executes real D1 queries", async () => {
  const runtime = new Miniflare(
    convertV4MiniflareOptions({
      workers: [
        {
          name: "database",
          modules: true,
          script: readFileSync("cloudflare/database-worker.js", "utf8"),
          compatibilityDate: "2026-10-28",
          bindings: { DATABASE_KEY: "test-worker-key" },
          d1Databases: ["DB"],
        },
      ],
    }),
  );
  try {
    const db = await runtime.getD1Database("DB");
    for (const sql of readFileSync("db/secret.sql", "utf8")
      .split(";")
      .filter((s) => s.trim()))
      await db.prepare(sql).run();
    const call = (body, key = "test-worker-key") =>
      runtime.dispatchFetch("https://local.test/query", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    assert.equal(
      (await runtime.dispatchFetch("https://local.test/query")).status,
      404,
    );
    assert.equal(
      (
        await call(
          { sql: "SELECT * FROM secret_categories", params: [] },
          "wrong",
        )
      ).status,
      404,
    );
    const result = await call({
      sql: "SELECT title FROM secret_categories ORDER BY title",
      params: [],
    });
    assert.equal(result.status, 200);
    assert.equal(result.headers.get("Cache-Control"), "no-store");
    const body = await result.json();
    assert.equal(body.success, true);
    assert.deepEqual(
      body.result[0].results.map((r) => r.title),
      ["Projects", "Rabbit holes", "Tools"],
    );
    assert.equal(
      (await call({ sql: "SELECT ? AS title", params: ["a".repeat(20000)] }))
        .status,
      413,
    );
    assert.equal((await call({ sql: 42, params: [] })).status, 400);
    assert.equal(
      (await call({ sql: "SELECT * FROM missing_table", params: [] })).status,
      503,
    );
  } finally {
    await runtime.dispose();
  }
});
