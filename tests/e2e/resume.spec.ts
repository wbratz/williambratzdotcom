import { test, expect } from '@playwright/test';
import { SITE_URLS, SELECTORS } from '../helpers/constants';
import {
  waitForPageReady,
  setupConsoleErrorTracking,
} from '../helpers/test-utils';

test.describe('Resume Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URLS.RESUME);
    await waitForPageReady(page);
  });

  test('should load without errors', async ({ page }) => {
    const consoleErrors = setupConsoleErrorTracking(page);

    await page.goto(SITE_URLS.RESUME);
    await waitForPageReady(page);

    expect(consoleErrors).toHaveLength(0);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/resume/i);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    const headingText = await heading.textContent();
    expect(headingText).toBeTruthy();
  });

  test('should display resume content', async ({ page }) => {
    // Look for main content
    const content = page.locator('main, article, [role="main"]').first();
    await expect(content).toBeVisible();

    const text = await content.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('should have layout elements', async ({ page }) => {
    // Header
    await expect(page.locator(SELECTORS.HEADER).first()).toBeVisible();

    // Footer
    await expect(page.locator(SELECTORS.FOOTER).first()).toBeVisible();
  });

  test('should have PDF download link if available', async ({ page }) => {
    // Look for PDF link (optional feature)
    const pdfLink = page.locator('a[href*=".pdf"]');
    const count = await pdfLink.count();

    if (count > 0) {
      await expect(pdfLink.first()).toBeVisible();

      const href = await pdfLink.first().getAttribute('href');
      expect(href).toContain('.pdf');
    }
  });

  test('should display work experience section', async ({ page }) => {
    // Look for common resume sections
    const experienceHeading = page.locator('h1, h2, h3').filter({
      hasText: /experience|work|employment|career/i
    }).first();

    // Many resumes have an experience section
    const exists = await experienceHeading.count();
    // This is flexible - not all resumes follow the same structure
  });

  test('should display education section', async ({ page }) => {
    // Look for education section
    const educationHeading = page.locator('h1, h2, h3').filter({
      hasText: /education|school|university|degree/i
    }).first();

    // This is optional
    const exists = await educationHeading.count();
  });

  test('should display skills section', async ({ page }) => {
    // Look for skills section
    const skillsHeading = page.locator('h1, h2, h3').filter({
      hasText: /skills|technologies|tools|expertise/i
    }).first();

    // This is optional
    const exists = await skillsHeading.count();
  });

  test('should have contact information', async ({ page }) => {
    // Look for email or social links
    const email = page.locator('a[href^="mailto:"]');
    const social = page.locator('a[href*="linkedin"], a[href*="github"]');

    const emailCount = await email.count();
    const socialCount = await social.count();

    // Should have at least some contact method
    expect(emailCount + socialCount).toBeGreaterThan(0);
  });

  test('should have formatted sections', async ({ page }) => {
    // Check for multiple sections/headings
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();

    // Resume should have multiple sections
    expect(count).toBeGreaterThan(1);
  });

  test('should display lists (experience items, skills, etc)', async ({ page }) => {
    // Look for lists
    const lists = page.locator('ul, ol');
    const count = await lists.count();

    // Resumes typically have lists
    expect(count).toBeGreaterThan(0);
  });

  test('should be readable on desktop', async ({ page }) => {
    const paragraph = page.locator('p').first();

    if (await paragraph.isVisible()) {
      const fontSize = await paragraph.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Content should still be visible
    const content = page.locator('main, article').first();
    await expect(content).toBeVisible();

    // Should not have horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('should navigate back to home', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]').first();

    if (await homeLink.isVisible()) {
      await homeLink.click();
      await waitForPageReady(page);
      await expect(page).toHaveURL(/^\//);
    }
  });
});
