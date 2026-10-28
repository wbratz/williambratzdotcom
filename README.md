# WilliamBratz.com

William Bratz's static portfolio and technical writing site.

## Stack

- Astro 7 with prerendered public pages and Cloudflare-rendered private routes
- TypeScript with strict checking
- Astro content collections for Markdown essays
- CSS Modules for the existing page design
- Small vanilla browser scripts for theme, navigation, and topic filtering
- React used only as a build-time migration bridge for five static page bodies

Public React page bodies remain static. The invite-only directory hydrates its
private React screens for admin forms and data browsing.

## Development

Node 22 is required.

```bash
npm ci
npm run dev
```

## Validation and build

```bash
npm run quality
npm run test:a11y
```

`npm run quality` enforces formatting, strict Astro and TypeScript diagnostics,
the production build, internal-link integrity, and complete social metadata
across every generated HTML page. The Playwright accessibility suite scans every
public essay and core page at desktop and mobile sizes against WCAG A and AA
rules.

The production site is emitted to `out/`. RSS and sitemap XML are generated as
native Astro routes during the same build. GitHub Actions runs the complete
quality pipeline for pull requests and every push to `master`. A separate weekly
workflow checks external destinations without making ordinary builds dependent
on third-party availability. Run it locally with:

```bash
npm run build
npm run check:links:external
```

## Content

Essays live in `contents/`. Their frontmatter is validated by
`src/content.config.ts`. Public images live in `public/blogContent/` and should
use root-relative Markdown paths such as `/blogContent/example/image.svg`.

## Deployment

Cloudflare Workers hosts the prerendered public pages and the protected private
routes. Build artifacts live under `out/client/` and `out/server/`.
`npm run deploy:cloudflare` builds and deploys using the four server-only
`SECRET_*` values from ignored `.env.local` or the deployment environment.

Cloudflare serves production through Worker routes; Render remains the public fallback.
The canonical host is `https://www.williambratz.com`; the apex redirects there.
See [Cloudflare migration and private-directory setup](docs/cloudflare-migration.md)
for deployments, secrets, access controls, and rollback instructions.
