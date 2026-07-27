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
npm run check
npm run build
```

The production site is emitted to `out/`. RSS and sitemap XML are generated as
native Astro routes during the same build.

## Content

Essays live in `contents/`. Their frontmatter is validated by
`src/content.config.ts`. Public images live in `public/blogContent/` and should
use root-relative Markdown paths such as `/blogContent/example/image.svg`.

## Deployment

Render serves `out/` as a static site. The temporary `next export`
compatibility script exists only because the current Render build command still
invokes that retired command after `npm run build`; it performs no build work.
