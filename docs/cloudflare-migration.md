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

The initial workers.dev review used its exact origin. Now that the source includes production routes, `--origin` alone does not create an isolated review deployment: it updates the live Worker and its allowed form origin. Keep the production origin for releases. Use a separate Worker configuration and isolated resources for future previews.

For local development, copy those values into ignored `.dev.vars`, set `SECRET_SITE_ORIGIN=http://localhost:4321`, and initialize the isolated local database before running `npm run dev`:

```sh
npx wrangler d1 execute DB --local --file db/secret.sql --config wrangler.jsonc --yes
npx wrangler d1 execute DB --local --file db/childhood-vaccinations.sql --config wrangler.jsonc --yes
```

The local database does not share production grants or edits. Production cookies use the Secure host-only prefix; local-development cookies have a separate name.

## Production cutover

Production uses Worker routes over the existing proxied DNS records. `www.williambratz.com/*` serves the main Worker and its bundled assets; `williambratz.com/*` serves a small redirect Worker that sends every request to HTTPS www, preserving its path and query string. Render is not fetched by either Worker. Keeping the redirect separate lets public assets use direct asset serving without bypassing the hostname redirect.

Deploy the site first, verify it, then deploy the redirect:

```sh
npm run deploy:cloudflare
npx wrangler deploy --config cloudflare/redirect.wrangler.jsonc
```

The main deploy helper sets `SECRET_SITE_ORIGIN=https://www.williambratz.com`. The workers.dev address remains available for public diagnostics, but form submissions must use the production origin. The D1 database and existing grants are preserved. Browser cookies are host-specific, so access granted on workers.dev requires a new invitation on www.

Release verification covers public pages, RSS, sitemap, résumé, protected-page and download rejection, owner login, invitation acceptance and replay rejection, authenticated downloads, and revocation. Also check apex redirects with paths and query strings.

Render remains available at https://williambratzdotcom.onrender.com as a public-site rollback target. Its existing static publish directory stays `out`. When Render sets `RENDER=true`, the postbuild script keeps only the public `out/client` files, moves them into `out`, and removes the private Worker bundle before publishing. Other builds retain the normal Cloudflare output layout. Render cannot serve the private SSR endpoints.

For rollback, remove the two routes in Cloudflare's zone Worker Routes dashboard. Existing proxied DNS still targets Render, so public requests return there without DNS replacement or propagation. Remove the matching `routes` entries from source configuration before another deploy to keep them from being recreated. Verify public pages, retain D1 and the gateway Worker, and remember that Render cannot restore private access. Do not delete Render or change its underlying DNS target while this rollback arrangement is in use.

Releases currently use the local deployment commands above; merging alone does not deploy Cloudflare. For automated releases, connect this repository in Workers Builds with `npm ci && npm run build` and `npx wrangler deploy`, retaining the four runtime secrets in the Worker. Deploy the redirect configuration separately when it changes.

## Private content

The directory has no public navigation or sitemap entry. Invite acceptance requires a click and an atomic D1 write; previews do not redeem invitations. Approved browsers are remembered for up to 400 days, with rolling renewal; clearing cookies or changing hosts/browsers requires another invitation. Cookie persistence is not hardware-bound identity.

The first article is Childhood Vaccinations. Current charts combine autism, ADHD, and asthma and exclude obesity. Original files, including their older four-condition analysis, are preserved as archived references. The generated protected CSV 09 contains the current three-condition comparison. Tests verify all 18 original coefficients, the recalculated coefficients, missing observations, file access, expiry, replay rejection, revocation, and the Astro HTTP bridge.

The article distinguishes reconstructed schedule estimates from doses received, labels the assumed pregnancy recommendations, and states what the historical correlations can and cannot show. Its main age-8 autism values were checked against the CDC table on October 28, 2026; other source values and schedule reconstructions remain labeled unverified.
