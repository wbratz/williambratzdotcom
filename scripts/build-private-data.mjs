import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = "contents/private/childhood-vaccinations";
const files = Object.fromEntries(
  readdirSync(root)
    .filter((name) => /\.(csv|png|pdf)$/.test(name))
    .sort()
    .map((name) => [name, readFileSync(join(root, name)).toString("base64")]),
);
mkdirSync("src/generated", { recursive: true });
writeFileSync(
  "src/generated/private-files.ts",
  `// Generated for the server bundle only. Never import from a client component.\nexport const privateFiles: Record<string, string> = ${JSON.stringify(files)};\n`,
);
console.log(
  `Prepared ${Object.keys(files).length} protected source files for the server bundle.`,
);
