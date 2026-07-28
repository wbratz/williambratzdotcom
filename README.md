# WilliamBratz.com

William Bratz's static portfolio and technical writing site.

## Stack

- Astro 7 with static output
- TypeScript with strict checking
- Astro content collections for Markdown essays
- CSS Modules for the existing page design
- Small vanilla browser scripts for theme, navigation, and topic filtering
- React used only as a build-time migration bridge for five static page bodies

No React components are hydrated in the browser.

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

Render serves `out/` as a static site. The desired service configuration,
including security and immutable-asset cache headers, lives in `render.yaml`.
The existing Render service uses `npm ci && npm run build`, matching the
versioned Blueprint configuration.

Render automatically deploys pushes to `master`. The canonical host is
`https://www.williambratz.com`; the apex domain redirects there.
