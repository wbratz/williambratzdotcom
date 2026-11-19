import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/production-agents/",
  "/coding-agents/",
  "/blog/proving-the-vaults-value/",
  "/about/",
  "/ai-engineering/",
  "/projects/",
  "/projects/vault/",
  "/blog/",
  "/blog/auth-intro/",
  "/blog/bridging-the-gap/",
  "/blog/favorite-factory/",
  "/blog/fluent-interfaces/",
  "/blog/only-git-commands-youll-ever-need/",
  "/blog/programming-as-theory-building/",
  "/blog/railway-oriented-programming/",
  "/blog/the-leap-of-faith/",
  "/blog/the-map-is-not-the-theory/",
  "/resume/",
];

for (const theme of ["dark", "light"] as const) {
  for (const route of routes) {
    test(`${route} (${theme}) has no detectable WCAG A or AA violations`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      if (theme === "light") {
        await page.evaluate(() =>
          document.documentElement.classList.remove("dark"),
        );
        // Let color transitions finish before measuring contrast.
        await page.waitForTimeout(300);
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
