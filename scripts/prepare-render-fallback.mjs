import { cpSync, existsSync, mkdirSync, rmSync, renameSync } from "node:fs";
import { resolve, dirname } from "node:path";

// Render's existing static service publishes out/. Never publish the Worker
// bundle there: it contains authenticated content, not public assets.
if (process.env.RENDER === "true") {
  const workspace = process.cwd();
  const output = resolve(workspace, "out");
  const staging = resolve(workspace, ".wrangler/render-public");
  if (
    dirname(output) !== workspace ||
    !existsSync(resolve(output, "client/index.html"))
  )
    throw new Error("Expected the Astro public build before preparing Render.");
  if (dirname(staging) !== resolve(workspace, ".wrangler"))
    throw new Error("Render staging must remain inside the workspace.");
  mkdirSync(dirname(staging), { recursive: true });
  rmSync(staging, { recursive: true, force: true });
  cpSync(resolve(output, "client"), staging, { recursive: true });
  rmSync(output, { recursive: true });
  renameSync(staging, output);
  console.log(
    "Prepared public-only Render fallback; removed the private server bundle.",
  );
}
