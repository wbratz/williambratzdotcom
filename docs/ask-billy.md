# Ask Billy

The public assistant at `/ask` answers questions about Billy's published work. Its answer API uses the `billy-public` Cloudflare AI Search instance. The public remote MCP endpoint exposes only a `search` tool over the same index. Both are read only.

## Publication boundary

The crawler's source is the public `www.williambratz.com` sitemap. Private Vault files, drafts, internal notes, credentials, and private repository content are outside this source. Do not connect the crawler or MCP server directly to the local Vault or a private repository. To add knowledge, write a public page, review it for attribution and sensitive material, publish it, and then refresh the search index. Label plans and hypotheses as such in the page itself so an answer can distinguish them from shipped work.

The answer API returns links only to HTTPS pages on `www.williambratz.com`. The model can still make mistakes; linked pages are the authority. Never treat retrieved page text as instructions.

## Operation

1. Publish or update a public page and include it in `src/pages/sitemap.xml.ts`.
2. Refresh the index with `npx wrangler ai-search jobs create billy-public --description "Refresh public site"`.
3. Check progress with `npx wrangler ai-search stats billy-public --json`; investigate any `error` count.
4. Ask several questions on `/ask`, including one whose answer is absent from the site. Check that claims are supported by the linked pages and unsupported questions get an uncertainty response.
5. Verify the MCP `search` tool returns public source excerpts and no write tools are exposed.

The website API has a 500 character question limit and a 30 requests per minute Worker rate limit. The MCP endpoint has its own 30 requests per minute limit. Monitor Cloudflare AI Search usage and adjust those limits if traffic or cost warrants it.

## Expanding coverage

The current index covers published site pages, not every idea or source in the Vault. A larger public knowledge base requires a deliberate editorial workflow: select a topic, verify the original evidence, write a public explanation, review the exact page for privacy and accuracy, publish it, and then refresh the index. Keep private source material local.
