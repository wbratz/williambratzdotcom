/**
 * Test constants and configuration values
 */

export const SITE_URLS = {
  HOME: '/',
  BLOG: '/blog',
  RESUME: '/resume',
} as const;

export const SELECTORS = {
  // Layout
  HEADER: 'header',
  FOOTER: 'footer',
  NAV: 'nav',

  // Theme toggle
  THEME_TOGGLE: '[aria-label*="theme" i], [title*="theme" i], button[class*="theme" i]',

  // Mobile menu
  MOBILE_MENU_BUTTON: 'button[aria-label*="menu" i], button[class*="hamburger" i], button[class*="mobile" i]',
  MOBILE_NAV: 'nav[class*="mobile" i], [class*="sidenav" i]',

  // Blog elements
  BLOG_POST_LINK: 'a[href^="/blog/"]',
  BLOG_POST_TITLE: 'h1, h2',
  BLOG_POST_IMAGE: 'img',
  CODE_BLOCK: 'pre code, pre[class*="language-"], code[class*="language-"]',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const TIMEOUTS = {
  NAVIGATION: 30000,
  THEME_TRANSITION: 1000,
  IMAGE_LOAD: 5000,
} as const;

export const VIEWPORT_SIZES = {
  DESKTOP: { width: 1920, height: 1080 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 },
} as const;
