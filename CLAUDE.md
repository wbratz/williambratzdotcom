# CLAUDE.md - AI Assistant Guide for williambratzdotcom

This document provides comprehensive guidance for AI assistants working with the williambratzdotcom codebase. It covers architecture, conventions, workflows, and important patterns to follow when making changes.

## Project Overview

**williambratzdotcom** is a personal portfolio and blog website built with Next.js and React. It's deployed on Heroku and features:
- Blog posts written in Markdown with frontmatter
- Dark/light theme support
- Responsive design with mobile navigation
- Google Analytics integration
- Resume page
- Mermaid diagram rendering capabilities

## Technology Stack

### Core Framework
- **Next.js 12.3.4** (Pages Router, not App Router)
- **React 17.0.2** (not React 18)
- **TypeScript 5.0.4** (strict mode disabled)
- **Node 22.x** (required: `>=22.0.0 <23.0.0`)

### Styling
- **CSS Modules** for component-scoped styles (`.module.css` files)
- **CSS Custom Properties** for theming (light/dark mode)
- **next-themes** for theme management
- **Global CSS** at `styles/globals.css`
- **Responsive design** with extensive media queries

### Markdown & Content
- **gray-matter** - Frontmatter parsing
- **remark** ecosystem - Markdown processing
  - `remark-parse` - Markdown parsing
  - `remark-html` - HTML conversion
  - `remark-highlight.js` - Syntax highlighting
  - `remark-grid-tables` - Table support
- **unified** - Plugin orchestration

### Additional Libraries
- **FontAwesome** - Icon library
- **Mermaid 10.1.0** - Diagram rendering
- **react-ga** - Google Analytics tracking
- **Prettier 2.3.2** - Code formatting (no config file present)

## Directory Structure

```
/home/user/williambratzdotcom/
├── contents/              # Blog post markdown files
├── mermaid/              # Mermaid diagram build output
├── pages/                # Next.js pages (Pages Router)
│   ├── api/             # API routes
│   ├── auth/            # Auth-related demo pages
│   ├── blog/            # Blog pages
│   │   └── [slug].js   # Dynamic blog post page
│   ├── _app.tsx         # App wrapper with ThemeProvider and GA
│   ├── _document.tsx    # Custom document with fonts and analytics
│   ├── index.tsx        # Home page
│   ├── blog.tsx         # Blog listing page
│   └── resume.tsx       # Resume page
├── public/              # Static assets
│   ├── blogContent/     # Blog post assets (organized by slug)
│   ├── mermaid/         # Mermaid library bundles
│   └── *.ico, *.jpg     # Favicon, header photo
├── src/
│   ├── components/      # React components
│   │   ├── svgs/       # SVG icon definitions
│   │   ├── header.tsx
│   │   ├── Layout.tsx
│   │   └── Mermaid.tsx
│   └── global.d.ts     # Global type definitions
├── styles/              # CSS Modules and global styles
│   ├── globals.css
│   ├── Home.module.css
│   ├── Resume.module.css
│   ├── blog.module.css
│   └── *.module.css
├── typings/             # TypeScript type definitions
│   └── mermaid.d.ts
└── utils/               # Utility functions
    └── gtag.tsx        # Google Analytics helpers
```

## Key Files and Their Purposes

### Configuration Files

**package.json** - Dependencies and scripts
- Node version constraint: `>=22.0.0 <23.0.0`
- Scripts: `dev`, `build`, `start`, `build:mermaid`
- No test scripts configured

**tsconfig.json** - TypeScript configuration
- Target: ES5
- **Strict mode: disabled** (`strict: false`)
- JSX: preserve (Next.js handles transformation)
- Module: esnext with node resolution

**webpack.config.js** - Bundles Mermaid library for client-side use

**rollup.config.mjs** - Alternative bundler for Mermaid

### Entry Points

**pages/_app.tsx**
- Wraps all pages with `ThemeProvider` from `next-themes`
- Initializes Google Analytics with route tracking
- Imports global CSS and FontAwesome styles
- Contains `@ts-ignore` for React version mismatch

**pages/_document.tsx**
- Loads Google Fonts: Inconsolata and Open Sans
- Injects Google Analytics gtag.js script
- GA tracking ID: `UA-184834329-1`

**src/components/Layout.tsx**
- Main layout wrapper used by all pages
- Contains header, side navigation, footer
- Manages mobile navigation state
- Initializes Google Analytics (duplicate initialization)
- Footer includes social links (GitHub, Twitter/X, LinkedIn)
- Buy Me a Coffee widget script

## Blog Post System

### Markdown File Structure

Blog posts are stored in `/contents/*.md` with the following frontmatter format:

```markdown
---
title: Post Title
slug: url-slug
date: MM/DD/YYYY
description: Brief description for listing page
photo: "./blogContent/slug/thumbnail.jpg"
banner: "../blogContent/slug/banner.jpg"
---

# Post content here...
```

### Static Site Generation

**Blog Listing** (`pages/blog.tsx`):
- Uses `getStaticProps()` to read all `.md` files from `/contents`
- Parses frontmatter with gray-matter
- Sorts by date (newest first)
- Generates UUID for each post
- Passes frontmatter data as props

**Individual Posts** (`pages/blog/[slug].js`):
- Uses `getStaticPaths()` to generate routes from filenames
- Uses `getStaticProps(context)` to read specific markdown file
- Processes markdown with unified/remark pipeline
- Renders HTML with `dangerouslySetInnerHTML`

### Asset Organization

- Blog images stored in `/public/blogContent/{slug}/`
- Each post has its own subdirectory
- Assets include: banners, thumbnails, inline images
- Images referenced in markdown using relative paths

## Code Conventions and Patterns

### File Naming
- **Pages**: lowercase or camelCase (`blog.tsx`, `resume.tsx`)
- **Components**: PascalCase (`Layout.tsx`, `Mermaid.tsx`)
- **Styles**: matched to component/page name with `.module.css` extension

### Component Patterns
- **Layout Wrapper**: All pages wrapped with `<Layout>` component
- **Props**: Often untyped (loose TypeScript configuration)
- **State Management**: Local state with `useState` (no global state library)
- **Import Style**: ES6 imports throughout
- **Link Component**: Uses `legacyBehavior` prop for Next.js Link

### Styling Conventions

**Theme Variables** (defined in `styles/globals.css`):
```css
--bg-color
--text-color
--nav-bg
--nav-text
--sidenav-bg
```

**Dark Mode**: `.dark` class toggles theme (managed by next-themes)

**Typography**:
- Open Sans for body text
- Inconsolata for monospace/navigation

**Responsive Breakpoints**: 400px, 450px, 600px, 700px, 768px, 1024px, 1630px

### TypeScript Usage
- TypeScript is used but **strict mode is disabled**
- Many components have untyped props
- Type definitions in `typings/` and `src/global.d.ts`
- `@ts-ignore` comments present in some files

### Google Analytics
- Initialized in **two places** (_app.tsx and Layout.tsx)
- Tracking ID: `UA-184834329-1`
- Custom event tracking for user interactions
- Router events tracked for page views

## Development Workflows

### Starting Development

```bash
npm install           # Install dependencies
npm run dev          # Start development server (localhost:3000)
```

### Building for Production

```bash
npm run build        # Next.js production build
npm run build:mermaid # Build Mermaid library bundle (if needed)
npm start            # Start production server (uses $PORT env var)
```

### Deployment
- **Platform**: Heroku
- **Port**: Dynamic via `$PORT` environment variable
- Production server: `npm start -p $PORT`

## Common Tasks

### Adding a New Blog Post

1. Create a new `.md` file in `/contents/`
2. Add frontmatter with title, slug, date, description, photo, banner
3. Create asset directory in `/public/blogContent/{slug}/`
4. Add images to the asset directory
5. Write content in markdown
6. Blog will automatically appear on listing page (sorted by date)

### Adding a New Page

1. Create file in `/pages/` directory
2. Import and use `<Layout>` component
3. Create corresponding CSS module in `/styles/` if needed
4. Add navigation link in `src/components/Layout.tsx` if needed

### Modifying Styles

- Edit relevant `.module.css` file for component-scoped styles
- Edit `styles/globals.css` for global styles or theme variables
- Ensure both light and dark themes are styled appropriately

### Adding a New Component

1. Create component in `/src/components/`
2. Use PascalCase naming
3. Create corresponding CSS module if needed
4. Import and use in pages

## Important Patterns and Considerations

### Security Notes
- `.env*` files properly gitignored
- No secrets visible in codebase
- Google Analytics tracking ID hardcoded (acceptable for public GA property)

### Performance Notes
- Static site generation for all blog content
- Images in `/public/` served statically
- No image optimization currently implemented
- Multiple GA initializations (could be optimized)

### Technical Debt
- React 17 (not latest)
- Next.js 12 (not using App Router or latest features)
- TypeScript strict mode disabled
- No testing infrastructure
- No linting/formatting enforcement (Prettier installed but no config)
- Multiple Google Analytics initializations
- Legacy Next.js Link behavior (`legacyBehavior`)
- `dangerouslySetInnerHTML` for blog content rendering

### Special Features
1. **Mermaid Diagrams**: Custom component loads from CDN, demo at `/auth/diagrams`
2. **Dark Mode Toggle**: Theme switcher in header with FontAwesome icons
3. **Mobile Menu**: Animated burger menu for responsive navigation
4. **Resume Page**: Full resume content in JSX with link to PDF
5. **Custom SVG Icons**: Handcrafted icon library in `/src/components/svgs/icons.tsx`

## What to Watch Out For

### When Making Changes

1. **TypeScript Strictness**: With strict mode disabled, be extra careful about type safety
2. **Legacy Next.js**: This uses Pages Router, not App Router. Don't suggest App Router patterns
3. **React Version**: React 17, not 18. Don't use React 18-specific features
4. **CSS Modules**: Always import styles as modules, not global imports
5. **Theme Support**: Test changes in both light and dark themes
6. **Mobile Responsiveness**: Always consider mobile layout
7. **Blog Asset Paths**: Use correct relative paths in blog post frontmatter
8. **Google Analytics**: Be aware of duplicate initialization

### When Suggesting Improvements

1. **Keep it Simple**: This is a personal site; avoid over-engineering
2. **Maintain Existing Patterns**: Follow the established conventions
3. **Consider Migration Path**: Suggest incremental improvements, not rewrites
4. **Respect Constraints**: Node 22 requirement, Heroku deployment
5. **No Tests**: There's no testing infrastructure; be especially careful with changes

## Testing and Quality Assurance

**Current State**: No testing framework configured
- No test files present
- No test runner (Jest, Vitest, etc.)
- No coverage tools
- Manual testing required for all changes

**Linting/Formatting**:
- Prettier 2.3.2 installed but no config file
- No ESLint configuration
- No Git hooks (Husky, lint-staged)
- No pre-commit checks

## Environment Variables

**Required for Production**:
- `PORT` - Server port (provided by Heroku)

**Hardcoded Values**:
- Google Analytics ID: `UA-184834329-1` (in _document.tsx and Layout.tsx)

## Git Workflow

- `.gitignore` includes standard Next.js patterns
- Ignores: `.next/`, `node_modules/`, `.env*`, `yarn.lock`
- No special branch strategy documented
- No CI/CD configuration present

## Summary

This is a straightforward Next.js personal portfolio/blog site with a solid but minimal setup. The focus is on content delivery rather than complex tooling. When making changes:

1. Follow existing patterns and conventions
2. Test in both light and dark themes
3. Verify mobile responsiveness
4. Be careful with type safety (strict mode is off)
5. Don't over-engineer solutions
6. Keep the blog post system simple and maintainable
7. Respect the legacy Next.js and React versions

The codebase prioritizes simplicity and maintainability for a single-developer project. Suggested changes should maintain this philosophy while improving functionality or user experience.
