import { test, expect } from '@playwright/test';
import { SITE_URLS } from '../helpers/constants';
import {
  waitForPageReady,
  setupHydrationErrorTracking,
} from '../helpers/test-utils';

test.describe('Production Build Validation', () => {
  test('should have no hydration errors on home page', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorTracking(page);

    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should have no hydration errors on blog listing', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorTracking(page);

    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should have no hydration errors on resume', async ({ page }) => {
    const hydrationErrors = setupHydrationErrorTracking(page);

    await page.goto(SITE_URLS.RESUME);
    await waitForPageReady(page);

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should serve static assets correctly', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for CSS
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).length;
    });

    expect(stylesheets).toBeGreaterThan(0);
  });

  test('should load JavaScript correctly', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check that React is loaded
    const hasReact = await page.evaluate(() => {
      return typeof (window as any).React !== 'undefined' ||
             document.querySelectorAll('[data-reactroot], #__next').length > 0;
    });

    expect(hasReact).toBeTruthy();
  });

  test('should have Next.js app wrapper', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for Next.js app wrapper
    const nextRoot = page.locator('#__next');
    await expect(nextRoot).toBeVisible();
  });

  test('should handle 404 pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    await waitForPageReady(page);

    // Should get 404 status
    expect(response?.status()).toBe(404);

    // Should show 404 page content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should serve fonts correctly', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for custom fonts
    const fonts = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      return computedStyle.fontFamily;
    });

    expect(fonts).toBeTruthy();
    expect(fonts.length).toBeGreaterThan(0);
  });

  test('should have meta tags', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for basic meta tags
    const viewport = await page.locator('meta[name="viewport"]').count();
    expect(viewport).toBeGreaterThan(0);
  });

  test('should load favicon', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    const favicon = page.locator('link[rel*="icon"]');
    const count = await favicon.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have proper document structure', async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    // Check for html, head, body
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();

    const headCount = await page.locator('head').count();
    expect(headCount).toBe(1);
  });

  test('all pages should be accessible', async ({ page }) => {
    const pages = [
      SITE_URLS.HOME,
      SITE_URLS.BLOG,
      SITE_URLS.RESUME,
    ];

    for (const url of pages) {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await waitForPageReady(page);
    }
  });

  test('should not have console errors on initial load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter known acceptable errors
        if (!text.includes('favicon') && !text.includes('DevTools')) {
          errors.push(text);
        }
      }
    });

    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    expect(errors).toHaveLength(0);
  });

  test('should handle page navigation without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate through pages
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);

    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);

    await page.goto(SITE_URLS.RESUME);
    await waitForPageReady(page);

    // Filter known errors
    const criticalErrors = errors.filter(
      e => !e.includes('favicon') && !e.includes('DevTools')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
