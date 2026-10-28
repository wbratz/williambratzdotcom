import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import Head from "../../compat/Head";
import Link from "./PrivateLink";
import { usePrivateRouter as useRouter } from "./usePrivateRouter";
import type { Category, DirectoryLink, Grant } from "../../server/secret";
import styles from "../../../styles/secret.module.css";

export type Props = {
  mode: "directory" | "admin" | "login" | "invite" | "unavailable";
  admin?: boolean;
  category?: string;
  categories?: Category[];
  links?: DirectoryLink[];
  grants?: Grant[];
};

async function send(body: Record<string, unknown>) {
  const response = await fetch("/api/secret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { error?: string; invite?: string };
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export default function SecretPage(props: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [invitation, setInvitation] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState<DirectoryLink | null>(null);
  useEffect(() => {
    if (props.mode === "invite") {
      // Fragments never reach the server, access logs, or referrer headers.
      setInviteToken(window.location.hash.slice(1));
      window.history.replaceState(window.history.state, "", "/secret/invite");
    }
  }, [props.mode]);

  async function perform(
    body: Record<string, unknown>,
    destination?: string,
    form?: HTMLFormElement,
  ) {
    setBusy(true);
    setError("");
    try {
      const data = await send(body);
      if (data.invite) {
        setInvitation(`${window.location.origin}${data.invite}`);
        setCopied(false);
        form?.reset();
        return;
      }
      form?.reset();
      if (body.action === "link") setEditing(null);
      if (destination) await router.replace(destination);
      else await router.replace(router.asPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  function submit(
    event: SyntheticEvent<HTMLFormElement>,
    action: string,
    destination?: string,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields: Record<string, unknown> = { action };
    new FormData(form).forEach((value, key) => {
      fields[key] = value;
    });
    void perform(
      fields,
      destination,
      action === "invite" || action === "link" || action === "category"
        ? form
        : undefined,
    );
  }
  const categories = props.categories || [];
  const links = props.links || [];
  const selected = categories.find((c) => c.slug === props.category);
  const date = (seconds: number) =>
    new Date(seconds * 1000).toISOString().slice(0, 10);

  return (
    <div className={styles.shell}>
      <Head>
        <title>
          {props.mode === "admin"
            ? "The control room"
            : selected?.title || "The side door"}{" "}
          · William Bratz
        </title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
        {selected?.slug === "rabbit-holes" && (
          <link
            rel="icon"
            type="image/png"
            href="/white-rabbit.png"
            key="category-icon"
          />
        )}
      </Head>
      <header className={styles.header}>
        <Link href="/secret">
          <a className={styles.wordmark}>
            <img
              className={styles.avatar}
              src="/after-hours-avatar.jpg"
              alt="Illustrated portrait of a man holding a child"
              width={56}
              height={56}
            />
            <span> / AFTER HOURS</span>
          </a>
        </Link>
        {(props.mode === "directory" || props.mode === "admin") && (
          <nav>
            {props.admin && (
              <Link href={props.mode === "admin" ? "/secret" : "/secret/admin"}>
                <a>{props.mode === "admin" ? "Directory" : "Control room"}</a>
              </Link>
            )}
            <button
              disabled={busy}
              onClick={() => perform({ action: "logout" }, "/secret/admin")}
            >
              Leave & forget browser
            </button>
          </nav>
        )}
      </header>
      <main className={styles.main}>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {props.mode === "unavailable" ? (
          <section className={styles.gate}>
            <p className={styles.eyebrow}>BRIEFLY OFFLINE</p>
            <h1>The door is stuck.</h1>
            <p>
              The private directory is temporarily unavailable. Try again
              shortly.
            </p>
          </section>
        ) : null}
        {props.mode === "login" && (
          <section className={styles.gate}>
            <p className={styles.eyebrow}>OWNER ACCESS</p>
            <h1>The control room.</h1>
            <p>Invitations, familiar faces, and a little housekeeping.</p>
            <form onSubmit={(e) => submit(e, "login", "/secret/admin")}>
              <label>
                Admin key
                <input
                  name="key"
                  type="password"
                  required
                  autoComplete="current-password"
                  maxLength={512}
                />
              </label>
              <button className={styles.primary} disabled={busy}>
                {busy ? "Opening…" : "Unlock control room →"}
              </button>
            </form>
          </section>
        )}
        {props.mode === "invite" && (
          <section className={styles.gate}>
            <p className={styles.eyebrow}>YOU KNOW SOMEONE</p>
            <h1>Come on in.</h1>
            <p>
              A quieter corner of the internet for my side projects, useful
              tools, and assorted rabbit holes.
            </p>
            <p>
              Accept this invitation to remember this browser. You can come back
              through <strong>/secret</strong> anytime, until access is revoked
              or your browser forgets.
            </p>
            <button
              className={styles.primary}
              disabled={busy || !inviteToken}
              onClick={() =>
                perform({ action: "accept", token: inviteToken }, "/secret")
              }
            >
              {busy ? "Opening the door…" : "Accept invitation →"}
            </button>
            {!inviteToken && (
              <p>You need a fresh invitation link from William to enter.</p>
            )}
            <small>One invitation. One browser. No account to create.</small>
          </section>
        )}
        {props.mode === "directory" && (
          <>
            <section className={styles.hero}>
              <p className={styles.eyebrow}>
                THE UNLISTED DIRECTORY / EST. WHENEVER
              </p>
              <h1
                className={
                  selected?.slug === "rabbit-holes"
                    ? styles.categoryTitle
                    : undefined
                }
              >
                {selected?.slug === "rabbit-holes" && (
                  <img
                    className={styles.categoryIcon}
                    src="/white-rabbit.png"
                    alt=""
                    width={96}
                    height={96}
                  />
                )}
                {selected ? (
                  selected.title
                ) : (
                  <>
                    My side
                    <br />
                    <em>of the internet.</em>
                  </>
                )}
              </h1>
              <p>
                {selected
                  ? selected.description
                  : "Side projects, half-baked ideas, and things worth keeping around. Make yourself at home."}
              </p>
            </section>
            {selected && (
              <Link href="/secret">
                <a className={styles.back}>← All categories</a>
              </Link>
            )}
            <div className={styles.grid}>
              {(selected ? [selected] : categories).map((category) => (
                <section className={styles.card} key={category.id}>
                  <div className={styles.cardTop}>
                    <span>
                      {String(
                        categories.findIndex((c) => c.id === category.id) + 1,
                      ).padStart(2, "0")}
                    </span>
                    <span>
                      {
                        links.filter((l) => l.category_id === category.id)
                          .length
                      }{" "}
                      LINKS
                    </span>
                  </div>
                  <h2>
                    <Link href={`/secret/${category.slug}`}>
                      <a>
                        {category.slug === "rabbit-holes" && (
                          <img
                            className={styles.cardIcon}
                            src="/white-rabbit.png"
                            alt=""
                            width={56}
                            height={56}
                          />
                        )}
                        <span>{category.title} ↗</span>
                      </a>
                    </Link>
                  </h2>
                  <p>{category.description}</p>
                  <div className={styles.links}>
                    {links
                      .filter((l) => l.category_id === category.id)
                      .map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          rel="noopener noreferrer"
                        >
                          <strong>
                            {link.title}
                            <span>↗</span>
                          </strong>
                          {link.description && (
                            <small>{link.description}</small>
                          )}
                        </a>
                      ))}
                  </div>
                  {!links.some((l) => l.category_id === category.id) && (
                    <small className={styles.empty}>
                      {["projects", "tools"].includes(category.slug)
                        ? "None yet."
                        : "Something is brewing here."}
                    </small>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
        {props.mode === "admin" && (
          <>
            <section className={styles.hero}>
              <p className={styles.eyebrow}>JUST YOU BACK HERE</p>
              <h1>The control room.</h1>
              <p>Hand out keys. Keep things organized.</p>
            </section>
            <div className={styles.adminGrid}>
              <section className={styles.panel}>
                <h2>Invite someone</h2>
                <p>
                  Valid for 24 hours. Accepted once, then remembered in that
                  browser.
                </p>
                <form onSubmit={(e) => submit(e, "invite")}>
                  <label>
                    Name this invitation
                    <input
                      name="label"
                      placeholder="Alex's phone"
                      required
                      maxLength={160}
                    />
                  </label>
                  <button className={styles.primary} disabled={busy}>
                    Create invitation →
                  </button>
                </form>
                {invitation && (
                  <div className={styles.invitation}>
                    <label>
                      Share this link
                      <input
                        readOnly
                        value={invitation}
                        onFocus={(e) => e.target.select()}
                      />
                    </label>
                    <button
                      disabled={busy}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(invitation);
                          setCopied(true);
                        } catch {
                          setError(
                            "Select the invitation link and copy it manually.",
                          );
                        }
                      }}
                    >
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                    <small>
                      This link is shown only now. Create another if you lose
                      it.
                    </small>
                  </div>
                )}
              </section>
              <section className={styles.panel}>
                <h2>{editing ? "Edit link" : "Add a link"}</h2>
                <form
                  key={editing?.id || "new"}
                  onSubmit={(e) => submit(e, "link")}
                >
                  {editing && (
                    <input type="hidden" name="id" value={editing.id} />
                  )}
                  <label>
                    Category
                    <select
                      name="category_id"
                      required
                      defaultValue={editing?.category_id || ""}
                    >
                      <option value="" disabled>
                        Choose a category
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title
                    <input
                      name="title"
                      required
                      maxLength={160}
                      defaultValue={editing?.title}
                    />
                  </label>
                  <label>
                    URL
                    <input
                      name="url"
                      required
                      placeholder="https://…"
                      maxLength={2000}
                      defaultValue={editing?.url}
                    />
                  </label>
                  <label>
                    Description
                    <input
                      name="description"
                      maxLength={500}
                      defaultValue={editing?.description}
                    />
                  </label>
                  <button className={styles.primary} disabled={busy}>
                    Save link →
                  </button>
                  {editing && (
                    <button type="button" onClick={() => setEditing(null)}>
                      Cancel editing
                    </button>
                  )}
                </form>
              </section>
              <section className={styles.panel}>
                <h2>Categories</h2>
                <p>Use an existing slug to update a category.</p>
                <form onSubmit={(e) => submit(e, "category")}>
                  <label>
                    Title
                    <input name="title" required maxLength={160} />
                  </label>
                  <label>
                    URL slug
                    <input
                      name="slug"
                      required
                      placeholder="side-projects"
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      maxLength={80}
                    />
                  </label>
                  <label>
                    Description
                    <input name="description" maxLength={500} />
                  </label>
                  <button className={styles.primary} disabled={busy}>
                    Save category →
                  </button>
                </form>
                {categories.map((c) => (
                  <div className={styles.row} key={c.id}>
                    <div>
                      <strong>{c.title}</strong>
                      <small>/secret/{c.slug}</small>
                    </div>
                    <button
                      disabled={
                        busy || links.some((l) => l.category_id === c.id)
                      }
                      onClick={() =>
                        perform({ action: "delete-category", id: c.id })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>
              <section className={styles.panel}>
                <h2>Directory links</h2>
                {!links.length && (
                  <p>Add your first link to get things started.</p>
                )}
                {links.map((l) => (
                  <div className={styles.row} key={l.id}>
                    <div>
                      <strong>{l.title}</strong>
                      <small>
                        {categories.find((c) => c.id === l.category_id)?.title}
                      </small>
                    </div>
                    <button disabled={busy} onClick={() => setEditing(l)}>
                      Edit
                    </button>
                    <button
                      disabled={busy}
                      onClick={() =>
                        perform({ action: "delete-link", id: l.id })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>
            </div>
            <section className={styles.panel}>
              <h2>Invitations & browsers</h2>
              <p>
                Revoking an invitation also removes the browser access it
                granted. Showing the most recent 200.
              </p>
              {!props.grants?.length && <p>No invitations yet.</p>}
              {props.grants?.map((g) => (
                <div className={styles.row} key={g.id}>
                  <div>
                    <strong>{g.label}</strong>
                    <small>
                      {g.revoked
                        ? "Revoked"
                        : g.accepted_at
                          ? (g.session_expires ?? 0) <= Date.now() / 1000
                            ? "Browser access expired"
                            : `Browser approved · last visit ${date(g.last_seen ?? g.accepted_at ?? g.created_at)}`
                          : g.invite_expires <= Date.now() / 1000
                            ? "Invitation expired"
                            : "Waiting for acceptance"}{" "}
                      · created {date(g.created_at)}
                    </small>
                  </div>
                  {!g.revoked && (
                    <button
                      disabled={busy}
                      onClick={() => perform({ action: "revoke", id: g.id })}
                    >
                      Revoke access
                    </button>
                  )}
                </div>
              ))}
            </section>
          </>
        )}
      </main>
      <footer className={styles.footer}>
        <span>WILLIAM BRATZ</span>
        <span>A little off the beaten path.</span>
      </footer>
    </div>
  );
}
