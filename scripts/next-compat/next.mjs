#!/usr/bin/env node

const command = process.argv[2];

if (command === "export") {
  console.log(
    "Astro already emitted the static site to out/. No separate export is required.",
  );
  process.exit(0);
}

console.error(`Unsupported legacy Next command: ${command ?? "(none)"}`);
process.exit(1);
