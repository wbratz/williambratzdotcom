import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  site: "https://www.williambratz.com",
  output: "static",
  outDir: "./out",
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        "next/head": fileURLToPath(new URL("./src/compat/Head.tsx", import.meta.url)),
        "next/link": fileURLToPath(new URL("./src/compat/Link.tsx", import.meta.url)),
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
