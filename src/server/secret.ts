import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { PrivateResponse } from "./private-http";

const DAY = 86400;
const REMEMBER = 400 * DAY;
const ADMIN_AGE = 12 * 3600;
type Request = Pick<IncomingMessage, "headers">;
export type Grant = {
  id: string;
  label: string;
  created_at: number;
  invite_expires: number;
  accepted_at: number | null;
  last_seen: number | null;
  revoked: number;
  session_expires: number | null;
};
export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
};
export type DirectoryLink = {
  id: string;
  category_id: string;
  title: string;
  url: string;
  description: string;
};

export const now = () => Math.floor(Date.now() / 1000);
export const token = () =>
  randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const validToken = (value: string) => /^[A-Za-z0-9_-]{43}$/.test(value);

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | null)[] = [],
): Promise<T[]> {
  const runtime = await import("cloudflare:workers").catch(() => null);
  if (runtime?.env.DB) {
    const result = await runtime.env.DB.prepare(sql)
      .bind(...params)
      .all<T>();
    if (!result.success) throw new Error("D1 query failed");
    return result.results;
  }
  const endpoint = process.env.SECRET_DATABASE_URL;
  const key = process.env.SECRET_DATABASE_KEY;
  if (!endpoint || !key) throw new Error("D1 is not configured");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("D1 request failed");
  const body = (await response.json()) as {
    success?: boolean;
    result?: { success?: boolean; results?: T[] }[];
  };
  if (!body.success || !body.result?.[0]?.success)
    throw new Error("D1 query failed");
  return body.result[0].results || [];
}

export function privateHeaders(res: PrivateResponse) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
}

function cookieName(admin = false) {
  return `${process.env.NODE_ENV === "production" ? "__Host-" : ""}secret_${
    admin ? "admin" : "browser"
  }`;
}
function readCookie(req: Request, admin = false) {
  const prefix = `${cookieName(admin)}=`;
  return (
    (req.headers.cookie || "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(prefix))
      ?.slice(prefix.length) || ""
  );
}
export function setCookie(
  res: PrivateResponse,
  value: string,
  age = REMEMBER,
  admin = false,
) {
  const cookie = `${cookieName(
    admin,
  )}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
  const existing = res.getHeader("Set-Cookie");
  res.setHeader("Set-Cookie", [
    ...(Array.isArray(existing)
      ? existing.map(String)
      : existing
        ? [String(existing)]
        : []),
    cookie,
  ]);
}
function adminKey() {
  const key = process.env.SECRET_ADMIN_KEY || "";
  if (key.length < 32)
    throw new Error("SECRET_ADMIN_KEY must contain at least 32 characters");
  return key;
}
export function checkAdminKey(value: string) {
  return timingSafeEqual(
    Buffer.from(digest(value), "hex"),
    Buffer.from(digest(adminKey()), "hex"),
  );
}
function signature(value: string) {
  return createHmac("sha256", adminKey())
    .update(`secret-admin:${value}`)
    .digest("hex");
}
export function signInAdmin(res: PrivateResponse) {
  const payload = `${now() + ADMIN_AGE}.${token()}`;
  setCookie(res, `${payload}.${signature(payload)}`, ADMIN_AGE, true);
}
export function isAdmin(req: Request) {
  const value = readCookie(req, true);
  const [expires, nonce, sig, extra] = value.split(".");
  if (
    extra ||
    !/^\d+$/.test(expires || "") ||
    !validToken(nonce || "") ||
    !/^[a-f0-9]{64}$/.test(sig || "") ||
    Number(expires) <= now() ||
    Number(expires) > now() + ADMIN_AGE
  )
    return false;
  return timingSafeEqual(
    Buffer.from(signature(`${expires}.${nonce}`), "hex"),
    Buffer.from(sig, "hex"),
  );
}
export function sameOrigin(req: Request) {
  const configured = process.env.SECRET_SITE_ORIGIN;
  if (!configured && process.env.NODE_ENV === "production") return false;
  const expected = configured || "http://localhost:3000";
  return req.headers.origin === expected;
}
export async function rateLimit(action: "login" | "accept") {
  const window = Math.floor(now() / 900);
  const rows = await query<{ hits: number }>(
    `INSERT INTO secret_limits (action, window, hits) VALUES (?, ?, 1)
    ON CONFLICT(action) DO UPDATE SET hits = CASE WHEN window = excluded.window THEN hits + 1 ELSE 1 END, window = excluded.window RETURNING hits`,
    [action, window],
  );
  return rows[0].hits <= (action === "login" ? 30 : 300);
}
export async function createInvite(label: string) {
  const raw = token();
  await query(
    "INSERT INTO secret_grants (id, label, invite_hash, created_at, invite_expires) VALUES (?, ?, ?, ?, ?)",
    [token(), label, digest(raw), now(), now() + DAY],
  );
  return raw;
}
export async function acceptInvite(raw: string, res: PrivateResponse) {
  if (!validToken(raw)) return false;
  const session = token();
  // A single conditional write makes concurrent redemption and replay safe.
  const rows = await query<{ id: string }>(
    `UPDATE secret_grants SET session_hash = ?, accepted_at = ?, last_seen = ?, session_expires = ?
    WHERE invite_hash = ? AND accepted_at IS NULL AND revoked = 0 AND invite_expires > ? RETURNING id`,
    [digest(session), now(), now(), now() + REMEMBER, digest(raw), now()],
  );
  if (!rows.length) return false;
  setCookie(res, session);
  return true;
}
export async function authorized(req: Request, res: PrivateResponse) {
  if (isAdmin(req)) return true;
  const raw = readCookie(req);
  if (!validToken(raw)) return false;
  const rows = await query<Grant>(
    "SELECT id, last_seen FROM secret_grants WHERE session_hash = ? AND revoked = 0 AND session_expires > ?",
    [digest(raw), now()],
  );
  if (!rows.length) return false;
  if ((rows[0].last_seen ?? 0) < now() - DAY) {
    await query(
      "UPDATE secret_grants SET last_seen = ?, session_expires = ? WHERE id = ? AND revoked = 0",
      [now(), now() + REMEMBER, rows[0].id],
    );
    setCookie(res, raw);
  }
  return true;
}
export async function logout(req: Request, res: PrivateResponse) {
  const raw = readCookie(req);
  if (validToken(raw))
    await query("UPDATE secret_grants SET revoked = 1 WHERE session_hash = ?", [
      digest(raw),
    ]);
  setCookie(res, "", 0);
  setCookie(res, "", 0, true);
}
export async function directory() {
  // Sequential requests also avoid unnecessary bursts against the REST API.
  const categories = await query<Category>(
    "SELECT id, slug, title, description FROM secret_categories ORDER BY CASE WHEN slug = 'rabbit-holes' THEN 0 ELSE 1 END, title",
  );
  const links = await query<DirectoryLink>(
    "SELECT id, category_id, title, url, description FROM secret_links ORDER BY title",
  );
  return { categories, links };
}
export function safeLink(value: string) {
  if (/^\/secret(?:\/[a-z0-9-]+)*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
