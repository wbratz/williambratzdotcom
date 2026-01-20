import { Page, expect } from '@playwright/test';
import { THEMES, TIMEOUTS } from './constants';

/**
 * Utility functions for tests
 */

/**
 * Wait for page to be fully loaded including images and fonts
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Get the current theme from the page
 */
export async function getCurrentTheme(page: Page): Promise<string> {
  // Check the html or body class for theme
  const htmlClass = await page.locator('html').getAttribute('class');
  const bodyClass = await page.locator('body').getAttribute('class');

  if (htmlClass?.includes('dark') || bodyClass?.includes('dark')) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

/**
 * Toggle the theme and wait for transition
 */
export async function toggleTheme(page: Page) {
  // Find theme toggle button - could be various selectors
  const themeButton = page.locator('button').filter({
    hasText: /theme|dark|light/i
  }).first();

  // Fallback to icon-based toggle
  if (!(await themeButton.isVisible())) {
    const iconButton = page.locator('button svg').first();
    await iconButton.click();
  } else {
    await themeButton.click();
  }

  // Wait for theme transition
  await page.waitForTimeout(TIMEOUTS.THEME_TRANSITION);
}

/**
 * Check if element has visible images loaded
 */
export async function verifyImagesLoaded(page: Page, selector?: string) {
  const images = selector
    ? page.locator(`${selector} img`)
    : page.locator('img');

  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await expect(img).toBeVisible();

    // Check if image has naturalWidth > 0 (successfully loaded)
    const hasLoaded = await img.evaluate((el: HTMLImageElement) => {
      return el.complete && el.naturalWidth > 0;
    });

    expect(hasLoaded).toBeTruthy();
  }
}

/**
 * Check if code blocks have syntax highlighting
 */
export async function verifyCodeHighlighting(page: Page) {
  const codeBlocks = page.locator('pre code, pre[class*="language-"]');
  const count = await codeBlocks.count();

  if (count === 0) return; // No code blocks on page

  // Check first code block has highlighting classes or styled spans
  const firstBlock = codeBlocks.first();
  const hasHighlighting = await firstBlock.evaluate((el) => {
    // Check for highlight.js classes
    if (el.className && el.className.includes('hljs')) return true;

    // Check for styled spans inside
    const spans = el.querySelectorAll('span[class], span[style]');
    return spans.length > 0;
  });

  expect(hasHighlighting).toBeTruthy();
}

/**
 * Open mobile menu on mobile viewport
 */
export async function openMobileMenu(page: Page) {
  // Look for hamburger menu button
  const menuButton = page.locator('button').filter({
    hasText: /menu/i
  }).first();

  // Fallback to icon-based selector
  if (!(await menuButton.isVisible())) {
    const burgerIcon = page.locator('[class*="hamburger"], [class*="menu-icon"]').first();
    await burgerIcon.click();
  } else {
    await menuButton.click();
  }

  // Wait for menu animation
  await page.waitForTimeout(500);
}

/**
 * Check if mobile viewport
 */
export async function isMobileViewport(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
}

/**
 * Navigate and wait for page to be ready
 */
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await waitForPageReady(page);
}

/**
 * Check for console errors (excluding known acceptable errors)
 */
export function setupConsoleErrorTracking(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();

      // Filter out known acceptable errors
      const knownErrors = [
        'favicon', // Favicon errors are common and not critical
        'Download the React DevTools', // React DevTools message
      ];

      const isKnownError = knownErrors.some(known =>
        text.toLowerCase().includes(known.toLowerCase())
      );

      if (!isKnownError) {
        errors.push(text);
      }
    }
  });

  return errors;
}

/**
 * Check for hydration errors
 */
export function setupHydrationErrorTracking(page: Page): string[] {
  const hydrationErrors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('Hydration') ||
      text.includes('hydration') ||
      text.includes('did not match')
    ) {
      hydrationErrors.push(text);
    }
  });

  return hydrationErrors;
}
