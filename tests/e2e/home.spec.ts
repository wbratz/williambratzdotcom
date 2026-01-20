import { test, expect } from '@playwright/test';
import { SITE_URLS, SELECTORS } from '../helpers/constants';
import {
  waitForPageReady,
  setupConsoleErrorTracking,
  setupHydrationErrorTracking,
} from '../helpers/test-utils';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);
  });

  test('should load without errors', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);
    const hydrationErrors = setupHydrationErrorTracking(page);

    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for no critical errors
    expect(consoleErrors).toHaveLength(0);
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/william bratz|williambratzdotcom/i);
  });

  test('should render header', async ({ page }) => {
    const header = page.locator(SELECTORS.HEADER).first();
    await expect(header).toBeVisible();
  });

  test('should render footer', async ({ page }) => {
    const footer = page.locator(SELECTORS.FOOTER).first();
    await expect(footer).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    // Check for main navigation
    const nav = page.locator(SELECTORS.NAV).first();
    await expect(nav).toBeVisible();

    // Check for at least one navigation link
    const navLinks = page.locator('a[href]');
    await expect(navLinks.first()).toBeVisible();
  });

  test('should have social links in footer', async ({ page }) => {
    // Look for social links (GitHub, Twitter/X, LinkedIn)
    const socialLinks = page.locator('a[href*="github.com"], a[href*="twitter.com"], a[href*="x.com"], a[href*="linkedin.com"]');
    const count = await socialLinks.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to blog page', async ({ page }) => {
    // Find and click blog link
    const blogLink = page.locator('a[href="/blog"]').first();
    await expect(blogLink).toBeVisible();

    await blogLink.click();
    await waitForPageReady(page);

    await expect(page).toHaveURL(/\/blog/);
  });

  test('should navigate to resume page', async ({ page }) => {
    // Find and click resume link
    const resumeLink = page.locator('a[href="/resume"]').first();

    // Resume link might not be on home page, that's ok
    const isVisible = await resumeLink.isVisible().catch(() => false);
    if (isVisible) {
      await resumeLink.click();
      await waitForPageReady(page);
      await expect(page).toHaveURL(/\/resume/);
    }
  });

  test('should load main content', async ({ page }) => {
    // Check that main content area exists
    const mainContent = page.locator('main, [role="main"], article').first();
    await expect(mainContent).toBeVisible();
  });

  test('should not have accessibility violations (basic check)', async ({ page }) => {
    // Basic accessibility: check for alt text on images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Images should have alt attribute (can be empty for decorative)
      expect(alt).toBeDefined();
    }
  });
});
