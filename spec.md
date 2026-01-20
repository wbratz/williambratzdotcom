# Dependency Upgrade Specification
## williambratzdotcom - Comprehensive Upgrade Plan

**Date:** 2026-01-20
**Current State:** Next.js 12.3.4, React 17, Node 22
**Target State:** Latest stable versions with maintained functionality

---

## Executive Summary

This specification outlines a phased approach to upgrade all dependencies in the williambratzdotcom project from significantly outdated versions to current, maintained versions. The project currently uses Next.js 12.3.4 (released 2022) with React 17, while the ecosystem has progressed to Next.js 15+ and React 18+/19.

**Key Challenges:**
- 3+ major version jump for Next.js (12 → 15)
- React 17 → 18 migration with breaking changes
- Unified/remark ecosystem major version changes (v9/v13 → v15)
- Obsolete and deprecated packages
- TypeScript type definition mismatches
- No testing infrastructure to validate changes

**Risk Level:** HIGH - Multiple interconnected breaking changes without test coverage

---

## Current Dependency Analysis

### Critical Issues

| Package | Current | Latest | Status | Severity |
|---------|---------|--------|--------|----------|
| next | 12.3.4 | 15.1.3 | Severely outdated | CRITICAL |
| react | 17.0.2 | 18.3.1 | Major version behind | CRITICAL |
| react-dom | 17.0.2 | 18.3.1 | Major version behind | CRITICAL |
| @types/react | 16.14.11 | 18.3.18 | Mismatched | HIGH |
| @types/node | 14.17.5 | 22.10.5 | Severely outdated | HIGH |
| unified | 9.2.1 | 11.0.5 | Major versions behind | HIGH |
| remark-parse | 9.0.0 | 11.0.0 | Major versions behind | HIGH |
| remark-html | 13.0.2 | 16.0.1 | Major versions behind | MEDIUM |
| typescript | 5.0.4 | 5.7.3 | Minor updates | LOW |

### Package Categories

#### 1. Core Framework (Critical Path)
```json
"next": "^12.3.4"              → "^15.1.3"
"react": "^17.0.2"             → "^18.3.1"
"react-dom": "^17.0.2"         → "^18.3.1"
```

#### 2. Type Definitions (Must Match Runtime)
```json
"@types/react": "^16.14.11"    → "^18.3.18"
"@types/node": "^14.17.5"      → "^22.10.5"
"@types/gtag.js": "0.0.3"      → "^0.0.20"
```

#### 3. Markdown Processing (Ecosystem Upgrade)
```json
"unified": "^9.2.1"            → "^11.0.5"
"remark": "^14.0.2"            → "^15.0.1"
"remark-parse": "^9.0.0"       → "^11.0.0"
"remark-html": "^13.0.2"       → "^16.0.1"
"remark-highlight.js": "^6.0.0" → "^7.0.1"
"remark-images": "^2.0.0"      → OBSOLETE (remove)
"remark-grid-tables": "^2.1.2" → "^3.0.0"
"rehype-highlight": "^6.0.0"   → "^7.0.1"
"gray-matter": "^4.0.3"        → "^4.0.3" (current)
```

#### 4. UI Libraries
```json
"@fortawesome/fontawesome-svg-core": "^6.3.0"     → "^6.7.2"
"@fortawesome/free-solid-svg-icons": "^6.3.0"    → "^6.7.2"
"@fortawesome/react-fontawesome": "^0.2.0"       → "^0.2.2"
"next-themes": "^0.4.6"                          → "^0.4.6" (current)
```

#### 5. Analytics & Utilities
```json
"react-ga": "^3.3.0"           → "^3.3.1" OR migrate to GA4
"uuid": "^8.3.2"               → "^11.0.5"
```

#### 6. Markdown Alternatives (Currently Unused)
```json
"@toast-ui/react-editor": "^3.2.3"      → REMOVE (unused)
"markdown-it": "^13.0.1"                → REMOVE (unused)
"react-markdown": "^7.0.1"              → REMOVE (unused)
"react-syntax-highlighter": "^15.5.0"   → REMOVE (unused)
```

#### 7. Build Tools
```json
"webpack": "^5.80.0"                    → "^5.97.1"
"webpack-cli": "^5.0.2"                 → "^6.0.1"
"babel-loader": "^9.1.2"                → "^9.2.1"
"rollup": "^3.21.0"                     → "^4.30.1"
"@rollup/plugin-commonjs": "^24.1.0"    → "^28.0.2"
"@rollup/plugin-node-resolve": "^15.0.2" → "^15.3.1"
```

#### 8. Code Quality
```json
"prettier": "^2.3.2"           → "^3.4.2"
```

#### 9. Special Handling Required
```json
"mermaid": "^10.1.0"           → "^11.5.0" (used via CDN and npm)
```

---

## Breaking Changes & Migration Concerns

### 1. Next.js 12 → 15

**Major Breaking Changes:**

#### Next.js 13 Breaking Changes
- **`<Link>` behavior changed**: No longer requires `<a>` child (legacyBehavior currently used)
- **`next/image` API changes**: `layout` prop removed, new props added
- **Removed `target` from `<Link>`**: Must use custom implementation
- **SWC minifier now default**: Terser removed
- **Edge Runtime changes**: New constraints for API routes

#### Next.js 14 Breaking Changes
- **Minimum Node.js version**: 18.17+ (we're on 22, so OK)
- **`ImageResponse` imports**: Moved from `next/server` to `next/og`
- **`next/font` changes**: Google Fonts API updates

#### Next.js 15 Breaking Changes (Latest)
- **React 19 support added**: We'll use React 18 for stability
- **`fetch` caching behavior**: Now uncached by default
- **Async Request APIs**: `headers()`, `cookies()` now async
- **Route Handler changes**: New caching semantics
- **Image optimization**: Changes to image loader API

**Required Code Changes:**
- Remove `legacyBehavior` from all `<Link>` components
- Update `<Link>` to not wrap `<a>` tags
- Review and test all image loading
- Audit API routes for compatibility
- Test build process with SWC

**Files Affected:**
- `pages/blog.tsx` (line 24: legacyBehavior usage)
- Any other files with `<Link>` components
- `next.config.js` (may need creation/updates)

### 2. React 17 → 18

**Breaking Changes:**
- **Automatic Batching**: State updates batch automatically
- **Stricter Hydration**: More errors for mismatches
- **Concurrent Features**: Optional but changes behavior
- **`ReactDOM.render` deprecated**: Should use `createRoot` (Next.js handles this)
- **Type changes**: Event handlers, refs, etc.

**Required Changes:**
- Update all type definitions
- Test hydration carefully (server/client mismatches)
- Review any `useEffect` timing assumptions
- Remove `@ts-ignore` in `_app.tsx:26` after types update

**Files Affected:**
- `pages/_app.tsx:26` (@ts-ignore comment)
- All components using React hooks
- Type definitions across codebase

### 3. Unified/Remark Ecosystem v9-14 → v15

**Breaking Changes:**
- **Pure ESM**: All packages now ESM-only
- **API changes**: Plugin interfaces updated
- **Import changes**: Named imports required
- **Version alignment**: All remark/unified packages must align

**Migration Path:**
```javascript
// OLD (unified v9, remark-parse v9)
import unified from "unified";
import markdown from "remark-parse";
import html from "remark-html";

const processor = unified()
  .use(markdown)
  .use(html);

// NEW (unified v11, remark-parse v11)
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const processor = unified()
  .use(remarkParse)
  .use(remarkHtml);
```

**Required Changes:**
- Convert all unified/remark imports to named imports
- Update plugin usage syntax
- Remove `remark-images` (obsolete/unmaintained)
- Test markdown rendering thoroughly

**Files Affected:**
- `pages/blog/[slug].js:5-8` (import statements)
- `pages/blog/[slug].js:36` (unified pipeline)

### 4. TypeScript Type Definitions

**Mismatches:**
- `@types/react` 16.x with React 17 runtime
- `@types/node` 14.x with Node 22 runtime
- Missing types for newer packages

**Required Changes:**
- Update all type packages to match runtime versions
- Fix type errors that emerge from stricter definitions
- May need to enable `strict: true` in tsconfig.json gradually

### 5. Google Analytics Migration

**Current:** Universal Analytics (UA) with `react-ga` v3
**Issue:** UA deprecated, GA4 is current standard

**Options:**
1. Keep `react-ga` v3 with UA (deprecated but functional)
2. Upgrade to `react-ga4` package for GA4
3. Use Next.js Script component with gtag.js directly

**Recommended:** Migrate to GA4 with `react-ga4` or native gtag approach

**Files Affected:**
- `utils/gtag.tsx`
- `pages/_document.tsx`
- `pages/_app.tsx`
- `src/components/Layout.tsx`

### 6. Webpack & Build Tools

**Changes:**
- Webpack 5.80 → 5.97+: Minor breaking changes possible
- Rollup 3.21 → 4.x: Major version with breaking changes
- Babel loader updates

**Risk:** Mermaid bundling may break (webpack.config.js, rollup.config.mjs)

**Files Affected:**
- `webpack.config.js`
- `rollup.config.mjs`

---

## Phased Upgrade Strategy

### Phase 0: Preparation (Required First)

**Objective:** Set up infrastructure to safely make changes

**Steps:**
1. **Create comprehensive backup**
   - Tag current state: `git tag pre-upgrade-backup`
   - Document current functionality

2. **Document current behavior**
   - Test all pages manually
   - Screenshot pages in light/dark mode
   - Verify blog post rendering
   - Test mobile responsiveness
   - Check Mermaid diagram rendering

3. **Set up testing infrastructure** (Optional but recommended)
   - Add basic smoke test script
   - Consider adding Playwright or Cypress for E2E tests

4. **Create upgrade branch**
   - Branch: `feat/dependency-upgrades`
   - Make incremental commits

5. **Update Node.js constraint** (if needed)
   - Current: `>=22.0.0 <23.0.0`
   - Verify Next.js 15 supports Node 22 (it does)

**Deliverables:**
- Git tag: `pre-upgrade-backup`
- Screenshot documentation
- New feature branch

**Risk:** LOW
**Effort:** 1-2 hours

---

### Phase 1: Type Definitions & TypeScript

**Objective:** Update type definitions to match runtime versions

**Rationale:** Fix type mismatches before making runtime changes

**Steps:**
1. Update TypeScript to latest 5.x
   ```bash
   npm install -D typescript@latest
   ```

2. Update type definitions:
   ```bash
   npm install -D @types/node@^22.10.5
   npm install -D @types/react@^18.3.18
   npm install -D @types/react-dom@^18.3.5
   npm install -D @types/gtag.js@latest
   ```

3. Run type check:
   ```bash
   npx tsc --noEmit
   ```

4. Fix type errors that emerge:
   - Focus on `pages/_app.tsx` (@ts-ignore removal)
   - Fix event handler types
   - Fix component prop types

5. Test build:
   ```bash
   npm run build
   ```

**Expected Issues:**
- Type errors from React 18 types with React 17 runtime
- May need to keep some `@ts-ignore` temporarily

**Files to Modify:**
- `package.json`
- `pages/_app.tsx`
- Various component files with type errors

**Rollback Plan:**
```bash
git reset --hard HEAD
npm install
```

**Risk:** MEDIUM
**Effort:** 2-3 hours

---

### Phase 2: React 17 → 18

**Objective:** Upgrade React runtime to version 18

**Rationale:** Required before Next.js 13+

**Steps:**
1. Update React packages:
   ```bash
   npm install react@^18.3.1 react-dom@^18.3.1
   ```

2. Remove the `@ts-ignore` in `_app.tsx` line 26

3. Test the application:
   ```bash
   npm run dev
   ```

4. Check for hydration errors in console

5. Test all interactive features:
   - Theme toggle
   - Navigation
   - Mobile menu
   - Blog post links

6. Build and test production:
   ```bash
   npm run build
   npm start
   ```

**Expected Issues:**
- Hydration errors (server/client HTML mismatch)
- Timing changes in `useEffect`
- Type errors (should be mostly resolved from Phase 1)

**Breaking Change Mitigations:**
- React 18 has good backwards compatibility
- Next.js handles most migration concerns
- Main risk is hydration errors

**Files to Monitor:**
- `pages/_app.tsx`
- `src/components/Layout.tsx` (theme, navigation)
- All components with client-side state

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** MEDIUM
**Effort:** 2-3 hours

**Testing Checklist:**
- [ ] Home page renders
- [ ] Blog listing page shows all posts
- [ ] Individual blog posts render with styling
- [ ] Code syntax highlighting works
- [ ] Images load correctly
- [ ] Dark/light theme toggle works
- [ ] Mobile menu works
- [ ] Navigation links work
- [ ] Resume page renders
- [ ] No hydration errors in console
- [ ] Google Analytics fires

---

### Phase 3: Next.js 12 → 13

**Objective:** Upgrade Next.js from 12 to 13 (NOT 14 or 15 yet)

**Rationale:** Incremental upgrade reduces risk; 13 is a stable stopping point

**Steps:**
1. Update Next.js:
   ```bash
   npm install next@^13.5.6
   ```
   (Using 13.5.6 as last stable v13 before v14)

2. Create/update `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true, // Enable SWC minifier
   }

   module.exports = nextConfig
   ```

3. Update all `<Link>` components:
   ```javascript
   // OLD
   <Link href="/path" legacyBehavior>
     <a>Text</a>
   </Link>

   // NEW
   <Link href="/path">
     Text
   </Link>
   ```

4. Test application:
   ```bash
   npm run dev
   ```

5. Check for deprecation warnings in console

6. Test build:
   ```bash
   npm run build
   ```

7. Verify image loading still works

**Expected Issues:**
- Build errors from removed features
- Link components need updating
- Potential webpack/build config conflicts

**Breaking Changes to Address:**
- Remove `legacyBehavior` from Link components
- Remove `<a>` tags from within Link components
- Check `next/image` usage (if any)
- Verify API routes still work

**Files to Modify:**
- `pages/blog.tsx:24` (Link with legacyBehavior)
- `next.config.js` (create if doesn't exist)
- Any other files using `<Link>`

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** HIGH
**Effort:** 3-4 hours

**Testing Checklist:**
- [ ] All navigation links work
- [ ] Build completes without errors
- [ ] No console warnings about deprecated features
- [ ] Blog posts still render correctly
- [ ] Images load
- [ ] Styles apply correctly
- [ ] Mobile navigation works

---

### Phase 4: Next.js 13 → 14

**Objective:** Upgrade to Next.js 14 for better stability

**Rationale:** 14 is very stable, 15 is newer and can wait

**Steps:**
1. Update Next.js:
   ```bash
   npm install next@^14.2.21
   ```
   (14.2.21 is latest stable v14)

2. Verify Node.js version compatibility:
   - Requires Node 18.17+
   - We have Node 22, so we're good

3. Update `next.config.js` if needed:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
   }

   module.exports = nextConfig
   ```

4. Test application:
   ```bash
   npm run dev
   npm run build
   ```

5. Check for new warnings or errors

**Expected Issues:**
- Minimal breaking changes from 13 → 14
- Mostly feature additions and performance improvements

**Breaking Changes:**
- `ImageResponse` import location changed (if used)
- Fetch caching behavior changes (may affect ISR)

**Files to Monitor:**
- API routes (if using fetch)
- Any `getStaticProps` with revalidation

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** MEDIUM
**Effort:** 1-2 hours

---

### Phase 5: Unified/Remark Ecosystem

**Objective:** Upgrade markdown processing libraries

**Rationale:** Current versions are outdated and have breaking changes

**Steps:**
1. Update all remark/unified packages:
   ```bash
   npm install remark@latest unified@latest
   npm install -D remark-parse@latest remark-html@latest remark-highlight.js@latest
   npm install -D remark-grid-tables@latest rehype-highlight@latest
   ```

2. Remove obsolete package:
   ```bash
   npm uninstall remark-images
   ```

3. Update imports in `pages/blog/[slug].js`:
   ```javascript
   // OLD
   import html from "remark-html";
   import highlight from "remark-highlight.js";
   import unified from "unified";
   import markdown from "remark-parse";
   import images from "remark-images";

   // NEW
   import { remarkHtml } from "remark-html";
   import remarkHighlight from "remark-highlight.js";
   import { unified } from "unified";
   import remarkParse from "remark-parse";
   // Remove remark-images import
   ```

4. Update unified pipeline:
   ```javascript
   // OLD
   const { process } = unified()
     .use(markdown)
     .use(highlight)
     .use(images)
     .use(html);

   // NEW
   const { process } = unified()
     .use(remarkParse)
     .use(remarkHighlight)
     .use(remarkHtml);
   ```

5. Test markdown rendering:
   - View multiple blog posts
   - Check code highlighting
   - Verify table rendering
   - Check image rendering

6. Test build:
   ```bash
   npm run build
   ```

**Expected Issues:**
- ESM import errors
- Plugin API changes
- Image handling (since removing remark-images)
- Table rendering changes

**Breaking Changes:**
- All packages now pure ESM
- Plugin interfaces changed
- `remark-images` removed (need to verify images still work)

**Files to Modify:**
- `pages/blog/[slug].js` (import and usage)

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** HIGH
**Effort:** 3-4 hours

**Testing Checklist:**
- [ ] Blog posts render correctly
- [ ] Code blocks have syntax highlighting
- [ ] Tables render properly (if using grid-tables)
- [ ] Images display correctly
- [ ] Links work
- [ ] Markdown formatting preserved
- [ ] Build succeeds

---

### Phase 6: UI Libraries & Utilities

**Objective:** Update FontAwesome, utilities, and remove unused packages

**Steps:**
1. Update FontAwesome:
   ```bash
   npm install @fortawesome/fontawesome-svg-core@latest
   npm install @fortawesome/free-solid-svg-icons@latest
   npm install @fortawesome/react-fontawesome@latest
   ```

2. Update utilities:
   ```bash
   npm install uuid@latest
   npm install -D prettier@latest
   ```

3. Remove unused packages:
   ```bash
   npm uninstall @toast-ui/react-editor markdown-it react-markdown react-syntax-highlighter
   ```

4. Test icon rendering:
   - Check theme toggle icon
   - Check any other icons used
   - Test in light and dark mode

5. Run prettier on codebase (optional):
   ```bash
   npx prettier --write .
   ```

**Expected Issues:**
- Minimal; these are mostly non-breaking updates
- UUID v11 has major version bump but backwards compatible API

**Files to Monitor:**
- Components using FontAwesome icons
- Code using `uuid` package

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** LOW
**Effort:** 1 hour

---

### Phase 7: Build Tools & Mermaid

**Objective:** Update build tools and handle Mermaid upgrade

**Steps:**
1. Update build tools:
   ```bash
   npm install -D webpack@latest webpack-cli@latest
   npm install -D rollup@latest @rollup/plugin-commonjs@latest @rollup/plugin-node-resolve@latest
   npm install -D babel-loader@latest
   ```

2. Test Mermaid build:
   ```bash
   npm run build:mermaid
   ```

3. If Mermaid build fails, may need to:
   - Update webpack.config.js
   - Update rollup.config.mjs
   - Or simplify by only using CDN (component already does)

4. Update Mermaid package:
   ```bash
   npm install mermaid@latest
   ```

5. Update CDN version in Mermaid component:
   ```javascript
   // src/components/Mermaid.tsx:12
   // OLD
   mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@8.11.0/dist/mermaid.min.js';

   // NEW
   mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
   ```

6. Test Mermaid rendering:
   - Visit `/auth/diagrams` (if that page exists)
   - Check any blog posts with diagrams

**Expected Issues:**
- Rollup 4.x has breaking changes from 3.x
- Webpack config may need updates
- Mermaid 11 API changes

**Alternative Approach:**
- If build:mermaid fails, consider removing the script
- Component already uses CDN, may not need bundled version

**Files to Modify:**
- `webpack.config.js` (may need updates)
- `rollup.config.mjs` (may need updates)
- `src/components/Mermaid.tsx` (CDN URL)

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** MEDIUM
**Effort:** 2-3 hours

---

### Phase 8: Google Analytics Migration (Optional)

**Objective:** Migrate from UA to GA4

**Rationale:** Universal Analytics is deprecated; GA4 is current

**Steps:**
1. Create GA4 property in Google Analytics

2. Choose migration approach:

   **Option A: react-ga4 package**
   ```bash
   npm install react-ga4
   ```

   **Option B: Native gtag with Next.js Script**
   (No package needed)

3. Update GA implementation:

   **Option A: react-ga4**
   ```javascript
   // utils/gtag.tsx
   import ReactGA from "react-ga4";

   export const GA_TRACKING_ID = "G-XXXXXXXXXX"; // New GA4 ID

   export const pageview = (url: string) => {
     ReactGA.send({ hitType: "pageview", page: url });
   };

   export const event = (action: string, params: any) => {
     ReactGA.event(action, params);
   };

   // pages/_app.tsx
   useEffect(() => {
     ReactGA.initialize(GA_TRACKING_ID);
   }, []);
   ```

   **Option B: Native gtag**
   ```javascript
   // pages/_document.tsx
   // Update GA4 script
   <script
     async
     src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
   />
   ```

4. Remove duplicate GA initialization:
   - Currently initialized in both `_app.tsx` and `Layout.tsx`
   - Keep only one initialization point

5. Test analytics:
   - Use GA4 DebugView
   - Verify page views
   - Test custom events

**Files to Modify:**
- `utils/gtag.tsx`
- `pages/_document.tsx`
- `pages/_app.tsx`
- `src/components/Layout.tsx`

**Rollback Plan:**
- Keep UA code until GA4 confirmed working
- Both can run simultaneously during transition

**Risk:** LOW (analytics failure doesn't break site)
**Effort:** 2-3 hours

**Note:** Can be done independently of other phases

---

### Phase 9: Next.js 14 → 15 (Optional)

**Objective:** Upgrade to latest Next.js 15

**Rationale:** Latest features and improvements

**Steps:**
1. Update Next.js:
   ```bash
   npm install next@latest
   ```

2. Review breaking changes:
   - Async Request APIs (`headers()`, `cookies()`)
   - Fetch caching changes
   - Route handler changes

3. Since we're using Pages Router (not App Router), impact is minimal

4. Test application thoroughly:
   ```bash
   npm run dev
   npm run build
   ```

5. Check for new warnings

**Expected Issues:**
- Minimal for Pages Router apps
- Most breaking changes affect App Router

**Breaking Changes:**
- Default fetch caching behavior
- Some API changes (likely not affecting this project)

**Rollback Plan:**
```bash
git revert HEAD
npm install
```

**Risk:** MEDIUM
**Effort:** 1-2 hours

**Recommendation:** Can skip this phase initially and stay on 14.x for stability

---

## Testing Strategy

### Manual Testing Checklist

After each phase, verify:

#### Core Functionality
- [ ] Home page renders correctly
- [ ] Blog listing page shows all posts
- [ ] Blog listing shows thumbnails
- [ ] Blog listing shows descriptions
- [ ] Clicking blog post navigates to detail
- [ ] Blog post detail page renders
- [ ] Blog post banner image displays
- [ ] Blog post content renders
- [ ] Code blocks have syntax highlighting
- [ ] Images in blog posts display
- [ ] Links in blog posts work
- [ ] Resume page renders
- [ ] Footer social links work

#### Theme & Styling
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme toggle button works
- [ ] Theme persists on page navigation
- [ ] Theme toggle icon shows correct state
- [ ] All colors correct in both themes
- [ ] Typography loads correctly (Open Sans, Inconsolata)

#### Responsive Design
- [ ] Desktop layout (>1024px) correct
- [ ] Tablet layout (768px-1024px) correct
- [ ] Mobile layout (<768px) correct
- [ ] Mobile hamburger menu appears
- [ ] Mobile menu opens/closes
- [ ] Mobile menu navigation works
- [ ] Images scale responsively

#### Build & Performance
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] No warnings in build output
- [ ] `npm start` runs production build
- [ ] Production build renders correctly
- [ ] No console errors in browser
- [ ] No hydration errors

#### Special Features
- [ ] Mermaid diagrams render (if applicable)
- [ ] Google Analytics fires (check Network tab)
- [ ] Buy Me a Coffee widget loads
- [ ] Page transitions work smoothly

### Browser Testing

Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)
- Mobile browsers (Chrome Mobile, Safari iOS)

### Automated Testing (If Implemented)

Recommended additions:
```bash
# Install testing tools
npm install -D @playwright/test

# Create basic E2E tests
# tests/e2e/smoke.spec.ts
```

---

## Risk Mitigation

### High-Risk Items

1. **Unified/Remark Ecosystem (Phase 5)**
   - **Risk:** ESM changes, API changes, image handling
   - **Mitigation:**
     - Test thoroughly with multiple blog posts
     - Have rollback ready
     - Consider keeping old versions if issues arise

2. **Next.js 12 → 13 (Phase 3)**
   - **Risk:** Link component changes, build system changes
   - **Mitigation:**
     - Update Link components carefully
     - Test all navigation
     - Incremental upgrade (not jumping to 15)

3. **No Testing Infrastructure**
   - **Risk:** Can't automatically verify nothing broke
   - **Mitigation:**
     - Manual testing checklist after each phase
     - Screenshot comparison
     - Consider adding basic tests

### Rollback Strategy

Each phase has a rollback plan:
```bash
# Rollback last phase
git revert HEAD
npm install

# Or rollback to before all upgrades
git checkout pre-upgrade-backup
npm install
```

### Incremental Commits

Commit after each successful phase:
```bash
git add -A
git commit -m "Phase X: [Description] - Successfully upgraded [packages]"
git push origin feat/dependency-upgrades
```

---

## Success Criteria

Upgrade is successful when:

### Functional Requirements
- ✅ All pages render correctly
- ✅ Blog posts display with styling and images
- ✅ Theme toggle works in both directions
- ✅ Mobile navigation works
- ✅ Build completes without errors
- ✅ No console errors or warnings
- ✅ Google Analytics tracking works

### Technical Requirements
- ✅ Next.js 14+ (or 15)
- ✅ React 18.3+
- ✅ TypeScript 5.x with matching type definitions
- ✅ Unified/remark ecosystem current versions
- ✅ All dependencies < 2 years old
- ✅ No deprecated packages
- ✅ No critical security vulnerabilities (`npm audit`)

### Quality Requirements
- ✅ Same or better performance
- ✅ Same visual appearance
- ✅ Same functionality
- ✅ Clean build output
- ✅ No technical debt added

---

## Timeline Estimate

| Phase | Effort | Dependencies | Can Parallelize? |
|-------|--------|--------------|------------------|
| 0. Preparation | 1-2h | None | N/A |
| 1. TypeScript/Types | 2-3h | Phase 0 | No |
| 2. React 17→18 | 2-3h | Phase 1 | No |
| 3. Next.js 12→13 | 3-4h | Phase 2 | No |
| 4. Next.js 13→14 | 1-2h | Phase 3 | No |
| 5. Remark/Unified | 3-4h | Phase 4 | No |
| 6. UI Libraries | 1h | Phase 2 | Partially |
| 7. Build Tools | 2-3h | Phase 4 | Partially |
| 8. GA Migration | 2-3h | None | Yes |
| 9. Next.js 14→15 | 1-2h | Phase 4 | No |

**Total Estimated Effort:** 18-27 hours

**Recommended Schedule:**
- Week 1: Phases 0-2 (preparation + React)
- Week 2: Phases 3-5 (Next.js + Remark)
- Week 3: Phases 6-9 (polish + optional)

---

## Alternative Approaches

### Conservative Approach
Skip to Next.js 14 and stay there:
- Phases 0-4, 6-7 only
- Skip Next.js 15 (Phase 9)
- Skip GA4 migration (Phase 8)
- Estimated: 15-20 hours
- Lower risk

### Aggressive Approach
Jump directly to latest versions:
- Update everything at once
- More debugging required
- Higher risk of failures
- Not recommended without tests

### Minimal Viable Upgrade
Only critical security updates:
- Update Next.js to 13.x
- Update React to 18.x
- Update TypeScript types
- Leave everything else
- Estimated: 8-12 hours
- Lowest risk but still outdated

---

## Post-Upgrade Maintenance

After successful upgrade:

### Immediate Tasks
1. Update CLAUDE.md with new versions
2. Document any workarounds or known issues
3. Run `npm audit` and address vulnerabilities
4. Consider adding Dependabot or Renovate

### Ongoing Maintenance
1. **Monthly:** Check for patch updates
   ```bash
   npm outdated
   npm update
   ```

2. **Quarterly:** Review major version updates

3. **Annually:** Major upgrade cycle (like this one)

### Future Considerations
1. **Testing Infrastructure:** Add Playwright/Cypress
2. **CI/CD:** Add GitHub Actions for builds
3. **Linting:** Add ESLint with proper config
4. **Prettier Config:** Create .prettierrc
5. **TypeScript Strict Mode:** Gradually enable
6. **App Router Migration:** Consider for Next.js 14+

---

## Dependencies Reference

### Complete Upgrade Matrix

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.3.0" → "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.3.0" → "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.0" → "^0.2.2",
    "mermaid": "^10.1.0" → "^11.5.0",
    "next": "^12.3.4" → "^14.2.21" (or "^15.1.3"),
    "next-themes": "^0.4.6" → "^0.4.6" (current),
    "prettier": "^2.3.2" → "^3.4.2",
    "react": "^17.0.2" → "^18.3.1",
    "react-dom": "^17.0.2" → "^18.3.1",
    "react-ga": "^3.3.0" → "^3.3.1" OR "react-ga4@^2.1.0",
    "remark": "^14.0.2" → "^15.0.1",
    "remark-grid-tables": "^2.1.2" → "^3.0.0",

    // REMOVE (unused)
    "@toast-ui/react-editor": "^3.2.3" → REMOVE,
    "markdown-it": "^13.0.1" → REMOVE,
    "react-markdown": "^7.0.1" → REMOVE,
    "react-syntax-highlighter": "^15.5.0" → REMOVE
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^24.1.0" → "^28.0.2",
    "@rollup/plugin-node-resolve": "^15.0.2" → "^15.3.1",
    "@types/gtag.js": "0.0.3" → "^0.0.20",
    "@types/node": "^14.17.5" → "^22.10.5",
    "@types/react": "^16.14.11" → "^18.3.18",
    "@types/react-dom": "ADD" → "^18.3.5",
    "babel-loader": "^9.1.2" → "^9.2.1",
    "gray-matter": "^4.0.3" → "^4.0.3" (current),
    "rehype-highlight": "^6.0.0" → "^7.0.1",
    "remark-highlight.js": "^6.0.0" → "^7.0.1",
    "remark-html": "^13.0.2" → "^16.0.1",
    "remark-images": "^2.0.0" → REMOVE (obsolete),
    "remark-parse": "^9.0.0" → "^11.0.0",
    "rollup": "^3.21.0" → "^4.30.1",
    "typescript": "^5.0.4" → "^5.7.3",
    "unified": "^9.2.1" → "^11.0.5",
    "uuid": "^8.3.2" → "^11.0.5",
    "webpack": "^5.80.0" → "^5.97.1",
    "webpack-cli": "^5.0.2" → "^6.0.1"
  }
}
```

---

## Appendix A: Key Files Reference

### Files Requiring Changes

| File | Changes Required | Phases |
|------|------------------|--------|
| `package.json` | All dependency updates | All |
| `pages/_app.tsx` | Remove @ts-ignore, update GA | 1, 2, 8 |
| `pages/_document.tsx` | Update GA4 script | 8 |
| `pages/blog.tsx` | Remove legacyBehavior from Link | 3 |
| `pages/blog/[slug].js` | Update remark imports and usage | 5 |
| `src/components/Mermaid.tsx` | Update CDN URL | 7 |
| `src/components/Layout.tsx` | Update GA (remove duplicate) | 8 |
| `tsconfig.json` | Possibly enable stricter options | 1 |
| `next.config.js` | Create/update config | 3, 4 |
| `webpack.config.js` | Possibly update for Webpack 5 | 7 |
| `rollup.config.mjs` | Possibly update for Rollup 4 | 7 |

---

## Appendix B: Command Reference

### Quick Commands

```bash
# Check current versions
npm list next react typescript

# Check for outdated packages
npm outdated

# Check for security vulnerabilities
npm audit

# Update specific package
npm install [package]@latest

# Update multiple packages
npm install [pkg1]@latest [pkg2]@latest

# Remove unused packages
npm uninstall [package]

# Clean install
rm -rf node_modules package-lock.json
npm install

# Test commands
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run build:mermaid # Build Mermaid bundle

# Type checking
npx tsc --noEmit

# Code formatting
npx prettier --write .
```

---

## Appendix C: Useful Resources

### Official Migration Guides
- [Next.js 12 to 13](https://nextjs.org/docs/app/building-your-application/upgrading/version-13)
- [Next.js 13 to 14](https://nextjs.org/docs/app/building-your-application/upgrading/version-14)
- [Next.js 14 to 15](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [Unified Collective Docs](https://unifiedjs.com/)

### Package Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Remark](https://remark.js.org/)
- [FontAwesome React](https://fontawesome.com/docs/web/use-with/react)

### Tools
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) - Check for updates
- [Dependabot](https://github.com/dependabot) - Automated dependency updates
- [Renovate](https://www.mend.io/renovate/) - Alternative to Dependabot

---

## Conclusion

This upgrade is complex but manageable with a phased approach. The key is:

1. **Incremental changes** - Don't update everything at once
2. **Test thoroughly** - Manual testing after each phase
3. **Commit frequently** - Easy rollback if needed
4. **Focus on stability** - Don't need bleeding edge (14 vs 15)

**Recommended Path:**
- Start with Phases 0-4 (prep through Next.js 14)
- Phase 5 (Remark) can be tricky; allocate extra time
- Phases 6-7 are polish
- Phases 8-9 are optional

**Total Effort:** 18-27 hours depending on issues encountered

**When to Stop:**
- If multiple phases fail, may indicate deeper issues
- Consider staying on Next.js 13 or 14 if 15 causes problems
- Can skip optional phases (8, 9) for stability

This upgrade will modernize the codebase and make future maintenance easier. The site will benefit from performance improvements, security updates, and access to newer features.

Good luck! 🚀
