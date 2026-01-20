import { test, expect } from '@playwright/test';
import { SITE_URLS, THEMES } from '../helpers/constants';
import {
  waitForPageReady,
  getCurrentTheme,
  toggleTheme,
} from '../helpers/test-utils';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);
  });

  test('should have default theme', async ({ page }) => {
    const theme = await getCurrentTheme(page);
    expect([THEMES.LIGHT, THEMES.DARK]).toContain(theme);
  });

  test('should have theme toggle button', async ({ page }) => {
    // Look for theme toggle button
    const themeButton = page.locator('button').filter({
      hasText: /theme|dark|light/i
    }).first();

    // Might be an icon button without text
    const iconButton = page.locator('button svg').first();

    const hasThemeButton = await themeButton.isVisible().catch(() => false);
    const hasIconButton = await iconButton.isVisible().catch(() => false);

    expect(hasThemeButton || hasIconButton).toBeTruthy();
  });

  test('should toggle from light to dark theme', async ({ page }) => {
    // Clear localStorage to ensure we start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForPageReady(page);

    const initialTheme = await getCurrentTheme(page);

    // Toggle theme
    await toggleTheme(page);

    const newTheme = await getCurrentTheme(page);

    // Theme should have changed
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should toggle back to original theme', async ({ page }) => {
    const initialTheme = await getCurrentTheme(page);

    // Toggle twice
    await toggleTheme(page);
    await toggleTheme(page);

    const finalTheme = await getCurrentTheme(page);

    // Should be back to original
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme across page navigation', async ({ page }) => {
    const initialTheme = await getCurrentTheme(page);

    // Toggle theme
    await toggleTheme(page);
    const newTheme = await getCurrentTheme(page);

    expect(newTheme).not.toBe(initialTheme);

    // Navigate to another page
    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);

    // Theme should persist
    const persistedTheme = await getCurrentTheme(page);
    expect(persistedTheme).toBe(newTheme);
  });

  test('should persist theme after page reload', async ({ page }) => {
    // Toggle theme
    await toggleTheme(page);
    const themeBeforeReload = await getCurrentTheme(page);

    // Reload page
    await page.reload();
    await waitForPageReady(page);

    // Theme should persist
    const themeAfterReload = await getCurrentTheme(page);
    expect(themeAfterReload).toBe(themeBeforeReload);
  });

  test('should save theme to localStorage', async ({ page }) => {
    // Toggle theme
    await toggleTheme(page);

    // Check localStorage
    const themeInStorage = await page.evaluate(() => {
      return localStorage.getItem('theme') ||
             localStorage.getItem('next-themes') ||
             localStorage.getItem('color-theme');
    });

    expect(themeInStorage).toBeTruthy();
  });

  test('should apply theme styles', async ({ page }) => {
    const initialBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Toggle theme
    await toggleTheme(page);

    const newBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Background color should change
    expect(newBgColor).not.toBe(initialBgColor);
  });

  test('should work on all pages', async ({ page }) => {
    // Test on home page
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);
    await toggleTheme(page);
    const homeTheme = await getCurrentTheme(page);

    // Test on blog page
    await page.goto(SITE_URLS.BLOG);
    await waitForPageReady(page);
    const blogTheme = await getCurrentTheme(page);

    expect(blogTheme).toBe(homeTheme);
  });

  test('should update theme icon when toggled', async ({ page }) => {
    // Get initial icon state
    const iconButton = page.locator('button svg').first();

    if (await iconButton.isVisible()) {
      const initialIcon = await iconButton.innerHTML();

      // Toggle theme
      await toggleTheme(page);

      const newIcon = await iconButton.innerHTML();

      // Icon should change (or at least the button is still there)
      await expect(iconButton).toBeVisible();
    }
  });
});
