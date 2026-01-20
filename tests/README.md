# Test Suite Documentation

This directory contains automated end-to-end tests for the williambratzdotcom website using Playwright.

## Purpose

These tests were created to support the dependency upgrade process. They validate that core functionality remains intact after upgrading from Next.js 12 to Next.js 15, React 17 to React 18, and other major dependency updates.

## Test Coverage

### Core Test Suites

1. **home.spec.ts** - Home page functionality
   - Page loads without errors
   - Layout elements render (header, footer, navigation)
   - Links are functional
   - No hydration errors
   - Basic accessibility checks

2. **blog-listing.spec.ts** - Blog listing page
   - All blog posts display
   - Post metadata shows (title, description, thumbnail)
   - "Read More" links work
   - Navigation to individual posts

3. **blog-post.spec.ts** - Individual blog post pages
   - Post content renders correctly
   - Images load
   - Code syntax highlighting works
   - Markdown formatting preserved
   - Navigation functional

4. **theme.spec.ts** - Dark/Light theme toggling
   - Theme toggle button works
   - Theme persists across navigation
   - Theme persists after reload
   - Theme saves to localStorage
   - Visual styles update correctly

5. **navigation.spec.ts** - Navigation functionality
   - Desktop navigation works
   - Mobile navigation works
   - Hamburger menu functions on mobile
   - Responsive behavior
   - Navigation across all pages

6. **resume.spec.ts** - Resume page
   - Page loads and renders
   - Content displays
   - PDF download link (if available)
   - Responsive on mobile

7. **build.spec.ts** - Production build validation
   - No hydration errors
   - Static assets load correctly
   - JavaScript executes properly
   - 404 page handling
   - No console errors

## Running Tests

### Prerequisites

```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npm run test:install
# Or manually:
npx playwright install chromium
```

### Test Commands

```bash
# Run all tests (headless, default)
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with Playwright UI (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View last test report
npm run test:report

# Run specific test file
npx playwright test tests/e2e/home.spec.ts

# Run tests matching a pattern
npx playwright test --grep "theme"

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

## Configuration

See `playwright.config.ts` in the project root for configuration:

- **Base URL**: `http://localhost:3000` (dev server)
- **Browsers**: Chromium (desktop), Mobile Chrome
- **Retries**: 2 retries on CI, 0 locally
- **Dev Server**: Automatically starts `npm run dev` before tests
- **Artifacts**: Screenshots and videos on failure

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { SITE_URLS } from '../helpers/constants';
import { waitForPageReady } from '../helpers/test-utils';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URLS.HOME);
    await waitForPageReady(page);
  });

  test('should do something', async ({ page }) => {
    // Test code here
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Helper Functions

Located in `tests/helpers/`:

- **constants.ts** - URLs, selectors, timeouts, viewport sizes
- **test-utils.ts** - Utility functions:
  - `waitForPageReady(page)` - Wait for full page load
  - `getCurrentTheme(page)` - Get current theme
  - `toggleTheme(page)` - Toggle dark/light theme
  - `verifyImagesLoaded(page)` - Check images loaded
  - `verifyCodeHighlighting(page)` - Check syntax highlighting
  - `openMobileMenu(page)` - Open mobile navigation
  - `setupConsoleErrorTracking(page)` - Track console errors
  - `setupHydrationErrorTracking(page)` - Track hydration errors

### Best Practices

1. **Use helper functions** - Don't duplicate selectors and logic
2. **Wait for page ready** - Always use `waitForPageReady()` after navigation
3. **Flexible selectors** - Use semantic selectors that work across themes
4. **Error tracking** - Use error tracking helpers to catch issues
5. **Mobile testing** - Test responsive behavior where relevant
6. **Descriptive tests** - Test names should clearly describe what they verify
7. **Independent tests** - Each test should be able to run independently

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run Playwright tests
  run: npm test

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Philosophy

### What We Test

- ✅ Core user-facing functionality
- ✅ Navigation and routing
- ✅ Content rendering (blog posts, pages)
- ✅ Interactive features (theme toggle, mobile menu)
- ✅ Responsive behavior
- ✅ Build artifacts and static generation
- ✅ No hydration errors
- ✅ No critical console errors

### What We Don't Test

- ❌ Internal implementation details
- ❌ Styling specifics (pixel-perfect)
- ❌ Third-party integrations (Google Analytics)
- ❌ Performance metrics (separate tools)
- ❌ Security vulnerabilities (separate tools)

## Upgrade Workflow

When upgrading dependencies:

1. **Before upgrade**: Run tests to establish baseline
   ```bash
   npm test
   ```

2. **After each phase**: Run tests to verify nothing broke
   ```bash
   npm test
   ```

3. **If tests fail**:
   - Review failure output
   - Determine if it's a regression or expected change
   - Fix regression OR update test for intentional change

4. **Update tests**: If behavior intentionally changed, update tests

5. **Commit**: Once all tests pass, commit with confidence

## Debugging Failed Tests

```bash
# Run in headed mode to see what's happening
npm run test:headed

# Use debug mode to step through
npm run test:debug

# Run specific failing test
npx playwright test tests/e2e/home.spec.ts --debug

# View trace for failed test
npx playwright show-trace test-results/.../trace.zip
```

## Common Issues

### Dev Server Won't Start
- Check port 3000 is available
- Ensure `npm install` completed successfully
- Check for build errors: `npm run build`

### Browser Not Installed
```bash
npm run test:install
```

### Tests Timing Out
- Increase timeout in test: `test.setTimeout(60000)`
- Check network connectivity
- Verify dev server is running

### Flaky Tests
- Add explicit waits: `await page.waitForTimeout(500)`
- Use `waitForPageReady()` helper
- Check for race conditions

## Maintenance

- **Update selectors** if UI changes
- **Add tests** for new features
- **Remove tests** for removed features
- **Update helpers** for common patterns
- **Review failures** on each CI run

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Created**: 2026-01-20
**Purpose**: Support dependency upgrade from Next.js 12 to 15+
**Maintainer**: Project owner
