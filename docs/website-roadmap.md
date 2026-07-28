# WilliamBratz.com Improvement Roadmap

## Objective

Turn WilliamBratz.com from a chronological personal blog into a focused technical
portfolio and publication for a senior engineer working in production AI systems,
MCP infrastructure, distributed systems, and durable organizational knowledge.

The site should make that positioning clear within ten seconds, make the strongest
work easy to evaluate, and remain simple to publish and maintain.

## Product principles

1. **Lead with the work.** The homepage explains who Billy is, what he builds, and
   where to go next before showing the archive.
2. **Writing is a body of work, not a feed.** Series, topics, and selected essays
   should communicate a coherent point of view.
3. **Projects should be reproducible.** Important ideas—especially The Vault—need
   project pages, architecture, examples, and a path to try them.
4. **Readable by default.** Dark mode, typography, responsive layout,
   accessibility, and reduced motion are product requirements.
5. **Static first.** Content pages should ship minimal client-side JavaScript.
6. **Modernize incrementally.** Product and content improvements come before the
   framework migration so migration risk does not block visible progress.
7. **Every phase must leave the site deployable.**

## Success criteria

- A first-time reader can identify Billy's specialization and primary work in ten
  seconds.
- Resume, writing, GitHub, and Vault scaffold are reachable from the homepage in
  one action.
- Every public page has a unique title, description, canonical URL, and useful
  social preview.
- Articles expose dates, reading time, relationships, and subscription paths.
- Navigation is usable with keyboard, touch, and assistive technology.
- The production build, type check, internal-link check, and accessibility checks
  run in CI.
- The final site has no obsolete analytics, unexplained public experiments, or
  unused generated assets.

## Phase 1 — Identity, shell, and discovery

### 1A. Homepage and shared shell

- Replace the duplicate blog homepage with an identity-led landing page.
- Introduce a clear value proposition:
  production AI systems, MCP infrastructure, distributed systems, and
  organizational knowledge.
- Add primary paths to selected writing, résumé, GitHub, and The Vault scaffold.
- Replace the legacy red navigation and oversized icon footer with a restrained,
  editorial shell aligned to the article and résumé palette.
- Add About, Writing, Projects, and Résumé information architecture. Until the
  About and Projects pages land, homepage anchors provide valid destinations.
- Preserve dark mode as the default and retain a light-mode option.

Acceptance:

- Homepage contains one H1, a clear specialization, selected work, selected
  writing, and contact paths.
- Header and footer work at desktop and mobile sizes.
- Active navigation, theme toggle, and mobile menu have accessible names and
  keyboard behavior.

### 1B. Discovery and article metadata

- Add unique page titles and descriptions.
- Add canonical, Open Graph, and Twitter metadata.
- Add visible article dates and computed reading time.
- Add `BlogPosting` JSON-LD.
- Add `robots.txt`, XML sitemap, and RSS.
- Normalize the canonical hostname to `https://www.williambratz.com`.

Acceptance:

- `/robots.txt`, `/sitemap.xml`, and `/rss.xml` return successful responses.
- Every article's rendered HTML names the article rather than the generic site.
- Shared article URLs produce useful title, description, and image previews.

### 1C. Accessibility, analytics, and route hygiene

- Add a skip link and a stable main-content target.
- Replace clickable `div` elements and JavaScript URLs with semantic controls.
- Add accessible image descriptions and control labels.
- Correct invalid list structure on public indexes.
- Remove duplicate/dead Universal Analytics initialization.
- Remove the globally injected donation widget.
- Mark legacy auth experiments `noindex` pending removal or generalization.

Acceptance:

- All primary navigation is keyboard operable.
- No public image or icon-only control lacks an accessible name.
- No Universal Analytics request or repeated initialization remains.
- Legacy experiments are excluded from search indexing.

## Phase 2 — Content system and proof of work

### 2A. Structured writing

- Extend frontmatter with ISO date, topic, series, featured state, image alt text,
  and optional updated date.
- Create a single typed content loader used by the homepage, archive, article
  pages, sitemap, and RSS.
- Add topic filters, reading time, series navigation, previous/next navigation,
  and related essays.
- Replace random build-time UUID keys with stable slugs.

### 2B. Project pages

- Build `/projects` and `/projects/vault`.
- Explain The Vault's problem, operating model, architecture, ingest/query/lint
  lifecycle, product benefits, engineering benefits, limitations, and adoption
  path.
- Link the Karpathy LLM Wiki gist, the long-form essay, and `vault-scaffold`.
- Add at least one small sample Vault or walkthrough.
- Add selected smaller projects only when they reinforce the site's positioning.

### 2C. About and credibility

- Add a concise About page connecting experience, writing, open source, and
  independent products.
- Add a reusable contact callout.
- Review older titles/descriptions for consistency with the current senior
  engineering voice without erasing personality.

Acceptance:

- Writing can be explored by topic and series.
- The Vault can be understood and tried without first reading the full essay.
- Project and article relationships are explicit and crawlable.

## Phase 3 — Platform modernization and cleanup

### Decision gate: Astro or modern Next.js

Evaluate both against:

- static output and JavaScript shipped;
- Markdown/MDX authoring ergonomics;
- metadata, RSS, and sitemap support;
- image and font handling;
- Render/Cloudflare deployment simplicity;
- maintenance cost;
- value of React/Next.js as portfolio evidence.

Current recommendation: **Astro**, because the site is primarily a publication
and portfolio. Choose current Next.js instead if demonstrating modern Next/React
becomes an explicit portfolio objective.

### Migration and cleanup

- Move content and routes to the selected current framework.
- Self-host fonts or use framework-managed local fonts.
- Optimize images and include intrinsic dimensions.
- Render Mermaid at build time or load it only on pages that require it.
- Remove unused packages, duplicate renderers, generated Mermaid bundles, the
  default API route, and stale styles.
- Enable TypeScript strictness incrementally.
- Update README and deployment documentation to reflect Render and Cloudflare.
- Add security headers.

### Quality gates

- Formatting and lint checks.
- Strict type check.
- Production build.
- Internal and external link validation.
- Automated accessibility smoke tests.
- Dependency/security audit.
- Dependabot or Renovate.

Acceptance:

- Clean install and production build pass on the documented Node version.
- No known unused direct dependencies or checked-in generated library bundles.
- Core content remains usable without client-side JavaScript.
- CI enforces the agreed quality gates.

## Release strategy

- Each subphase is one focused commit and can deploy independently.
- Validate the live deployment after each phase.
- Avoid rewriting article prose unless a phase explicitly includes editorial work.
- Preserve public URLs or add redirects.
- Record deviations and completed acceptance criteria in this document.

## Progress log

- 2026-07-27: Site-wide audit completed.
- 2026-07-27: Roadmap accepted; Phase 1 started.
- 2026-07-27: Phase 1A implemented — identity-led homepage and accessible shared shell.
- 2026-07-27: Phase 1B implemented — article metadata, structured data, dates,
  reading time, sitemap, robots, and RSS.
- 2026-07-27: Phase 1C implemented — semantic navigation, focus/reduced-motion
  support, dead Universal Analytics removal, and legacy route `noindex` controls.
- 2026-07-27: Render static-export compatibility restored by generating RSS and
  sitemap files before the Next.js build.
- 2026-07-27: Added four accessible architecture diagrams to The Vault essay to
  clarify its mental model, maintenance loop, product-to-engineering evidence
  chain, and effect on the AI implementation loop.
- 2026-07-27: Phase 2B started with `/projects` and a dedicated `/projects/vault`
  case study covering the generic architecture, operating model, trust boundaries,
  worked example, limitations, and adoption path.
- 2026-07-27: Phase 2A implemented with validated, typed post metadata; a shared
  content loader; topic filters; explicit series order; related essays; and
  previous/next navigation.
- 2026-07-27: Phase 2C implemented with a dedicated About page connecting
  production engineering, public work, working principles, and independent products;
  plus a reusable contact callout, updated site navigation, and consistent
  catalog metadata for older essays.
- 2026-07-27: Phase 3 migration implemented on Astro with strict content
  collections, native static RSS and sitemap routes, locally hosted Inter,
  framework-independent Markdown assets, and small vanilla scripts for theme,
  navigation, and topic filtering. Removed the Next.js runtime, legacy API route,
  and generated Mermaid runtime bundles. Static output remains `out/` so the
  existing Render publish directory does not change.
- 2026-07-27: Production quality gates implemented with Prettier, strict builds,
  generated-site link validation, and Playwright plus axe accessibility scans at
  desktop and mobile sizes. Added GitHub Actions enforcement, weekly Dependabot
  updates, and versioned Render security and cache-header configuration. The new
  accessibility baseline also corrected résumé links that relied on color alone.
- 2026-07-27: Visual discovery phase started with dedicated 1200-by-630 social
  cards for the site and The Vault. Added a site-wide large-card fallback,
  explicit Open Graph dimensions and alt text, and a separate social-image field
  so articles can preserve their visible banners while using preview-optimized
  artwork when shared.
- 2026-07-27: Expanded the independent projects into evidence-led case studies
  with real product screenshots, focused capability summaries, implementation
  details, and direct paths to the live products and source.
- 2026-07-28: Editorial restoration started with the software-design collection.
  Reworked Fluent Interfaces, Favorite Factory, and Railway-Oriented Programming
  around clearer claims, copyable examples, explicit tradeoffs, and current
  technical guidance while preserving their original topics and voice.
- 2026-07-28: Restored the eligible engineering-practice and personal essays in
  place. Programming as Theory Building now develops the practical consequences
  of Naur's argument and links the complete series. The Leap of Faith preserves
  its original story while distinguishing deliberate courage from reckless risk.
  The two newest posts remain protected from prose edits.
