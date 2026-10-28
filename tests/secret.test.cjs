const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { DatabaseSync } = require("node:sqlite");
const ts = require("typescript");

// Compile only the server modules under test; keep the app's TS config unchanged.
const originalTs = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const secret = require("../src/server/secret.ts");
const handler = require("../src/server/secret-api.ts").default;
require.extensions[".ts"] = originalTs;

const originalFetch = global.fetch;
const originalEnv = { ...process.env };
let db;
let calls;
beforeEach(() => {
  db?.close();
  db = new DatabaseSync(":memory:");
  db.exec(readFileSync("db/secret.sql", "utf8"));
  calls = [];
  process.env.NODE_ENV = "test";
  process.env.SECRET_ADMIN_KEY = "test-owner-key-with-at-least-32-characters";
  process.env.SECRET_SITE_ORIGIN = "https://example.test";
  process.env.SECRET_DATABASE_URL = "https://test-db.workers.dev/query";
  process.env.SECRET_DATABASE_KEY = "test-database-key";
  global.fetch = async (url, options) => {
    assert.equal(url, "https://test-db.workers.dev/query");
    assert.equal(options.headers.Authorization, "Bearer test-database-key");
    const { sql, params = [] } = JSON.parse(options.body);
    calls.push({ sql, params });
    const statement = db.prepare(sql);
    const results = statement.columns().length
      ? statement.all(...params)
      : (statement.run(...params), []);
    return {
      ok: true,
      json: async () => ({
        success: true,
        result: [{ success: true, results }],
      }),
    };
  };
});
after(() => {
  db.close();
  global.fetch = originalFetch;
  process.env = originalEnv;
});

function response() {
  const headers = {};
  return {
    headers,
    statusCode: 200,
    setHeader(key, value) {
      headers[key] = value;
    },
    getHeader(key) {
      return headers[key];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
}
function cookies(res) {
  return res.headers["Set-Cookie"].map((c) => c.split(";")[0]).join("; ");
}
async function request(
  body,
  cookie = "",
  origin = "https://example.test",
  method = "POST",
) {
  const res = response();
  await handler({ method, headers: { cookie, origin }, body }, res);
  return res;
}
function adminCookie() {
  const res = response();
  secret.signInAdmin(res);
  return cookies(res);
}

test("invitation acceptance is one-time, hashed, and revocable", async () => {
  const raw = await secret.createInvite("Alex's phone");
  assert.equal(
    db.prepare("SELECT invite_hash FROM secret_grants").get().invite_hash,
    secret.digest(raw),
  );
  const res = response();
  assert.equal(await secret.acceptInvite(raw, res), true);
  const cookie = cookies(res);
  assert.match(
    res.headers["Set-Cookie"][0],
    /HttpOnly; SameSite=Lax; Max-Age=34560000/,
  );
  assert.equal(
    await secret.authorized({ headers: { cookie } }, response()),
    true,
  );
  assert.equal(await secret.acceptInvite(raw, response()), false);
  db.exec("UPDATE secret_grants SET revoked = 1");
  assert.equal(
    await secret.authorized({ headers: { cookie } }, response()),
    false,
  );
  assert.equal(await secret.acceptInvite(raw, response()), false);
});
test("expired and revoked invitations never grant access", async () => {
  const expired = await secret.createInvite("Expired");
  db.exec("UPDATE secret_grants SET invite_expires = 0");
  assert.equal(await secret.acceptInvite(expired, response()), false);
  const revoked = await secret.createInvite("Revoked");
  db.exec("UPDATE secret_grants SET revoked = 1");
  assert.equal(await secret.acceptInvite(revoked, response()), false);
  assert.equal(await secret.acceptInvite("malformed", response()), false);
});
test("parallel accept attempts yield exactly one authorized browser", async () => {
  const raw = await secret.createInvite("One browser");
  const results = await Promise.all(
    Array.from({ length: 8 }, () => secret.acceptInvite(raw, response())),
  );
  assert.equal(results.filter(Boolean).length, 1);
});
test("unknown and missing browser cookies are denied", async () => {
  assert.equal(await secret.authorized({ headers: {} }, response()), false);
  assert.equal(calls.length, 0);
  assert.equal(
    await secret.authorized(
      { headers: { cookie: `secret_browser=${secret.token()}` } },
      response(),
    ),
    false,
  );
});
test("browser expiration, rolling renewal, and logout work", async () => {
  const raw = await secret.createInvite("Returning browser");
  const res = response();
  await secret.acceptInvite(raw, res);
  const req = { headers: { cookie: cookies(res) } };
  db.exec(`UPDATE secret_grants SET last_seen = ${secret.now() - 90000}`);
  const renewed = response();
  assert.equal(await secret.authorized(req, renewed), true);
  assert.ok(renewed.headers["Set-Cookie"]);
  db.exec("UPDATE secret_grants SET session_expires = 0");
  assert.equal(await secret.authorized(req, response()), false);
  await secret.logout(req, response());
  assert.equal(
    db.prepare("SELECT revoked FROM secret_grants").get().revoked,
    1,
  );
});
test("admin sessions require the right key, expire and cannot be forged", async () => {
  assert.equal(secret.checkAdminKey("wrong"), false);
  assert.equal(secret.checkAdminKey(process.env.SECRET_ADMIN_KEY), true);
  const cookie = adminCookie();
  assert.equal(secret.isAdmin({ headers: { cookie } }), true);
  assert.equal(secret.isAdmin({ headers: { cookie: cookie + "f" } }), false);
  assert.equal(
    secret.isAdmin({ headers: { cookie: "secret_admin=0.fake.fake" } }),
    false,
  );
  process.env.SECRET_ADMIN_KEY =
    "a-different-owner-key-with-more-than-32-chars";
  assert.equal(secret.isAdmin({ headers: { cookie } }), false);
});
test("production cookies have secure host prefix and exact Origin is required", () => {
  process.env.NODE_ENV = "production";
  const res = response();
  secret.setCookie(res, "abc");
  assert.match(
    res.headers["Set-Cookie"][0],
    /^__Host-secret_browser=abc; Path=\/; HttpOnly; SameSite=Lax; Max-Age=34560000; Secure$/,
  );
  assert.equal(
    secret.sameOrigin({ headers: { origin: "https://example.test" } }),
    true,
  );
  assert.equal(
    secret.sameOrigin({ headers: { origin: "https://evil.test" } }),
    false,
  );
  assert.equal(secret.sameOrigin({ headers: {} }), false);
  delete process.env.SECRET_SITE_ORIGIN;
  assert.equal(
    secret.sameOrigin({ headers: { origin: "https://example.test" } }),
    false,
  );
});
test("API rejects unauthenticated writes, cross-origin requests and GET redemption", async () => {
  assert.equal(
    (await request({ action: "invite", label: "No" })).statusCode,
    404,
  );
  assert.equal(
    (await request({ action: "invite" }, adminCookie(), "https://evil.test"))
      .statusCode,
    403,
  );
  const raw = await secret.createInvite("Preview");
  const get = await request(
    { action: "accept", token: raw },
    "",
    "https://example.test",
    "GET",
  );
  assert.equal(get.statusCode, 405);
  assert.equal(
    db.prepare("SELECT accepted_at FROM secret_grants").get().accepted_at,
    null,
  );
  const accept = await request({ action: "accept", token: raw });
  assert.equal(accept.statusCode, 200);
  assert.equal(accept.headers["Cache-Control"], "private, no-store, max-age=0");
  assert.equal(accept.headers["Referrer-Policy"], "no-referrer");
});
test("admin creates invitations and manages categories and links with parameterized SQL", async () => {
  const cookie = adminCookie();
  const invite = await request({ action: "invite", label: "Alex" }, cookie);
  assert.match(invite.body.invite, /^\/secret\/invite#[A-Za-z0-9_-]{43}$/);
  assert.equal(
    (
      await request(
        { action: "category", slug: "admin", title: "Forbidden" },
        cookie,
      )
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await request(
        { action: "category", slug: "music", title: "Music" },
        cookie,
      )
    ).statusCode,
    200,
  );
  await request(
    { action: "category", slug: "music", title: "Music & more" },
    cookie,
  );
  const category = db
    .prepare("SELECT * FROM secret_categories WHERE slug = 'music'")
    .get();
  assert.equal(category.title, "Music & more");
  assert.equal(
    (
      await request(
        {
          action: "link",
          title: "Bad",
          url: "javascript:alert(1)",
          category_id: category.id,
        },
        cookie,
      )
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await request(
        {
          action: "link",
          title: "Missing",
          url: "https://example.com",
          category_id: "missing",
        },
        cookie,
      )
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await request(
        {
          action: "link",
          title: "'); DROP TABLE secret_grants; --",
          url: "https://example.com",
          category_id: category.id,
        },
        cookie,
      )
    ).statusCode,
    200,
  );
  const link = db.prepare("SELECT * FROM secret_links").get();
  await request(
    {
      action: "link",
      id: link.id,
      title: "Edited",
      url: "https://example.org",
      category_id: category.id,
    },
    cookie,
  );
  assert.equal(
    db.prepare("SELECT title FROM secret_links").get().title,
    "Edited",
  );
  assert.equal(
    (await request({ action: "delete-category", id: category.id }, cookie))
      .statusCode,
    400,
  );
  await request({ action: "delete-link", id: link.id }, cookie);
  await request({ action: "delete-category", id: category.id }, cookie);
  assert.equal(
    db
      .prepare(
        "SELECT COUNT(*) AS total FROM secret_categories WHERE slug = 'music'",
      )
      .get().total,
    0,
  );
});
test("revocation API invalidates a browser immediately", async () => {
  const raw = await secret.createInvite("Revoke me");
  const res = response();
  await secret.acceptInvite(raw, res);
  const id = db.prepare("SELECT id FROM secret_grants").get().id;
  assert.equal(
    (await request({ action: "revoke", id }, adminCookie())).statusCode,
    200,
  );
  assert.equal(
    await secret.authorized({ headers: { cookie: cookies(res) } }, response()),
    false,
  );
});
test("durable login limits survive calls and use bounded storage", async () => {
  for (let i = 0; i < 30; i++)
    assert.equal(await secret.rateLimit("login"), true);
  assert.equal(await secret.rateLimit("login"), false);
  assert.equal(
    (await request({ action: "login", key: process.env.SECRET_ADMIN_KEY }))
      .statusCode,
    429,
  );
  db.exec("UPDATE secret_limits SET window = 0");
  assert.equal(await secret.rateLimit("login"), true);
  assert.equal(
    db.prepare("SELECT COUNT(*) AS total FROM secret_limits").get().total,
    1,
  );
});
test("D1 transport errors never grant access", async () => {
  global.fetch = async () => ({ ok: false });
  await assert.rejects(
    () => secret.acceptInvite(secret.token(), response()),
    /D1 request failed/,
  );
  const res = await request({ action: "accept", token: secret.token() });
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers["Set-Cookie"], undefined);
});
test("safe links reject script protocols and protocol-relative URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.test",
    "/public-file",
    "https://user:password@example.com",
  ])
    assert.equal(secret.safeLink(url), false);
  for (const url of [
    "https://example.com",
    "http://localhost:8080",
    "/secret/projects",
  ])
    assert.equal(secret.safeLink(url), true);
});
