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
- Use `npm run deploy:cloudflare` for a deliberate release. Review deployments
  do not change the live custom-domain routing. Follow
  `docs/cloudflare-migration.md` for the Render cutover and runtime secrets.

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
