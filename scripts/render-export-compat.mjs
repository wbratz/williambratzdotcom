if (process.argv[2] !== "export") {
  console.error(
    "This compatibility command only supports the legacy Render `next export` argument.",
  );
  process.exit(1);
}

console.log(
  "Astro already emitted the static site to out/. No separate export is required.",
);
