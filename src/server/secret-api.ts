import type { PrivateApiRequest, PrivateApiResponse } from "./private-http";
import {
  acceptInvite,
  checkAdminKey,
  createInvite,
  isAdmin,
  logout,
  privateHeaders,
  query,
  rateLimit,
  safeLink,
  sameOrigin,
  signInAdmin,
  token,
} from "./secret";

export default async function handler(
  req: PrivateApiRequest,
  res: PrivateApiResponse,
) {
  privateHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!sameOrigin(req))
    return res.status(403).json({ error: "Request not allowed" });
  const parsed = req.body;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return res.status(400).json({ error: "Invalid request" });
  const body = parsed as Record<string, unknown>;
  const field = (name: string, max = 160) => {
    const value = body[name];
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  };
  const action = field("action");
  try {
    if (action === "login") {
      if (!(await rateLimit("login")))
        return res
          .status(429)
          .json({ error: "Too many attempts. Try again in 15 minutes." });
      if (!checkAdminKey(field("key", 512)))
        return res.status(401).json({ error: "Invalid admin key" });
      signInAdmin(res);
      return res.json({ ok: true });
    }
    if (action === "accept") {
      if (!(await rateLimit("accept")))
        return res
          .status(429)
          .json({ error: "Too many attempts. Try again in 15 minutes." });
      if (!(await acceptInvite(field("token", 64), res)))
        return res.status(400).json({
          error:
            "This invitation has expired, was used, or was revoked. Ask William for another.",
        });
      return res.json({ ok: true });
    }
    if (action === "logout") {
      await logout(req, res);
      return res.json({ ok: true });
    }
    if (!isAdmin(req)) return res.status(404).json({ error: "Not found" });
    if (action === "invite") {
      const label = field("label");
      if (!label)
        return res.status(400).json({ error: "Give this invitation a name" });
      const raw = await createInvite(label);
      return res.json({ invite: `/secret/invite#${raw}` });
    }
    if (action === "revoke") {
      await query("UPDATE secret_grants SET revoked = 1 WHERE id = ?", [
        field("id"),
      ]);
    } else if (action === "category") {
      const slug = field("slug", 80);
      const title = field("title");
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        ["admin", "invite"].includes(slug) ||
        !title
      )
        return res.status(400).json({
          error:
            "Use a title and a lowercase slug such as side-projects (admin and invite are reserved).",
        });
      await query(
        `INSERT INTO secret_categories (id, slug, title, description) VALUES (?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET title = excluded.title, description = excluded.description`,
        [token(), slug, title, field("description", 500)],
      );
    } else if (action === "link") {
      const title = field("title");
      const url = field("url", 2000);
      if (!title || !safeLink(url))
        return res
          .status(400)
          .json({ error: "Use a title and an http(s) URL or a /secret path." });
      const exists = await query(
        "SELECT id FROM secret_categories WHERE id = ?",
        [field("category_id")],
      );
      if (!exists.length)
        return res.status(400).json({ error: "Choose a category" });
      const id = field("id") || token();
      await query(
        `INSERT INTO secret_links (id, category_id, title, url, description) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET category_id = excluded.category_id, title = excluded.title, url = excluded.url, description = excluded.description`,
        [id, field("category_id"), title, url, field("description", 500)],
      );
    } else if (action === "delete-link") {
      await query("DELETE FROM secret_links WHERE id = ?", [field("id")]);
    } else if (action === "delete-category") {
      // Only empty categories may be deleted, preventing accidental link loss.
      const rows = await query<{ id: string }>(
        "DELETE FROM secret_categories WHERE id = ? AND NOT EXISTS (SELECT 1 FROM secret_links WHERE category_id = ?) RETURNING id",
        [field("id"), field("id")],
      );
      if (!rows.length)
        return res
          .status(400)
          .json({ error: "Remove this category's links first" });
    } else return res.status(400).json({ error: "Unknown action" });
    return res.json({ ok: true });
  } catch {
    // Never log bodies: they can contain admin keys or invitation tokens.
    console.error(
      "Secret directory request failed; check D1 configuration and availability.",
    );
    return res.status(503).json({
      error:
        "The private directory is temporarily unavailable. Please try again later.",
    });
  }
}
