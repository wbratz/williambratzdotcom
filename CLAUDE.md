# WilliamBratz.com contributor guide

## Purpose

This is William Bratz's personal portfolio and technical publication. It
positions him around production AI systems, MCP infrastructure, distributed
systems, engineering judgment, and durable organizational knowledge.

The site should feel technically credible, readable, personal, and restrained.
Dark mode is the default, but both themes must remain usable.

## Public writing style

- Lead with concrete ideas and evidence.
- Do not use em dashes in public copy.
- Avoid generic AI-marketing language.
- Preserve the personality of older essays unless editorial work is requested.
- Never expose private company details, internal names, credentials, or
  proprietary Vault content.
- This repository is public, and commit messages are public too. Describe the
  value of the work without naming an employer, internal tool, repository,
  service, ticket, or pull request. Do not publish results that are not
  already on the site.
- Say "work request" for an assignment and "change" for what an agent
  produces. Do not use words that point at a tracker, such as "ticket" or
  "story".
- Use curly apostrophes in titles. `npm run check:metadata` compares `title`
  with `og:title` and fails on straight ones.
- Do not add a list of forbidden terms to this repository. A list of what to
  hide tells readers where to look. Keep it outside the repo.

## Shared notes across machines

Sessions on more than one computer work on this site. Keep their reasoning in
step:

- Write commit messages with a short "what" and a "why", so a later session
  can recover the reasoning from `git log`.
- Read `docs/SITE-NOTES.md` before editorial work. It lists open work and logs
  each decision. Add a log entry when you finish a piece of work, and remove an
  item from the open list when it is done.
- Keep private reasoning out of this repository. Anything about what must stay
  hidden belongs in a private place.

## Architecture

- Astro 7 with prerendered public pages and on-demand private routes on Cloudflare Workers.
- Strict TypeScript.
- Markdown content collection configured in `src/content.config.ts`.
- Static routes live in `src/pages/`.
- Shared Astro shell lives in `src/layouts/BaseLayout.astro`.
- Header and footer are native Astro components.
- Five page bodies remain React components under `pages/` as a migration
  bridge. They render only at build time and must not receive `client:*`
  directives.
- Browser JavaScript should remain limited to theme switching, mobile
  navigation, and writing-topic filtering.
- The private directory is the exception: its React screens hydrate for owner
  forms and data browsing. Do not add private routes to public navigation or the
  sitemap. Every private page and download must enforce server authorization.

## Content rules

Every file in `contents/` requires:

- `title`
- `slug` matching the filename
- ISO `date`
- concise `description`
- `photo` and `banner`
- meaningful `imageAlt`
- one or more `topics`
- `featured`

Series entries require both `series` and a positive `seriesOrder`.

Public Markdown images must use root-relative paths:

```markdown
![Useful alt text](/blogContent/post-slug/image.svg)
```

Do not manually generate RSS or sitemap files. Astro builds `/rss.xml` and
`/sitemap.xml` from the content collection.

## Styling

- Global theme variables and locally hosted Inter are in
  `styles/globals.css`.
- Page styles remain CSS Modules during the migration.
- Long-form prose uses a readable serif fallback with controlled measure and
  generous line height.
- Preserve keyboard focus, reduced-motion support, semantic headings, and
  useful alt text.
- Verify desktop and narrow layouts after visual changes.

## Deployment contract

- Node version: 22.x.
- Build command: `npm run build`.
- Public output: `out/client/`; Cloudflare server bundle: `out/server/`.
- Use `npm run deploy:cloudflare` for a deliberate production release. The source
  configuration includes live Worker routes; changing `--origin` does not isolate
  a review deployment. The apex redirect has its own configuration under
  `cloudflare/redirect.wrangler.jsonc`. Follow `docs/cloudflare-migration.md` for
  runtime secrets and the Render fallback.

## Required checks

Before pushing:

```bash
npm run check
npm run build
xmllint --noout out/client/rss.xml out/client/sitemap.xml
git diff --check
```

Also inspect the rendered homepage, writing index, representative long-form
article, About page, Projects page, and résumé at desktop and mobile widths.
