import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
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

for (const route of routes) {
  test(`${route} has no detectable WCAG A or AA violations`, async ({
    page,
  }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
