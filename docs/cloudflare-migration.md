# Cloudflare hosting and private directory

The public site stays on the current Astro production code. Public pages, RSS, and the sitemap are prerendered into `out/client/`; only `/secret/*` and its APIs render on demand in a Cloudflare Worker. The private React components hydrate for invitations, admin forms, and the CSV selector. Existing public React page bodies remain static.

## Build and review

```sh
npm ci
npm run quality
npm run test:secret
npm run test:a11y
```

The Cloudflare adapter is pinned to 14.1.0 for compatibility with the site's existing Astro 7.1.4 version. The hosting Worker uses compatibility date 2026-10-26, the newest date supported by the adapter's bundled local workerd runtime when prepared on October 28, 2026.

Private CSV, PDF, and PNG originals live in `contents/private/childhood-vaccinations/`. The build generates a server-only module under ignored `src/generated/`. Private files are never copied into `public/` or `out/client/`. The allowlisted file API checks browser authorization before returning original or recalculated downloads.

The D1 database already exists in William's Cloudflare account. The hosted site connects through its native `DB` binding, preserving directory entries, invitations, and revocations. The earlier authenticated gateway Worker remains available for external tooling and fallback use outside Workers. The website does not receive a Cloudflare account API token.

## Secrets

Keep the four values from `.env.example` in ignored `.env.local` for deployment, or supply them through the deployment environment:

- `SECRET_DATABASE_URL`: the existing D1 gateway's HTTPS `/query` endpoint.
- `SECRET_DATABASE_KEY`: the existing gateway access key.
- `SECRET_ADMIN_KEY`: the owner key used at `/secret/admin`.
- `SECRET_SITE_ORIGIN`: the exact browser origin allowed to submit forms.

`npm run deploy:cloudflare` builds the site and uploads the four secrets together with the Worker version using an ignored temporary JSON file, then removes it. It sets the form origin to `https://www.williambratz.com` by default.

For a workers.dev review deployment, use its exact origin:

```sh
npm run deploy:cloudflare -- --origin https://williambratzdotcom.williambratz00.workers.dev
```

For local development, copy those values into ignored `.dev.vars`, set `SECRET_SITE_ORIGIN=http://localhost:4321`, and initialize the isolated local database before running `npm run dev`:

```sh
npx wrangler d1 execute DB --local --file db/secret.sql --config wrangler.jsonc --yes
npx wrangler d1 execute DB --local --file db/childhood-vaccinations.sql --config wrangler.jsonc --yes
```

The local database does not share production grants or edits. Production cookies use the Secure host-only prefix; local-development cookies have a separate name.

## Production cutover

The source configuration deliberately has no custom-domain routes, so a review deployment does not replace Render. After testing the Worker and accepting the PR:

1. Configure `www.williambratz.com` and `williambratz.com` as custom domains for the `williambratzdotcom` Worker in Cloudflare. Reconcile any existing Render DNS records using Cloudflare's custom-domain flow.
2. Deploy with `SECRET_SITE_ORIGIN=https://www.williambratz.com`. The deploy script defaults to that value.
3. Confirm the public homepage, writing, projects, About, AI engineering, RSS, sitemap, and résumé. Confirm a guessed `/secret` and direct private download return 404, then test an invitation and revocation on the real domain.
4. Configure an apex-to-www Redirect Rule in Cloudflare for public asset requests. The runtime also redirects on-demand apex requests to www. Static assets carry the existing security headers, and private responses use `no-store`, `noindex`, and `no-referrer`.
5. Retain Render as a rollback target until the Cloudflare deployment is verified. A PR merge alone does not move DNS or create Cloudflare custom-domain routes. Render's existing static service cannot serve the new private SSR routes.

The current Render source remains versioned in `render.yaml` as a record of the previous deployment. For automated Cloudflare releases, connect this repository in Workers Builds with `npm ci && npm run build` and `npx wrangler deploy`, setting the four runtime secrets in the Worker. The local deployment helper is available immediately; CI does not silently deploy production.

## Private content

The directory has no public navigation or sitemap entry. Invite acceptance requires a click and an atomic D1 write; previews do not redeem invitations. Approved browsers are remembered for up to 400 days, with rolling renewal; clearing cookies or changing hosts/browsers requires another invitation. Cookie persistence is not hardware-bound identity.

The first article is Childhood Vaccinations. Current charts combine autism, ADHD, and asthma and exclude obesity. Original files, including their older four-condition analysis, are preserved as archived references. The generated protected CSV 09 contains the current three-condition comparison. Tests verify all 18 original coefficients, the recalculated coefficients, missing observations, file access, expiry, replay rejection, revocation, and the Astro HTTP bridge.

The article distinguishes reconstructed schedule estimates from doses received, labels the assumed pregnancy recommendations, and states what the historical correlations can and cannot show. Its main age-8 autism values were checked against the CDC table on October 28, 2026; other source values and schedule reconstructions remain labeled unverified.
