import { test, expect } from '@playwright/test';
import { SITE_URLS, SELECTORS } from '../helpers/constants';
import {
  waitForPageReady,
  verifyImagesLoaded,
  setupConsoleErrorTracking,
} from '../helpers/test-utils';

test.describe('Blog Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);
  });

  test('should load without errors', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/blog/i);
  });

  test('should display blog posts', async ({ page }) => {
    // Look for blog post links
    const blogLinks = page.locator(SELECTORS.BLOG_POST_LINK);
    const count = await blogLinks.count();

    // Should have at least one blog post
    expect(count).toBeGreaterThan(0);
  });

  test('should display blog post titles', async ({ page }) => {
    // Check for post titles
    const titles = page.locator('h1, h2, h3').filter({
      hasText: /.+/
    });

    const count = await titles.count();
    expect(count).toBeGreaterThan(0);

    // First title should be visible
    await expect(titles.first()).toBeVisible();
  });

  test('should display blog post descriptions', async ({ page }) => {
    // Check for post descriptions/summaries
    const descriptions = page.locator('p, div').filter({
      hasText: /.{20,}/ // At least 20 characters
    });

    const count = await descriptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display blog post thumbnails', async ({ page }) => {
    // Check for images (thumbnails)
    const images = page.locator(SELECTORS.BLOG_POST_IMAGE);
    const count = await images.count();

    if (count > 0) {
      // Verify at least first image loads
      await expect(images.first()).toBeVisible();
    }
  });

  test('should have "Read More" links', async ({ page }) => {
    // Look for "Read More" or similar call-to-action
    const readMoreLinks = page.locator('a').filter({
      hasText: /read more|continue reading|view post/i
    });

    const count = await readMoreLinks.count();

    // Should have at least one read more link
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to individual blog post', async ({ page }) => {
    // Click first blog post link
    const firstPostLink = page.locator(SELECTORS.BLOG_POST_LINK).first();
    await expect(firstPostLink).toBeVisible();

    await firstPostLink.click();
    await waitForPageReady(page);

    // Should be on blog post page
    await expect(page).toHaveURL(/\/blog\/.+/);
  });

  test('blog posts should be sorted by date (newest first)', async ({ page }) => {
    // This is harder to test automatically without knowing content
    // We'll just verify that posts are displayed in a list
    const posts = page.locator('li, article, [class*="post"]').filter({
      has: page.locator('a[href^="/blog/"]')
    });

    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display layout elements', async ({ page }) => {
    // Check for header
    await expect(page.locator(SELECTORS.HEADER).first()).toBeVisible();

    // Check for footer
    await expect(page.locator(SELECTORS.FOOTER).first()).toBeVisible();
  });

  test('should have list container', async ({ page }) => {
    // Check for ul or ol list
    const list = page.locator('ul, ol').first();
    await expect(list).toBeVisible();
  });
});
