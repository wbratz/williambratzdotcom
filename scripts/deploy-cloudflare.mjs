import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  existsSync,
} from "node:fs";
import { parseEnv } from "node:util";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const local = existsSync(".env.local")
  ? parseEnv(readFileSync(".env.local", "utf8"))
  : {};
const names = [
  "SECRET_ADMIN_KEY",
  "SECRET_DATABASE_KEY",
  "SECRET_DATABASE_URL",
  "SECRET_SITE_ORIGIN",
];
const originIndex = process.argv.indexOf("--origin");
const origin =
  originIndex === -1
    ? "https://www.williambratz.com"
    : process.argv[originIndex + 1];
if (
  !origin ||
  new URL(origin).origin !== origin ||
  !origin.startsWith("https://")
)
  throw new Error("Supply an exact HTTPS origin without a trailing slash.");
const secrets = Object.fromEntries(
  names.map((name) => [name, process.env[name] || local[name]]),
);
secrets.SECRET_SITE_ORIGIN = origin;
if (names.some((name) => !secrets[name]))
  throw new Error(
    "Set the four SECRET_* variables in .env.local or the environment before deployment.",
  );
const secretFile = resolve(".wrangler/website-secrets.json");
mkdirSync(".wrangler", { recursive: true });
try {
  writeFileSync(secretFile, JSON.stringify(secrets), { mode: 0o600 });
  execFileSync(
    process.execPath,
    [
      resolve("node_modules/wrangler/bin/wrangler.js"),
      "deploy",
      "--secrets-file",
      secretFile,
    ],
    { stdio: "inherit" },
  );
} finally {
  if (existsSync(secretFile)) unlinkSync(secretFile);
}
