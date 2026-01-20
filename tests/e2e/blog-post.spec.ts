import { test, expect } from '@playwright/test';
import { SITE_URLS, SELECTORS } from '../helpers/constants';
import {
  waitForPageReady,
  verifyImagesLoaded,
  verifyCodeHighlighting,
  setupConsoleErrorTracking,
} from '../helpers/test-utils';

test.describe('Individual Blog Post', () => {
  let firstPostSlug: string;

  // Get the first blog post URL before running tests
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);

    const firstLink = page.locator(SELECTORS.BLOG_POST_LINK).first();
    const href = await firstLink.getAttribute('href');
    firstPostSlug = href || '/blog/test';

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(firstPostSlug);
    await waitForPageReady(page);
  });

  test('should load without errors', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    await page.goto(firstPostSlug);
    await waitForPageReady(page);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should display blog post title', async ({ page }) => {
    const title = page.locator(SELECTORS.BLOG_POST_TITLE).first();
    await expect(title).toBeVisible();

    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);
  });

  test('should display blog post content', async ({ page }) => {
    // Look for paragraphs or content divs
    const content = page.locator('article, main, [class*="content"]').first();
    await expect(content).toBeVisible();

    const text = await content.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(100); // Should have substantial content
  });

  test('should display banner image if present', async ({ page }) => {
    const images = page.locator(SELECTORS.BLOG_POST_IMAGE);
    const count = await images.count();

    if (count > 0) {
      // At least verify first image is visible
      await expect(images.first()).toBeVisible();
    }
  });

  test('should have syntax highlighting on code blocks', async ({ page }) => {
    // Check if there are code blocks
    const codeBlocks = page.locator(SELECTORS.CODE_BLOCK);
    const count = await codeBlocks.count();

    if (count > 0) {
      // Verify code highlighting
      await verifyCodeHighlighting(page);
    }
  });

  test('should render markdown formatting correctly', async ({ page }) => {
    // Check for common markdown elements
    const headings = page.locator('h1, h2, h3, h4');
    const paragraphs = page.locator('p');
    const lists = page.locator('ul, ol');

    // Should have at least headings and paragraphs
    await expect(headings.first()).toBeVisible();
    await expect(paragraphs.first()).toBeVisible();
  });

  test('should have clickable links', async ({ page }) => {
    const links = page.locator('article a, main a').filter({
      has: page.locator(':not([href^="#"])')
    });

    const count = await links.count();

    if (count > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();

      // Verify link has href
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should have layout elements', async ({ page }) => {
    // Header
    await expect(page.locator(SELECTORS.HEADER).first()).toBeVisible();

    // Footer
    await expect(page.locator(SELECTORS.FOOTER).first()).toBeVisible();
  });

  test('should navigate back to blog listing', async ({ page }) => {
    // Look for back link or blog link
    const blogLink = page.locator('a[href="/blog"]').first();

    if (await blogLink.isVisible()) {
      await blogLink.click();
      await waitForPageReady(page);
      await expect(page).toHaveURL(/\/blog$/);
    }
  });

  test('should display formatted text', async ({ page }) => {
    // Check for bold, italic, etc.
    const formatted = page.locator('strong, em, b, i, code');
    const count = await formatted.count();

    // Most blog posts should have some formatting
    // But this is not a hard requirement
    if (count > 0) {
      await expect(formatted.first()).toBeVisible();
    }
  });

  test('should handle images gracefully', async ({ page }) => {
    const images = page.locator(SELECTORS.BLOG_POST_IMAGE);
    const count = await images.count();

    if (count > 0) {
      // Verify images load
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
      }
    }
  });

  test('should have readable font size', async ({ page }) => {
    const paragraph = page.locator('article p, main p').first();

    if (await paragraph.isVisible()) {
      const fontSize = await paragraph.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSizeNum = parseInt(fontSize);
      // Font should be at least 14px for readability
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    }
  });
});
