# Man Clicks Photography Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive, frontend-only Angular portfolio site for the "Man Clicks" photography brand, with four gallery categories, a masonry gallery, a fullscreen lightbox with deep-linkable photo URLs, localStorage likes, download, and WhatsApp share.

**Architecture:** Standalone Angular 17 app (`man-clicks/`), lazy-loaded routes generated from a single category-config list, a reusable `GalleryPageComponent` driven by route data, a dependency-free CSS-Grid masonry layout, and small focused services (`LikesService`, `ShareService`) backed by `localStorage`. No backend, no SSR.

**Tech Stack:** Angular 17.3 (CLI 17.3.17, matches Node 20.10 already installed), TypeScript, plain CSS with custom properties, Karma + Jasmine (Angular CLI defaults), Node (for the one-off placeholder-asset generator script).

## Global Constraints

- New project lives at `man-clicks/` at the repo root, sibling to `alekya-portfolio` and `manjith-portfolio`. Do not modify those projects.
- Frontend-only: no backend, no shared/global like counts, no real booking form.
- Palette (CSS custom properties): Warm Ivory `#F8F3E7`, Soft Cream `#EFE6D2`, Champagne Gold `#B79A5B`, Deep Espresso `#352A1F`, Muted Taupe `#8C7B68`, White `#FFFFFF`.
- Brand copy: name "Man Clicks", tagline "Capturing your moments, forever.", Instagram `@manclicksiowa`, email `manclicksiowa@gmail.com`, location "Des Moines, Iowa".
- No captions/titles/dates/locations under individual gallery images.
- All standalone components; lazy-loaded page routes via `loadComponent`.
- Respect `prefers-reduced-motion` wherever animation is added.
- No logo/photography assets exist yet — everything under `src/assets/images/` and the wordmark/favicon are placeholders, clearly commented `PLACEHOLDER — replace with real photography/logo`.
- Categories and their slugs (fixed for this plan): `baby-shoots` (Baby Shoots), `professional-portraits` (Professional Portraits), `engagements` (Engagements), `birthdays` (Birthdays).

---

## Task 1: Scaffold the Angular workspace

**Files:**
- Create: `man-clicks/` (entire generated Angular CLI workspace)

**Interfaces:**
- Produces: a working Angular 17 workspace at `man-clicks/`, buildable via `npm run build` and testable via `npm test`, with `src/app/app.component.ts` as the (temporary) root standalone component.

- [ ] **Step 1: Generate the workspace**

Run from the repo root (`c:\Users\aleky\OneDrive\Desktop\Project`):

```bash
npx -p @angular/cli@17.3.17 ng new man-clicks --standalone --routing --style=css --ssr=false --skip-git --package-manager=npm
```

When prompted (if not suppressed by flags), decline any analytics prompt.

- [ ] **Step 2: Verify the default project builds**

Run: `cd man-clicks && npm run build`
Expected: build completes with `Application bundle generation complete.` and no errors.

- [ ] **Step 3: Verify the default tests pass**

Run: `npm test -- --watch=false --browsers=ChromeHeadless`
Expected: Karma reports the default `AppComponent` spec passing (e.g. `1 SUCCESS` or similar, `Executed 1 of 1 SUCCESS`).

- [ ] **Step 4: Commit**

```bash
cd ..
git add man-clicks
git commit -m "Scaffold man-clicks Angular workspace"
```

---

## Task 2: Global design tokens and base styles

**Files:**
- Modify: `man-clicks/src/styles.css`
- Modify: `man-clicks/src/index.html`

**Interfaces:**
- Produces: CSS custom properties (`--color-ivory`, `--color-cream`, `--color-gold`, `--color-espresso`, `--color-taupe`, `--color-white`, `--font-serif`, `--font-sans`, `--space-*` scale) available globally to every component's styles; a CSS reset; smooth scrolling enabled.

- [ ] **Step 1: Write `src/styles.css`**

```css
/* man-clicks/src/styles.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');

:root {
  --color-ivory: #F8F3E7;
  --color-cream: #EFE6D2;
  --color-gold: #B79A5B;
  --color-espresso: #352A1F;
  --color-taupe: #8C7B68;
  --color-white: #FFFFFF;

  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Jost', 'Segoe UI', sans-serif;

  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 7rem;

  --transition-base: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --border-hairline: 1px solid rgba(53, 42, 31, 0.15);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--color-ivory);
  color: var(--color-espresso);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
  font-weight: 500;
  margin: 0 0 var(--space-sm);
  letter-spacing: 0.01em;
}

p {
  margin: 0 0 var(--space-sm);
}

a {
  color: inherit;
}

button {
  font-family: var(--font-sans);
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}

:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Update `src/index.html` title and favicon reference**

Read the current `man-clicks/src/index.html` first, then replace the `<title>` and add a favicon link (the favicon file itself is created in Task 3):

```html
<title>Man Clicks | Des Moines, Iowa Photography</title>
<meta name="description" content="Man Clicks — capturing your moments, forever. Photography portfolio for baby shoots, professional portraits, engagements, and birthdays in Des Moines, Iowa.">
<link rel="icon" type="image/svg+xml" href="assets/branding/favicon-placeholder.svg">
```

- [ ] **Step 3: Verify the app still builds and serves**

Run: `cd man-clicks && npm run build`
Expected: build succeeds (the favicon file doesn't need to exist yet for the build to succeed; it will 404 in the browser until Task 3 adds it — acceptable at this intermediate step).

- [ ] **Step 4: Commit**

```bash
git add man-clicks/src/styles.css man-clicks/src/index.html
git commit -m "Add Man Clicks design tokens and base global styles"
```

---

## Task 3: Placeholder asset generator (photos, hero images, logo, favicon)

**Files:**
- Create: `man-clicks/scripts/generate-placeholder-assets.js`
- Create (generated by the script, then committed): `man-clicks/src/assets/images/{baby,professional,engagement,birthday}/*.svg`, `man-clicks/src/assets/branding/man-clicks-logo.svg`, `man-clicks/src/assets/branding/favicon-placeholder.svg`

**Interfaces:**
- Produces: for each of the 4 categories, 10 gallery placeholder SVGs named `<prefix>-001.svg` … `<prefix>-010.svg` (prefixes: `baby`, `professional`, `engagement`, `birthday`) with varied intrinsic width/height (mix of portrait 800x1000, landscape 1000x750, square 900x900), plus `<prefix>-hero-main.svg` (1400x1000) and `<prefix>-hero-secondary.svg` (700x900) per category. Also `man-clicks-logo.svg` (a typographic wordmark) and `favicon-placeholder.svg` (a simplified monogram). All files are plain static SVGs checked into the repo (the script is a one-off dev tool, not part of the running app).

- [ ] **Step 1: Write the generator script**

```js
// man-clicks/scripts/generate-placeholder-assets.js
//
// One-off dev tool: generates local SVG placeholder images so the app has
// something to render before real photography and the final logo are
// supplied. PLACEHOLDER — replace the files this script writes with real
// photography / the final logo, then this script can be deleted.
'use strict';

const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = path.join(__dirname, '..', 'src', 'assets');

const PALETTE = ['#EFE6D2', '#B79A5B', '#8C7B68', '#F8F3E7'];

const CATEGORIES = [
  { dir: 'baby', prefix: 'baby', label: 'Baby' },
  { dir: 'professional', prefix: 'professional', label: 'Professional' },
  { dir: 'engagement', prefix: 'engagement', label: 'Engagement' },
  { dir: 'birthday', prefix: 'birthday', label: 'Birthday' },
];

// width/height pairs cycled across the 10 gallery images per category to
// produce a visually varied masonry layout (portrait / landscape / square).
const DIMENSIONS = [
  [800, 1000], [1000, 750], [900, 900], [800, 1100], [1000, 700],
  [850, 950], [1000, 800], [900, 1000], [950, 750], [800, 1000],
];

function svgPlaceholder(width, height, bgColor, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#352A1F" stroke-opacity="0.12"/>
  <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.round(Math.min(width, height) * 0.06)}" fill="#352A1F" fill-opacity="0.55" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeGalleryImages() {
  CATEGORIES.forEach(({ dir, prefix, label }, catIndex) => {
    const outDir = path.join(ASSETS_ROOT, 'images', dir);
    ensureDir(outDir);
    DIMENSIONS.forEach(([w, h], i) => {
      const num = String(i + 1).padStart(3, '0');
      const bg = PALETTE[(catIndex + i) % PALETTE.length];
      const svg = svgPlaceholder(w, h, bg, `${label} · ${num}`);
      fs.writeFileSync(path.join(outDir, `${prefix}-${num}.svg`), svg, 'utf8');
    });
    // Hero pair: one large "featured" composition image, one smaller
    // overlapping secondary image, per category.
    fs.writeFileSync(
      path.join(outDir, `${prefix}-hero-main.svg`),
      svgPlaceholder(1400, 1000, PALETTE[catIndex % PALETTE.length], `${label} — Featured`),
      'utf8'
    );
    fs.writeFileSync(
      path.join(outDir, `${prefix}-hero-secondary.svg`),
      svgPlaceholder(700, 900, PALETTE[(catIndex + 2) % PALETTE.length], `${label} — Detail`),
      'utf8'
    );
  });
}

function writeBranding() {
  const brandingDir = path.join(ASSETS_ROOT, 'branding');
  ensureDir(brandingDir);

  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
  <rect width="100%" height="100%" fill="none"/>
  <text x="0" y="48" font-family="Georgia, serif" font-size="40" letter-spacing="2" fill="#352A1F">Man Clicks</text>
  <line x1="2" y1="60" x2="230" y2="60" stroke="#B79A5B" stroke-width="1.5"/>
</svg>`;
  fs.writeFileSync(path.join(brandingDir, 'man-clicks-logo.svg'), logoSvg, 'utf8');

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#352A1F"/>
  <text x="32" y="42" font-family="Georgia, serif" font-size="30" fill="#B79A5B" text-anchor="middle">M</text>
</svg>`;
  fs.writeFileSync(path.join(brandingDir, 'favicon-placeholder.svg'), faviconSvg, 'utf8');
}

writeGalleryImages();
writeBranding();

console.log('Placeholder assets generated under', ASSETS_ROOT);
```

- [ ] **Step 2: Run the script**

Run: `cd man-clicks && node scripts/generate-placeholder-assets.js`
Expected output: `Placeholder assets generated under .../man-clicks/src/assets`

- [ ] **Step 3: Verify the expected files exist**

Run (from `man-clicks/`):
```bash
node -e "const fs=require('fs'); const dirs=['baby','professional','engagement','birthday']; dirs.forEach(d=>{const files=fs.readdirSync('src/assets/images/'+d); console.log(d, files.length, 'files');});"
```
Expected: each category prints `12 files` (10 gallery images + hero-main + hero-secondary).

Run: `ls src/assets/branding`
Expected: `favicon-placeholder.svg` and `man-clicks-logo.svg` both present.

- [ ] **Step 4: Commit**

```bash
git add man-clicks/scripts man-clicks/src/assets
git commit -m "Add placeholder asset generator and generated placeholder images"
```

---

## Task 4: Core models and social config

**Files:**
- Create: `man-clicks/src/app/core/models/gallery.model.ts`
- Create: `man-clicks/src/app/core/config/social.config.ts`

**Interfaces:**
- Produces: `GalleryImage`, `GalleryCategory` interfaces; `SOCIAL_CONFIG` constant object with `instagramUrl`, `instagramHandle`, `email`, `location`.
- Consumes: nothing (leaf module).

- [ ] **Step 1: Write the models**

```ts
// man-clicks/src/app/core/models/gallery.model.ts
export interface GalleryImage {
  /** Globally unique id across the whole site, e.g. "baby-001". */
  id: string;
  /** Display/preview asset path. */
  src: string;
  /**
   * Original hi-res asset path used for downloads. Equals `src` today
   * (placeholder SVGs); swap in a real hi-res original later without
   * touching any component code.
   */
  downloadSrc: string;
  alt: string;
  /** Intrinsic width in px, used to size the masonry grid before the image loads. */
  width: number;
  /** Intrinsic height in px, used to size the masonry grid before the image loads. */
  height: number;
}

export interface GalleryCategory {
  slug: string;
  title: string;
  heroImage: string;
  secondaryHeroImage: string;
  images: GalleryImage[];
}
```

- [ ] **Step 2: Write the social config**

```ts
// man-clicks/src/app/core/config/social.config.ts
/**
 * Single source of truth for external/contact links so they can be
 * updated in one place if the brand's handle or email changes.
 */
export const SOCIAL_CONFIG = {
  instagramHandle: '@manclicksiowa',
  instagramUrl: 'https://www.instagram.com/manclicksiowa/',
  email: 'manclicksiowa@gmail.com',
  location: 'Des Moines, Iowa',
} as const;
```

- [ ] **Step 3: Verify the project still compiles**

Run: `cd man-clicks && npx tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add man-clicks/src/app/core
git commit -m "Add gallery models and social config"
```

---

## Task 5: Category data files

**Files:**
- Create: `man-clicks/src/app/data/categories/baby-shoots.data.ts`
- Create: `man-clicks/src/app/data/categories/professional-portraits.data.ts`
- Create: `man-clicks/src/app/data/categories/engagements.data.ts`
- Create: `man-clicks/src/app/data/categories/birthdays.data.ts`

**Interfaces:**
- Consumes: `GalleryImage`, `GalleryCategory` from `../../core/models/gallery.model` (Task 4).
- Produces: one `GalleryCategory` constant export per file — `BABY_SHOOTS_CATEGORY`, `PROFESSIONAL_PORTRAITS_CATEGORY`, `ENGAGEMENTS_CATEGORY`, `BIRTHDAYS_CATEGORY` — each with 10 `GalleryImage` entries whose `id`s match the placeholder file names from Task 3 (e.g. `baby-001` … `baby-010`).

- [ ] **Step 1: Write a small local helper inline in each file (not shared, to keep each category file self-contained) and the 4 data files**

```ts
// man-clicks/src/app/data/categories/baby-shoots.data.ts
import { GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

const DIMENSIONS: Array<[number, number]> = [
  [800, 1000], [1000, 750], [900, 900], [800, 1100], [1000, 700],
  [850, 950], [1000, 800], [900, 1000], [950, 750], [800, 1000],
];

function buildImages(prefix: string, label: string): GalleryImage[] {
  return DIMENSIONS.map(([width, height], i) => {
    const num = String(i + 1).padStart(3, '0');
    const src = `assets/images/${prefix === 'baby' ? 'baby' : prefix}/${prefix}-${num}.svg`;
    return {
      id: `${prefix}-${num}`,
      src,
      downloadSrc: src,
      alt: `${label} photography by Man Clicks`,
      width,
      height,
    };
  });
}

export const BABY_SHOOTS_CATEGORY: GalleryCategory = {
  slug: 'baby-shoots',
  title: 'Baby Shoots',
  heroImage: 'assets/images/baby/baby-hero-main.svg',
  secondaryHeroImage: 'assets/images/baby/baby-hero-secondary.svg',
  images: buildImages('baby', 'Baby shoot'),
};
```

```ts
// man-clicks/src/app/data/categories/professional-portraits.data.ts
import { GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

const DIMENSIONS: Array<[number, number]> = [
  [800, 1000], [1000, 750], [900, 900], [800, 1100], [1000, 700],
  [850, 950], [1000, 800], [900, 1000], [950, 750], [800, 1000],
];

function buildImages(prefix: string, label: string): GalleryImage[] {
  return DIMENSIONS.map(([width, height], i) => {
    const num = String(i + 1).padStart(3, '0');
    const src = `assets/images/${prefix}/${prefix}-${num}.svg`;
    return {
      id: `${prefix}-${num}`,
      src,
      downloadSrc: src,
      alt: `${label} photography by Man Clicks`,
      width,
      height,
    };
  });
}

export const PROFESSIONAL_PORTRAITS_CATEGORY: GalleryCategory = {
  slug: 'professional-portraits',
  title: 'Professional Portraits',
  heroImage: 'assets/images/professional/professional-hero-main.svg',
  secondaryHeroImage: 'assets/images/professional/professional-hero-secondary.svg',
  images: buildImages('professional', 'Professional portrait'),
};
```

```ts
// man-clicks/src/app/data/categories/engagements.data.ts
import { GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

const DIMENSIONS: Array<[number, number]> = [
  [800, 1000], [1000, 750], [900, 900], [800, 1100], [1000, 700],
  [850, 950], [1000, 800], [900, 1000], [950, 750], [800, 1000],
];

function buildImages(prefix: string, label: string): GalleryImage[] {
  return DIMENSIONS.map(([width, height], i) => {
    const num = String(i + 1).padStart(3, '0');
    const src = `assets/images/${prefix}/${prefix}-${num}.svg`;
    return {
      id: `${prefix}-${num}`,
      src,
      downloadSrc: src,
      alt: `${label} photography by Man Clicks`,
      width,
      height,
    };
  });
}

export const ENGAGEMENTS_CATEGORY: GalleryCategory = {
  slug: 'engagements',
  title: 'Engagements',
  heroImage: 'assets/images/engagement/engagement-hero-main.svg',
  secondaryHeroImage: 'assets/images/engagement/engagement-hero-secondary.svg',
  images: buildImages('engagement', 'Engagement'),
};
```

```ts
// man-clicks/src/app/data/categories/birthdays.data.ts
import { GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

const DIMENSIONS: Array<[number, number]> = [
  [800, 1000], [1000, 750], [900, 900], [800, 1100], [1000, 700],
  [850, 950], [1000, 800], [900, 1000], [950, 750], [800, 1000],
];

function buildImages(prefix: string, label: string): GalleryImage[] {
  return DIMENSIONS.map(([width, height], i) => {
    const num = String(i + 1).padStart(3, '0');
    const src = `assets/images/${prefix}/${prefix}-${num}.svg`;
    return {
      id: `${prefix}-${num}`,
      src,
      downloadSrc: src,
      alt: `${label} photography by Man Clicks`,
      width,
      height,
    };
  });
}

export const BIRTHDAYS_CATEGORY: GalleryCategory = {
  slug: 'birthdays',
  title: 'Birthdays',
  heroImage: 'assets/images/birthday/birthday-hero-main.svg',
  secondaryHeroImage: 'assets/images/birthday/birthday-hero-secondary.svg',
  images: buildImages('birthday', 'Birthday'),
};
```

Note: image `src` paths must exactly match the files generated in Task 3 (`assets/images/<dir>/<prefix>-<num>.svg`, `<prefix>-hero-main.svg`, `<prefix>-hero-secondary.svg`), where `dir` is `baby` / `professional` / `engagement` / `birthday`.

- [ ] **Step 2: Verify compilation**

Run: `cd man-clicks && npx tsc -p tsconfig.app.json --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add man-clicks/src/app/data/categories
git commit -m "Add per-category gallery data"
```

---

## Task 6: Gallery data aggregator with tests

**Files:**
- Create: `man-clicks/src/app/data/gallery-data.ts`
- Test: `man-clicks/src/app/data/gallery-data.spec.ts`

**Interfaces:**
- Consumes: the four category constants from Task 5; `GalleryCategory`, `GalleryImage` from Task 4.
- Produces:
  - `ALL_CATEGORIES: GalleryCategory[]`
  - `getCategory(slug: string): GalleryCategory | undefined`
  - `getAllCategorySlugs(): string[]`
  - `findImage(slug: string, photoId: string): GalleryImage | undefined`
  - `findAdjacentImage(slug: string, photoId: string, direction: 'prev' | 'next'): GalleryImage | undefined` (wraps around at the ends)

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/data/gallery-data.spec.ts
import {
  ALL_CATEGORIES,
  getCategory,
  getAllCategorySlugs,
  findImage,
  findAdjacentImage,
} from './gallery-data';

describe('gallery-data', () => {
  it('exposes exactly the 4 expected category slugs', () => {
    expect(getAllCategorySlugs().sort()).toEqual(
      ['baby-shoots', 'birthdays', 'engagements', 'professional-portraits'].sort()
    );
  });

  it('getCategory returns the matching category', () => {
    const category = getCategory('baby-shoots');
    expect(category?.title).toBe('Baby Shoots');
    expect(category?.images.length).toBe(10);
  });

  it('getCategory returns undefined for an unknown slug', () => {
    expect(getCategory('weddings')).toBeUndefined();
  });

  it('findImage returns the matching image by id', () => {
    const image = findImage('baby-shoots', 'baby-003');
    expect(image?.id).toBe('baby-003');
  });

  it('findImage returns undefined when the photo id does not belong to the category', () => {
    expect(findImage('baby-shoots', 'birthday-001')).toBeUndefined();
  });

  it('findAdjacentImage("next") returns the following image', () => {
    const next = findAdjacentImage('baby-shoots', 'baby-001', 'next');
    expect(next?.id).toBe('baby-002');
  });

  it('findAdjacentImage("prev") wraps around from the first image to the last', () => {
    const prev = findAdjacentImage('baby-shoots', 'baby-001', 'prev');
    expect(prev?.id).toBe('baby-010');
  });

  it('findAdjacentImage("next") wraps around from the last image to the first', () => {
    const next = findAdjacentImage('baby-shoots', 'baby-010', 'next');
    expect(next?.id).toBe('baby-001');
  });

  it('ALL_CATEGORIES contains all 4 categories', () => {
    expect(ALL_CATEGORIES.length).toBe(4);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-data.spec.ts'`
Expected: FAIL — `gallery-data` module (or its exports) not found.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/data/gallery-data.ts
import { GalleryCategory, GalleryImage } from '../core/models/gallery.model';
import { BABY_SHOOTS_CATEGORY } from './categories/baby-shoots.data';
import { PROFESSIONAL_PORTRAITS_CATEGORY } from './categories/professional-portraits.data';
import { ENGAGEMENTS_CATEGORY } from './categories/engagements.data';
import { BIRTHDAYS_CATEGORY } from './categories/birthdays.data';

/**
 * Single list of every gallery category. To add a future category (e.g.
 * Weddings), create its data file under `./categories/` and add it here —
 * no other file needs to change; routes are generated from this list.
 */
export const ALL_CATEGORIES: GalleryCategory[] = [
  BABY_SHOOTS_CATEGORY,
  PROFESSIONAL_PORTRAITS_CATEGORY,
  ENGAGEMENTS_CATEGORY,
  BIRTHDAYS_CATEGORY,
];

const CATEGORY_BY_SLUG = new Map<string, GalleryCategory>(
  ALL_CATEGORIES.map((category) => [category.slug, category])
);

export function getCategory(slug: string): GalleryCategory | undefined {
  return CATEGORY_BY_SLUG.get(slug);
}

export function getAllCategorySlugs(): string[] {
  return ALL_CATEGORIES.map((category) => category.slug);
}

export function findImage(slug: string, photoId: string): GalleryImage | undefined {
  return getCategory(slug)?.images.find((image) => image.id === photoId);
}

export function findAdjacentImage(
  slug: string,
  photoId: string,
  direction: 'prev' | 'next'
): GalleryImage | undefined {
  const category = getCategory(slug);
  if (!category) {
    return undefined;
  }
  const index = category.images.findIndex((image) => image.id === photoId);
  if (index === -1) {
    return undefined;
  }
  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (index + delta + category.images.length) % category.images.length;
  return category.images[nextIndex];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-data.spec.ts'`
Expected: PASS, all 8 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/data/gallery-data.ts man-clicks/src/app/data/gallery-data.spec.ts
git commit -m "Add gallery data aggregator with lookup helpers and tests"
```

---

## Task 7: LikesService with tests

**Files:**
- Create: `man-clicks/src/app/core/services/likes.service.ts`
- Test: `man-clicks/src/app/core/services/likes.service.spec.ts`

**Interfaces:**
- Produces: `LikesService` (providedIn: 'root') with:
  - `isLiked(photoId: string): boolean`
  - `toggleLike(photoId: string): void`
  - `likedIds: Signal<ReadonlySet<string>>` (readonly signal, for reactive templates)
- Consumes: `localStorage` (browser global).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/core/services/likes.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LikesService } from './likes.service';

const STORAGE_KEY = 'man-clicks:likes';

describe('LikesService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  it('starts with no liked images', () => {
    const service = TestBed.inject(LikesService);
    expect(service.isLiked('baby-001')).toBeFalse();
  });

  it('toggleLike marks an image as liked', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-001');
    expect(service.isLiked('baby-001')).toBeTrue();
  });

  it('toggleLike unlikes an already-liked image', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-001');
    service.toggleLike('baby-001');
    expect(service.isLiked('baby-001')).toBeFalse();
  });

  it('persists liked ids to localStorage', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-002');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toContain('baby-002');
  });

  it('restores liked ids from localStorage on a fresh instance', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['baby-003']));
    const service = TestBed.inject(LikesService);
    expect(service.isLiked('baby-003')).toBeTrue();
  });

  it('exposes likedIds as a readable signal', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-004');
    expect(service.likedIds().has('baby-004')).toBeTrue();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/likes.service.spec.ts'`
Expected: FAIL — cannot find module `./likes.service`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/core/services/likes.service.ts
import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'man-clicks:likes';

function readStoredIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

/**
 * Frontend-only "likes" persisted per-browser via localStorage. There is
 * no backend and no shared/global like count — this only remembers what
 * this browser has liked.
 */
@Injectable({ providedIn: 'root' })
export class LikesService {
  private readonly liked = signal<ReadonlySet<string>>(readStoredIds());

  readonly likedIds = this.liked.asReadonly();

  isLiked(photoId: string): boolean {
    return this.liked().has(photoId);
  }

  toggleLike(photoId: string): void {
    const next = new Set(this.liked());
    if (next.has(photoId)) {
      next.delete(photoId);
    } else {
      next.add(photoId);
    }
    this.liked.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/likes.service.spec.ts'`
Expected: PASS, all 6 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/core/services/likes.service.ts man-clicks/src/app/core/services/likes.service.spec.ts
git commit -m "Add LikesService backed by localStorage"
```

---

## Task 8: ShareService with tests

**Files:**
- Create: `man-clicks/src/app/core/services/share.service.ts`
- Test: `man-clicks/src/app/core/services/share.service.spec.ts`

**Interfaces:**
- Produces: `ShareService` (providedIn: 'root') with:
  - `buildPhotoUrl(slug: string, photoId: string): string` (absolute URL using `window.location.origin`)
  - `buildWhatsAppShareUrl(photoUrl: string): string`
- Consumes: `window.location.origin`.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/core/services/share.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ShareService } from './share.service';

describe('ShareService', () => {
  let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareService);
  });

  it('builds an absolute photo URL from the category slug and photo id', () => {
    const url = service.buildPhotoUrl('baby-shoots', 'baby-001');
    expect(url).toBe(`${window.location.origin}/baby-shoots/photo/baby-001`);
  });

  it('builds a WhatsApp share URL containing an encoded message and the photo URL', () => {
    const photoUrl = 'https://example.com/baby-shoots/photo/baby-001';
    const shareUrl = service.buildWhatsAppShareUrl(photoUrl);
    expect(shareUrl.startsWith('https://wa.me/?text=')).toBeTrue();
    const decoded = decodeURIComponent(shareUrl.replace('https://wa.me/?text=', ''));
    expect(decoded).toContain('Check out this photo from Man Clicks');
    expect(decoded).toContain(photoUrl);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/share.service.spec.ts'`
Expected: FAIL — cannot find module `./share.service`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/core/services/share.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareService {
  buildPhotoUrl(slug: string, photoId: string): string {
    return `${window.location.origin}/${slug}/photo/${photoId}`;
  }

  buildWhatsAppShareUrl(photoUrl: string): string {
    const message = `Check out this photo from Man Clicks:\n${photoUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/share.service.spec.ts'`
Expected: PASS, both specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/core/services/share.service.ts man-clicks/src/app/core/services/share.service.spec.ts
git commit -m "Add ShareService for photo URLs and WhatsApp share links"
```

---

## Task 9: Masonry span calculator with tests

**Files:**
- Create: `man-clicks/src/app/shared/masonry-gallery/masonry-span.ts`
- Test: `man-clicks/src/app/shared/masonry-gallery/masonry-span.spec.ts`

**Interfaces:**
- Produces: `computeRowSpan(width: number, height: number, columnWidth: number, rowHeightPx: number, rowGapPx: number): number` — a pure function used by `MasonryGalleryComponent` (Task 12) to set each image's `grid-row-end: span N`.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/masonry-gallery/masonry-span.spec.ts
import { computeRowSpan } from './masonry-span';

describe('computeRowSpan', () => {
  it('computes a larger span for a taller image at the same column width', () => {
    // Square image at 300px column width => rendered height ~300px.
    const squareSpan = computeRowSpan(900, 900, 300, 8, 16);
    // Portrait image (taller) at the same column width => rendered height ~375px.
    const portraitSpan = computeRowSpan(800, 1000, 300, 8, 16);
    expect(portraitSpan).toBeGreaterThan(squareSpan);
  });

  it('computes a smaller span for a shorter (landscape) image', () => {
    const landscapeSpan = computeRowSpan(1000, 750, 300, 8, 16);
    const squareSpan = computeRowSpan(900, 900, 300, 8, 16);
    expect(landscapeSpan).toBeLessThan(squareSpan);
  });

  it('always returns a positive integer span', () => {
    const span = computeRowSpan(1000, 700, 300, 8, 16);
    expect(Number.isInteger(span)).toBeTrue();
    expect(span).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/masonry-span.spec.ts'`
Expected: FAIL — cannot find module `./masonry-span`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/masonry-gallery/masonry-span.ts
/**
 * Computes how many implicit grid rows (each `rowHeightPx` tall, separated
 * by `rowGapPx`) an image should span so its rendered aspect ratio is
 * preserved inside a CSS Grid masonry column of width `columnWidth`.
 */
export function computeRowSpan(
  width: number,
  height: number,
  columnWidth: number,
  rowHeightPx: number,
  rowGapPx: number
): number {
  const renderedHeight = (height / width) * columnWidth;
  const span = Math.ceil((renderedHeight + rowGapPx) / (rowHeightPx + rowGapPx));
  return Math.max(span, 1);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/masonry-span.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/masonry-gallery/masonry-span.ts man-clicks/src/app/shared/masonry-gallery/masonry-span.spec.ts
git commit -m "Add pure masonry row-span calculator with tests"
```

---

## Task 10: App routes generated from category data

**Files:**
- Create: `man-clicks/src/app/pages/home/home.component.ts` (minimal placeholder shell — full implementation in Task 18)
- Create: `man-clicks/src/app/pages/gallery-page/gallery-page.component.ts` (minimal placeholder shell — full implementation in Task 19)
- Modify: `man-clicks/src/app/app.routes.ts`
- Test: `man-clicks/src/app/app.routes.spec.ts`

**Interfaces:**
- Consumes: `getAllCategorySlugs()`, `getCategory()` from `./data/gallery-data` (Task 6).
- Produces: `routes: Routes` array: `''` → Home; for every category slug, `/<slug>` and `/<slug>/photo/:photoId` both routed to `GalleryPageComponent` with `data: { slug }`.

This task creates minimal placeholder standalone components for `HomeComponent` and `GalleryPageComponent` (just enough to route to) so routing can be verified end-to-end now; Tasks 18–19 flesh out their real templates later without changing the routing contract.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/app.routes.spec.ts
import { routes } from './app.routes';
import { getAllCategorySlugs } from './data/gallery-data';

describe('app.routes', () => {
  it('routes the empty path to the home page', () => {
    const homeRoute = routes.find((r) => r.path === '');
    expect(homeRoute).toBeTruthy();
  });

  it('generates a gallery route and a photo route for every category slug', () => {
    const slugs = getAllCategorySlugs();
    slugs.forEach((slug) => {
      expect(routes.some((r) => r.path === slug)).toBeTrue();
      expect(routes.some((r) => r.path === `${slug}/photo/:photoId`)).toBeTrue();
    });
  });

  it('attaches the category slug as route data for both the gallery and photo routes', () => {
    const gallerySlugRoute = routes.find((r) => r.path === 'baby-shoots');
    const photoSlugRoute = routes.find((r) => r.path === 'baby-shoots/photo/:photoId');
    expect(gallerySlugRoute?.data?.['slug']).toBe('baby-shoots');
    expect(photoSlugRoute?.data?.['slug']).toBe('baby-shoots');
  });

  it('has exactly 1 + 2*N routes for N categories', () => {
    const slugs = getAllCategorySlugs();
    expect(routes.length).toBe(1 + slugs.length * 2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/app.routes.spec.ts'`
Expected: FAIL (route paths not present yet — `app.routes.ts` still has the CLI-generated empty `routes: Routes = []`).

- [ ] **Step 3: Create the minimal Home and GalleryPage placeholder components**

```ts
// man-clicks/src/app/pages/home/home.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<p>Home page placeholder — implemented in full in a later task.</p>`,
})
export class HomeComponent {}
```

```ts
// man-clicks/src/app/pages/gallery-page/gallery-page.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  template: `<p>Gallery page placeholder — implemented in full in a later task.</p>`,
})
export class GalleryPageComponent {}
```

- [ ] **Step 4: Write `app.routes.ts`**

```ts
// man-clicks/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { getAllCategorySlugs } from './data/gallery-data';

const categoryRoutes: Routes = getAllCategorySlugs().flatMap((slug) => [
  {
    path: slug,
    loadComponent: () =>
      import('./pages/gallery-page/gallery-page.component').then((m) => m.GalleryPageComponent),
    data: { slug },
  },
  {
    path: `${slug}/photo/:photoId`,
    loadComponent: () =>
      import('./pages/gallery-page/gallery-page.component').then((m) => m.GalleryPageComponent),
    data: { slug },
  },
]);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  ...categoryRoutes,
];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/app.routes.spec.ts'`
Expected: PASS, all 4 specs green.

- [ ] **Step 6: Commit**

```bash
git add man-clicks/src/app/app.routes.ts man-clicks/src/app/app.routes.spec.ts man-clicks/src/app/pages
git commit -m "Generate app routes from category data with placeholder pages"
```

---

## Task 11: WatermarkComponent

**Files:**
- Create: `man-clicks/src/app/shared/watermark/watermark.component.ts`
- Create: `man-clicks/src/app/shared/watermark/watermark.component.css`
- Test: `man-clicks/src/app/shared/watermark/watermark.component.spec.ts`

**Interfaces:**
- Consumes: `SOCIAL_CONFIG` from `../../core/config/social.config` (Task 4).
- Produces: `WatermarkComponent`, selector `app-watermark`, no inputs — renders a link to the Instagram profile that opens in a new tab.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/watermark/watermark.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatermarkComponent } from './watermark.component';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('WatermarkComponent', () => {
  let fixture: ComponentFixture<WatermarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatermarkComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(WatermarkComponent);
    fixture.detectChanges();
  });

  it('renders a link to the Instagram profile URL', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.href).toBe(SOCIAL_CONFIG.instagramUrl);
  });

  it('opens the link in a new tab safely', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('displays the Instagram handle as the visible watermark text', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.textContent).toContain(SOCIAL_CONFIG.instagramHandle);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/watermark.component.spec.ts'`
Expected: FAIL — cannot find module `./watermark.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/watermark/watermark.component.ts
import { Component } from '@angular/core';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

@Component({
  selector: 'app-watermark',
  standalone: true,
  templateUrl: './watermark.component.html',
  styleUrl: './watermark.component.css',
})
export class WatermarkComponent {
  readonly social = SOCIAL_CONFIG;
}
```

```html
<!-- man-clicks/src/app/shared/watermark/watermark.component.html -->
<a
  class="watermark"
  [href]="social.instagramUrl"
  target="_blank"
  rel="noopener noreferrer"
  [attr.aria-label]="'Open Man Clicks on Instagram: ' + social.instagramHandle"
>
  {{ social.instagramHandle }}
</a>
```

```css
/* man-clicks/src/app/shared/watermark/watermark.component.css */
.watermark {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  color: var(--color-white);
  text-decoration: none;
  padding: var(--space-xs) var(--space-sm);
  border: var(--border-hairline);
  border-color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
  transition: color var(--transition-base), border-color var(--transition-base);
}

.watermark:hover,
.watermark:focus-visible {
  color: var(--color-gold);
  border-color: var(--color-gold);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/watermark.component.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/watermark
git commit -m "Add WatermarkComponent linking to Instagram"
```

---

## Task 12: NavbarComponent

**Files:**
- Create: `man-clicks/src/app/shared/navbar/navbar.component.ts`
- Create: `man-clicks/src/app/shared/navbar/navbar.component.html`
- Create: `man-clicks/src/app/shared/navbar/navbar.component.css`
- Test: `man-clicks/src/app/shared/navbar/navbar.component.spec.ts`

**Interfaces:**
- Consumes: `getAllCategorySlugs`, `getCategory` from `../../data/gallery-data` (Task 6); Angular `RouterLink`, `RouterLinkActive`.
- Produces: `NavbarComponent`, selector `app-navbar`, no inputs. Exposes `navItems: { slug: string; title: string }[]` and `isMenuOpen: WritableSignal<boolean>` plus `toggleMenu()`.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/navbar/navbar.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  it('renders one nav link per gallery category', () => {
    const links = fixture.nativeElement.querySelectorAll('nav a[href^="/"]');
    expect(links.length).toBe(4);
  });

  it('renders the 4 categories in the required order', () => {
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll(
      'nav a[href^="/"]'
    );
    const titles = Array.from(links).map((a) => a.textContent?.trim());
    expect(titles).toEqual(['Baby Shoots', 'Professional Portraits', 'Engagements', 'Birthdays']);
  });

  it('starts with the mobile menu closed', () => {
    expect(fixture.componentInstance.isMenuOpen()).toBeFalse();
  });

  it('toggleMenu opens and closes the mobile menu', () => {
    const component = fixture.componentInstance;
    component.toggleMenu();
    expect(component.isMenuOpen()).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen()).toBeFalse();
  });

  it('the hamburger button has an aria-label', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.hamburger');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/navbar.component.spec.ts'`
Expected: FAIL — cannot find module `./navbar.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/navbar/navbar.component.ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { getAllCategorySlugs, getCategory } from '../../data/gallery-data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly isMenuOpen = signal(false);

  readonly navItems = getAllCategorySlugs().map((slug) => ({
    slug,
    title: getCategory(slug)!.title,
  }));

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
```

```html
<!-- man-clicks/src/app/shared/navbar/navbar.component.html -->
<header class="navbar">
  <a routerLink="/" class="brand" (click)="closeMenu()">Man Clicks</a>

  <nav class="nav-links" [class.nav-links--open]="isMenuOpen()">
    <a
      *ngFor="let item of navItems"
      [routerLink]="'/' + item.slug"
      routerLinkActive="active"
      (click)="closeMenu()"
    >
      {{ item.title }}
    </a>
  </nav>

  <button
    class="hamburger"
    type="button"
    aria-label="Toggle navigation menu"
    [attr.aria-expanded]="isMenuOpen()"
    (click)="toggleMenu()"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</header>
```

Note: this template uses `*ngFor`, so `CommonModule` must be added to the component's `imports` array. Amend Step 3's `imports` to `[RouterLink, RouterLinkActive, CommonModule]` and add `import { CommonModule } from '@angular/common';`.

```css
/* man-clicks/src/app/shared/navbar/navbar.component.css */
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: rgba(248, 243, 231, 0.92);
  backdrop-filter: blur(6px);
  border-bottom: var(--border-hairline);
}

.brand {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--color-espresso);
  letter-spacing: 0.03em;
}

.nav-links {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
}

.nav-links a {
  position: relative;
  text-decoration: none;
  color: var(--color-espresso);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  padding: var(--space-xs) 0;
}

.nav-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: var(--color-gold);
  transition: width var(--transition-base);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: var(--space-xs);
}

.hamburger span {
  width: 22px;
  height: 1.5px;
  background: var(--color-espresso);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-ivory);
    border-bottom: var(--border-hairline);
    padding: var(--space-sm) var(--space-md);
    display: none;
  }

  .nav-links--open {
    display: flex;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/navbar.component.spec.ts'`
Expected: PASS, all 5 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/navbar
git commit -m "Add responsive NavbarComponent with mobile hamburger menu"
```

---

## Task 13: FooterComponent

**Files:**
- Create: `man-clicks/src/app/shared/footer/footer.component.ts`
- Create: `man-clicks/src/app/shared/footer/footer.component.html`
- Create: `man-clicks/src/app/shared/footer/footer.component.css`
- Test: `man-clicks/src/app/shared/footer/footer.component.spec.ts`

**Interfaces:**
- Consumes: `SOCIAL_CONFIG` from `../../core/config/social.config` (Task 4).
- Produces: `FooterComponent`, selector `app-footer`, no inputs.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/footer/footer.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it('displays the brand name', () => {
    expect(fixture.nativeElement.textContent).toContain('Man Clicks');
  });

  it('displays the email as a mailto link', () => {
    const mail: HTMLAnchorElement = fixture.nativeElement.querySelector(
      `a[href="mailto:${SOCIAL_CONFIG.email}"]`
    );
    expect(mail).toBeTruthy();
  });

  it('displays the Instagram link', () => {
    const insta: HTMLAnchorElement = fixture.nativeElement.querySelector(
      `a[href="${SOCIAL_CONFIG.instagramUrl}"]`
    );
    expect(insta).toBeTruthy();
  });

  it('displays the location', () => {
    expect(fixture.nativeElement.textContent).toContain(SOCIAL_CONFIG.location);
  });

  it('displays a copyright line with the current year', () => {
    const year = new Date().getFullYear().toString();
    expect(fixture.nativeElement.textContent).toContain(year);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/footer.component.spec.ts'`
Expected: FAIL — cannot find module `./footer.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/footer/footer.component.ts
import { Component } from '@angular/core';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly social = SOCIAL_CONFIG;
  readonly year = new Date().getFullYear();
}
```

```html
<!-- man-clicks/src/app/shared/footer/footer.component.html -->
<footer class="footer">
  <div class="footer__brand">Man Clicks</div>
  <div class="footer__links">
    <a [href]="social.instagramUrl" target="_blank" rel="noopener noreferrer">{{ social.instagramHandle }}</a>
    <a [href]="'mailto:' + social.email">{{ social.email }}</a>
    <span>{{ social.location }}</span>
  </div>
  <div class="footer__copyright">&copy; {{ year }} Man Clicks. All rights reserved.</div>
</footer>
```

```css
/* man-clicks/src/app/shared/footer/footer.component.css */
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
  background: var(--color-espresso);
  color: var(--color-ivory);
  text-align: center;
  border-top: 1px solid var(--color-gold);
}

.footer__brand {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  letter-spacing: 0.04em;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
}

.footer__links a {
  text-decoration: none;
  color: var(--color-cream);
  transition: color var(--transition-base);
}

.footer__links a:hover,
.footer__links a:focus-visible {
  color: var(--color-gold);
}

.footer__copyright {
  font-size: 0.8rem;
  color: var(--color-taupe);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/footer.component.spec.ts'`
Expected: PASS, all 5 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/footer
git commit -m "Add FooterComponent with brand, contact links, and copyright"
```

---

## Task 14: CategoryCardComponent

**Files:**
- Create: `man-clicks/src/app/shared/category-card/category-card.component.ts`
- Create: `man-clicks/src/app/shared/category-card/category-card.component.html`
- Create: `man-clicks/src/app/shared/category-card/category-card.component.css`
- Test: `man-clicks/src/app/shared/category-card/category-card.component.spec.ts`

**Interfaces:**
- Produces: `CategoryCardComponent`, selector `app-category-card`, `@Input({ required: true }) slug!: string`, `@Input({ required: true }) title!: string`, `@Input({ required: true }) image!: string`. Renders a `routerLink` to `/<slug>`.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/category-card/category-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CategoryCardComponent);
    fixture.componentRef.setInput('slug', 'baby-shoots');
    fixture.componentRef.setInput('title', 'Baby Shoots');
    fixture.componentRef.setInput('image', 'assets/images/baby/baby-hero-main.svg');
    fixture.detectChanges();
  });

  it('renders the category title', () => {
    expect(fixture.nativeElement.textContent).toContain('Baby Shoots');
  });

  it('renders the featured image with the given src', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('assets/images/baby/baby-hero-main.svg');
  });

  it('links to the category route', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/baby-shoots');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/category-card.component.spec.ts'`
Expected: FAIL — cannot find module `./category-card.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/category-card/category-card.component.ts
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  @Input({ required: true }) slug!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) image!: string;
}
```

```html
<!-- man-clicks/src/app/shared/category-card/category-card.component.html -->
<a class="card" [routerLink]="'/' + slug">
  <img [src]="image" [alt]="title + ' photography preview'" loading="lazy" />
  <span class="card__overlay"></span>
  <span class="card__title">{{ title }}</span>
</a>
```

```css
/* man-clicks/src/app/shared/category-card/category-card.component.css */
.card {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  text-decoration: none;
  border: var(--border-hairline);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(53, 42, 31, 0.65), rgba(53, 42, 31, 0) 55%);
  opacity: 0.85;
  transition: opacity var(--transition-base);
}

.card__title {
  position: absolute;
  left: var(--space-sm);
  bottom: var(--space-sm);
  color: var(--color-white);
  font-family: var(--font-serif);
  font-size: 1.4rem;
  letter-spacing: 0.02em;
}

.card:hover img,
.card:focus-visible img {
  transform: scale(1.04);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/category-card.component.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/category-card
git commit -m "Add CategoryCardComponent with hover scale interaction"
```

---

## Task 15: ImageActionsComponent (like / download / share)

**Files:**
- Create: `man-clicks/src/app/shared/image-actions/image-actions.component.ts`
- Create: `man-clicks/src/app/shared/image-actions/image-actions.component.html`
- Create: `man-clicks/src/app/shared/image-actions/image-actions.component.css`
- Test: `man-clicks/src/app/shared/image-actions/image-actions.component.spec.ts`

**Interfaces:**
- Consumes: `LikesService` (Task 7), `ShareService` (Task 8), `GalleryImage` model (Task 4).
- Produces: `ImageActionsComponent`, selector `app-image-actions`, `@Input({ required: true }) image!: GalleryImage`, `@Input({ required: true }) categorySlug!: string`. Emits nothing (self-contained side effects via the injected services); exposes `isLiked` (computed), `onLikeClick()`, `onDownloadClick()` (returns the resolved `downloadSrc`/`fileName` used by the template's `<a download>`), `onShareClick()` (opens WhatsApp via `window.open`).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/image-actions/image-actions.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageActionsComponent } from './image-actions.component';
import { LikesService } from '../../core/services/likes.service';
import { ShareService } from '../../core/services/share.service';
import { GalleryImage } from '../../core/models/gallery.model';

const TEST_IMAGE: GalleryImage = {
  id: 'baby-001',
  src: 'assets/images/baby/baby-001.svg',
  downloadSrc: 'assets/images/baby/baby-001.svg',
  alt: 'Baby shoot photography by Man Clicks',
  width: 800,
  height: 1000,
};

describe('ImageActionsComponent', () => {
  let fixture: ComponentFixture<ImageActionsComponent>;
  let likesService: LikesService;

  beforeEach(async () => {
    localStorage.removeItem('man-clicks:likes');
    await TestBed.configureTestingModule({
      imports: [ImageActionsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ImageActionsComponent);
    fixture.componentRef.setInput('image', TEST_IMAGE);
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
    likesService = TestBed.inject(LikesService);
  });

  it('renders like, download, and share buttons', () => {
    expect(fixture.nativeElement.querySelector('button.like')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a.download')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button.share')).toBeTruthy();
  });

  it('the download link points at the image downloadSrc', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.download');
    expect(link.getAttribute('href')).toBe(TEST_IMAGE.downloadSrc);
    expect(link.getAttribute('download')).toBeTruthy();
  });

  it('clicking like toggles the liked state via LikesService', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.like');
    expect(likesService.isLiked('baby-001')).toBeFalse();
    button.click();
    expect(likesService.isLiked('baby-001')).toBeTrue();
  });

  it('clicking share opens a WhatsApp URL for this image', () => {
    const shareService = TestBed.inject(ShareService);
    spyOn(window, 'open');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.share');
    button.click();
    const expectedPhotoUrl = shareService.buildPhotoUrl('baby-shoots', 'baby-001');
    const expectedShareUrl = shareService.buildWhatsAppShareUrl(expectedPhotoUrl);
    expect(window.open).toHaveBeenCalledWith(expectedShareUrl, '_blank', 'noopener,noreferrer');
  });

  it('all three action buttons have accessible labels', () => {
    const like: HTMLButtonElement = fixture.nativeElement.querySelector('button.like');
    const share: HTMLButtonElement = fixture.nativeElement.querySelector('button.share');
    const download: HTMLAnchorElement = fixture.nativeElement.querySelector('a.download');
    expect(like.getAttribute('aria-label')).toBeTruthy();
    expect(share.getAttribute('aria-label')).toBeTruthy();
    expect(download.getAttribute('aria-label')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/image-actions.component.spec.ts'`
Expected: FAIL — cannot find module `./image-actions.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/image-actions/image-actions.component.ts
import { Component, Input, computed } from '@angular/core';
import { LikesService } from '../../core/services/likes.service';
import { ShareService } from '../../core/services/share.service';
import { GalleryImage } from '../../core/models/gallery.model';

@Component({
  selector: 'app-image-actions',
  standalone: true,
  templateUrl: './image-actions.component.html',
  styleUrl: './image-actions.component.css',
})
export class ImageActionsComponent {
  @Input({ required: true }) image!: GalleryImage;
  @Input({ required: true }) categorySlug!: string;

  constructor(private readonly likes: LikesService, private readonly share: ShareService) {}

  readonly isLiked = computed(() => this.likes.likedIds().has(this.image?.id));

  onLikeClick(): void {
    this.likes.toggleLike(this.image.id);
  }

  onShareClick(): void {
    const photoUrl = this.share.buildPhotoUrl(this.categorySlug, this.image.id);
    const shareUrl = this.share.buildWhatsAppShareUrl(photoUrl);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}
```

```html
<!-- man-clicks/src/app/shared/image-actions/image-actions.component.html -->
<div class="image-actions">
  <button
    type="button"
    class="like"
    [class.like--active]="isLiked()"
    [attr.aria-pressed]="isLiked()"
    [attr.aria-label]="(isLiked() ? 'Unlike' : 'Like') + ' this photo'"
    (click)="onLikeClick()"
  >
    &hearts;
  </button>

  <a
    class="download"
    [href]="image.downloadSrc"
    [download]="image.id"
    [attr.aria-label]="'Download this photo'"
  >
    &#8681;
  </a>

  <button
    type="button"
    class="share"
    aria-label="Share this photo on WhatsApp"
    (click)="onShareClick()"
  >
    &#8599;
  </button>
</div>
```

```css
/* man-clicks/src/app/shared/image-actions/image-actions.component.css */
.image-actions {
  display: flex;
  gap: var(--space-xs);
}

.image-actions button,
.image-actions a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(248, 243, 231, 0.9);
  border: var(--border-hairline);
  border-radius: 50%;
  color: var(--color-espresso);
  text-decoration: none;
  transition: background var(--transition-base), color var(--transition-base), transform var(--transition-base);
}

.image-actions button:hover,
.image-actions a:hover,
.image-actions button:focus-visible,
.image-actions a:focus-visible {
  background: var(--color-gold);
  color: var(--color-white);
  transform: scale(1.05);
}

.like--active {
  color: var(--color-gold);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/image-actions.component.spec.ts'`
Expected: PASS, all 5 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/image-actions
git commit -m "Add ImageActionsComponent for like, download, and WhatsApp share"
```

---

## Task 16: MasonryGalleryComponent

**Files:**
- Create: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.ts`
- Create: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.html`
- Create: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.css`
- Test: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.spec.ts`

**Interfaces:**
- Consumes: `computeRowSpan` from `./masonry-span` (Task 9); `ImageActionsComponent` (Task 15); `GalleryImage` model (Task 4).
- Produces: `MasonryGalleryComponent`, selector `app-masonry-gallery`, `@Input({ required: true }) images!: GalleryImage[]`, `@Input({ required: true }) categorySlug!: string`, `@Output() imageSelected = new EventEmitter<string>()` (emits the clicked image's id; `GalleryPageComponent` in Task 19 uses this to navigate to `photo/:photoId`).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasonryGalleryComponent } from './masonry-gallery.component';
import { GalleryImage } from '../../core/models/gallery.model';

function makeImages(count: number): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `baby-${String(i + 1).padStart(3, '0')}`,
    src: `assets/images/baby/baby-${String(i + 1).padStart(3, '0')}.svg`,
    downloadSrc: `assets/images/baby/baby-${String(i + 1).padStart(3, '0')}.svg`,
    alt: 'Baby shoot photography by Man Clicks',
    width: 800,
    height: 1000 + i * 10,
  }));
}

describe('MasonryGalleryComponent', () => {
  let fixture: ComponentFixture<MasonryGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasonryGalleryComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MasonryGalleryComponent);
    fixture.componentRef.setInput('images', makeImages(5));
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
  });

  it('renders one figure per image', () => {
    const figures = fixture.nativeElement.querySelectorAll('figure');
    expect(figures.length).toBe(5);
  });

  it('renders no caption text under any image', () => {
    const figcaptions = fixture.nativeElement.querySelectorAll('figcaption');
    expect(figcaptions.length).toBe(0);
  });

  it('emits imageSelected with the clicked image id', () => {
    const emitted: string[] = [];
    fixture.componentInstance.imageSelected.subscribe((id: string) => emitted.push(id));
    const firstImageButton: HTMLElement = fixture.nativeElement.querySelector(
      'figure button.gallery-image-trigger'
    );
    firstImageButton.click();
    expect(emitted).toEqual(['baby-001']);
  });

  it('renders an ImageActionsComponent for every image', () => {
    const actions = fixture.nativeElement.querySelectorAll('app-image-actions');
    expect(actions.length).toBe(5);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/masonry-gallery.component.spec.ts'`
Expected: FAIL — cannot find module `./masonry-gallery.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleryImage } from '../../core/models/gallery.model';
import { ImageActionsComponent } from '../image-actions/image-actions.component';
import { computeRowSpan } from './masonry-span';

const ROW_HEIGHT_PX = 8;
const ROW_GAP_PX = 16;
// Approximate column width used for the initial span estimate; refined
// per-breakpoint isn't necessary because the aspect ratio (not absolute
// size) is what the span formula preserves.
const ASSUMED_COLUMN_WIDTH_PX = 320;

@Component({
  selector: 'app-masonry-gallery',
  standalone: true,
  imports: [CommonModule, ImageActionsComponent],
  templateUrl: './masonry-gallery.component.html',
  styleUrl: './masonry-gallery.component.css',
})
export class MasonryGalleryComponent {
  @Input({ required: true }) images!: GalleryImage[];
  @Input({ required: true }) categorySlug!: string;
  @Output() imageSelected = new EventEmitter<string>();

  rowSpanFor(image: GalleryImage): number {
    return computeRowSpan(image.width, image.height, ASSUMED_COLUMN_WIDTH_PX, ROW_HEIGHT_PX, ROW_GAP_PX);
  }

  readonly rowHeightPx = ROW_HEIGHT_PX;

  onImageClick(imageId: string): void {
    this.imageSelected.emit(imageId);
  }
}
```

```html
<!-- man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.html -->
<div class="masonry" [style.--row-height.px]="rowHeightPx">
  <figure
    *ngFor="let image of images"
    class="masonry__item"
    [style.grid-row-end]="'span ' + rowSpanFor(image)"
  >
    <button
      type="button"
      class="gallery-image-trigger"
      [attr.aria-label]="'Open ' + image.alt + ' in fullscreen'"
      (click)="onImageClick(image.id)"
    >
      <img [src]="image.src" [alt]="image.alt" loading="lazy" />
    </button>
    <div class="masonry__actions">
      <app-image-actions [image]="image" [categorySlug]="categorySlug"></app-image-actions>
    </div>
  </figure>
</div>
```

```css
/* man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.css */
.masonry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: var(--row-height, 8px);
  gap: var(--space-sm);
  padding: var(--space-md);
}

@media (max-width: 480px) {
  .masonry {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 640px) {
  .masonry {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .masonry {
    grid-template-columns: repeat(4, 1fr);
  }
}

.masonry__item {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: var(--border-hairline);
}

.gallery-image-trigger {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: none;
}

.gallery-image-trigger img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.masonry__item:hover .gallery-image-trigger img,
.gallery-image-trigger:focus-visible img {
  transform: scale(1.03);
}

.masonry__actions {
  position: absolute;
  right: var(--space-xs);
  bottom: var(--space-xs);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.masonry__item:hover .masonry__actions,
.masonry__item:focus-within .masonry__actions {
  opacity: 1;
  pointer-events: auto;
}

@media (hover: none) {
  /* Touch devices: show actions once the figure has been tapped/focused. */
  .masonry__actions {
    opacity: 1;
    pointer-events: auto;
    position: static;
    padding: var(--space-xs);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/masonry-gallery.component.spec.ts'`
Expected: PASS, all 4 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/masonry-gallery
git commit -m "Add responsive CSS Grid masonry gallery component"
```

---

## Task 17: ImageLightboxComponent

**Files:**
- Create: `man-clicks/src/app/shared/image-lightbox/image-lightbox.component.ts`
- Create: `man-clicks/src/app/shared/image-lightbox/image-lightbox.component.html`
- Create: `man-clicks/src/app/shared/image-lightbox/image-lightbox.component.css`
- Test: `man-clicks/src/app/shared/image-lightbox/image-lightbox.component.spec.ts`

**Interfaces:**
- Consumes: `ImageActionsComponent` (Task 15); `GalleryImage` model (Task 4).
- Produces: `ImageLightboxComponent`, selector `app-image-lightbox`, `@Input({ required: true }) image!: GalleryImage`, `@Input({ required: true }) categorySlug!: string`, `@Output() closeRequested = new EventEmitter<void>()`, `@Output() previousRequested = new EventEmitter<void>()`, `@Output() nextRequested = new EventEmitter<void>()`. Listens for `Escape`/`ArrowLeft`/`ArrowRight` keydown and basic touch swipe.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/image-lightbox/image-lightbox.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageLightboxComponent } from './image-lightbox.component';
import { GalleryImage } from '../../core/models/gallery.model';

const TEST_IMAGE: GalleryImage = {
  id: 'baby-002',
  src: 'assets/images/baby/baby-002.svg',
  downloadSrc: 'assets/images/baby/baby-002.svg',
  alt: 'Baby shoot photography by Man Clicks',
  width: 1000,
  height: 750,
};

describe('ImageLightboxComponent', () => {
  let fixture: ComponentFixture<ImageLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLightboxComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ImageLightboxComponent);
    fixture.componentRef.setInput('image', TEST_IMAGE);
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
  });

  it('renders the full-size image', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img.lightbox-image');
    expect(img.src).toContain(TEST_IMAGE.src);
  });

  it('clicking the back button emits closeRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.closeRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.back') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('clicking next emits nextRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.nextRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.next') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('clicking previous emits previousRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.previousRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.prev') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('Escape key emits closeRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.closeRequested.subscribe(() => emitted.push(undefined));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted.length).toBe(1);
  });

  it('ArrowRight key emits nextRequested, ArrowLeft emits previousRequested', () => {
    const nextEmitted: void[] = [];
    const prevEmitted: void[] = [];
    fixture.componentInstance.nextRequested.subscribe(() => nextEmitted.push(undefined));
    fixture.componentInstance.previousRequested.subscribe(() => prevEmitted.push(undefined));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(nextEmitted.length).toBe(1);
    expect(prevEmitted.length).toBe(1);
  });

  it('renders an ImageActionsComponent for the current image', () => {
    expect(fixture.nativeElement.querySelector('app-image-actions')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/image-lightbox.component.spec.ts'`
Expected: FAIL — cannot find module `./image-lightbox.component`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/image-lightbox/image-lightbox.component.ts
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GalleryImage } from '../../core/models/gallery.model';
import { ImageActionsComponent } from '../image-actions/image-actions.component';

const SWIPE_THRESHOLD_PX = 50;

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [ImageActionsComponent],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.css',
})
export class ImageLightboxComponent {
  @Input({ required: true }) image!: GalleryImage;
  @Input({ required: true }) categorySlug!: string;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() previousRequested = new EventEmitter<void>();
  @Output() nextRequested = new EventEmitter<void>();

  private touchStartX: number | null = null;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeRequested.emit();
    } else if (event.key === 'ArrowRight') {
      this.nextRequested.emit();
    } else if (event.key === 'ArrowLeft') {
      this.previousRequested.emit();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const deltaX = endX - this.touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX < 0) {
        this.nextRequested.emit();
      } else {
        this.previousRequested.emit();
      }
    }
    this.touchStartX = null;
  }
}
```

```html
<!-- man-clicks/src/app/shared/image-lightbox/image-lightbox.component.html -->
<div
  class="lightbox"
  role="dialog"
  aria-modal="true"
  [attr.aria-label]="image.alt"
  (touchstart)="onTouchStart($event)"
  (touchend)="onTouchEnd($event)"
>
  <button type="button" class="back" aria-label="Close and return to gallery" (click)="closeRequested.emit()">
    &#8592;
  </button>

  <button type="button" class="prev" aria-label="Previous photo" (click)="previousRequested.emit()">
    &#10094;
  </button>

  <img class="lightbox-image" [src]="image.src" [alt]="image.alt" />

  <button type="button" class="next" aria-label="Next photo" (click)="nextRequested.emit()">
    &#10095;
  </button>

  <div class="lightbox__actions">
    <app-image-actions [image]="image" [categorySlug]="categorySlug"></app-image-actions>
  </div>
</div>
```

```css
/* man-clicks/src/app/shared/image-lightbox/image-lightbox.component.css */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(53, 42, 31, 0.94);
  animation: fade-in var(--transition-base);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-image {
  max-width: min(90vw, 1100px);
  max-height: 85vh;
  object-fit: contain;
  transition: opacity var(--transition-base);
}

.back,
.prev,
.next {
  position: absolute;
  background: rgba(248, 243, 231, 0.12);
  color: var(--color-ivory);
  border: none;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.25rem;
  transition: background var(--transition-base);
}

.back:hover, .prev:hover, .next:hover,
.back:focus-visible, .prev:focus-visible, .next:focus-visible {
  background: var(--color-gold);
}

.back {
  top: var(--space-md);
  left: var(--space-md);
}

.prev {
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
}

.next {
  right: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
}

.lightbox__actions {
  position: absolute;
  bottom: var(--space-md);
  left: 50%;
  transform: translateX(-50%);
}

@media (prefers-reduced-motion: reduce) {
  .lightbox {
    animation: none;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/image-lightbox.component.spec.ts'`
Expected: PASS, all 7 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/shared/image-lightbox
git commit -m "Add fullscreen ImageLightboxComponent with keyboard and swipe navigation"
```

---

## Task 18: HomeComponent (full implementation)

**Files:**
- Modify: `man-clicks/src/app/pages/home/home.component.ts` (replace the Task 10 placeholder)
- Create: `man-clicks/src/app/pages/home/home.component.html`
- Create: `man-clicks/src/app/pages/home/home.component.css`
- Test: `man-clicks/src/app/pages/home/home.component.spec.ts`

**Interfaces:**
- Consumes: `ALL_CATEGORIES` from `../../data/gallery-data` (Task 6); `CategoryCardComponent` (Task 14); `SOCIAL_CONFIG` (Task 4); Angular `RouterLink`.
- Produces: `HomeComponent` rendering the hero, 4 category cards, contact section, all inside the page (navbar/footer are provided globally by `AppComponent` in Task 20, not duplicated here).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/pages/home/home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { ALL_CATEGORIES } from '../../data/gallery-data';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('displays the brand tagline', () => {
    expect(fixture.nativeElement.textContent).toContain('Capturing your moments, forever.');
  });

  it('renders one category card per category', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-category-card');
    expect(cards.length).toBe(ALL_CATEGORIES.length);
  });

  it('renders the contact section heading', () => {
    expect(fixture.nativeElement.textContent).toContain("Let's Create Something Timeless");
  });

  it('renders the Instagram, email, and location in the contact section', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(SOCIAL_CONFIG.instagramHandle);
    expect(text).toContain(SOCIAL_CONFIG.location);
  });

  it('has an explore-the-portfolio call to action linking into the gallery categories', () => {
    const cta: HTMLAnchorElement = fixture.nativeElement.querySelector('a.hero-cta');
    expect(cta).toBeTruthy();
    expect(cta.getAttribute('href')).toBe(`/${ALL_CATEGORIES[0].slug}`);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/home.component.spec.ts'`
Expected: FAIL — `home.component.spec.ts` expectations fail against the Task 10 placeholder template (no `app-category-card`, no contact section text).

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/pages/home/home.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ALL_CATEGORIES } from '../../data/gallery-data';
import { SOCIAL_CONFIG } from '../../core/config/social.config';
import { CategoryCardComponent } from '../../shared/category-card/category-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly categories = ALL_CATEGORIES;
  readonly social = SOCIAL_CONFIG;
}
```

```html
<!-- man-clicks/src/app/pages/home/home.component.html -->
<section class="hero">
  <div class="hero__content">
    <h1>Man Clicks</h1>
    <p class="hero__tagline">Capturing your moments, forever.</p>
    <a class="hero-cta" [routerLink]="'/' + categories[0].slug">Explore the Portfolio</a>
  </div>
</section>

<section class="categories">
  <app-category-card
    *ngFor="let category of categories"
    [slug]="category.slug"
    [title]="category.title"
    [image]="category.heroImage"
  ></app-category-card>
</section>

<section class="contact">
  <h2>Let's Create Something Timeless</h2>
  <p>Portraits, celebrations, and moments worth remembering.</p>
  <div class="contact__links">
    <a [href]="social.instagramUrl" target="_blank" rel="noopener noreferrer">{{ social.instagramHandle }}</a>
    <a [href]="'mailto:' + social.email">{{ social.email }}</a>
  </div>
  <p class="contact__location">{{ social.location }}</p>
</section>
```

```css
/* man-clicks/src/app/pages/home/home.component.css */
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(160deg, var(--color-cream), var(--color-ivory));
  padding: var(--space-md);
}

.hero__content h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: var(--color-espresso);
}

.hero__tagline {
  font-size: 1.2rem;
  color: var(--color-taupe);
  margin-bottom: var(--space-md);
}

.hero-cta {
  display: inline-block;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-gold);
  color: var(--color-espresso);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: background var(--transition-base), color var(--transition-base);
}

.hero-cta:hover,
.hero-cta:focus-visible {
  background: var(--color-gold);
  color: var(--color-white);
}

.categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
}

@media (min-width: 900px) {
  .categories {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md);
  }
}

.contact {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  background: var(--color-cream);
}

.contact__links {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.contact__links a {
  text-decoration: none;
  color: var(--color-espresso);
  border-bottom: 1px solid var(--color-gold);
  padding-bottom: 2px;
}

.contact__location {
  color: var(--color-taupe);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/home.component.spec.ts'`
Expected: PASS, all 5 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/pages/home
git commit -m "Implement HomeComponent hero, category cards, and contact section"
```

---

## Task 19: GalleryPageComponent (full implementation)

**Files:**
- Modify: `man-clicks/src/app/pages/gallery-page/gallery-page.component.ts` (replace the Task 10 placeholder)
- Create: `man-clicks/src/app/pages/gallery-page/gallery-page.component.html`
- Create: `man-clicks/src/app/pages/gallery-page/gallery-page.component.css`
- Test: `man-clicks/src/app/pages/gallery-page/gallery-page.component.spec.ts`

**Interfaces:**
- Consumes: `getCategory`, `findImage`, `findAdjacentImage` from `../../data/gallery-data` (Task 6); `WatermarkComponent` (Task 11); `MasonryGalleryComponent` (Task 16, emits `imageSelected`); `ImageLightboxComponent` (Task 17); Angular `ActivatedRoute`, `Router`.
- Produces: `GalleryPageComponent` reading `route.data['slug']` and `route.snapshot.paramMap.get('photoId')`, re-evaluating on `ActivatedRoute.paramMap` changes (same route reused across `photo/:photoId` transitions per the routing design). Navigates via `router.navigate(['/', slug, 'photo', photoId])` / `router.navigate(['/', slug])` to open/close the lightbox while staying on the same route tree (preserves scroll).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/pages/gallery-page/gallery-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { GalleryPageComponent } from './gallery-page.component';
import { getCategory } from '../../data/gallery-data';

describe('GalleryPageComponent', () => {
  let fixture: ComponentFixture<GalleryPageComponent>;
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  function setup(initialPhotoId: string | null) {
    paramMapSubject = new BehaviorSubject(
      convertToParamMap(initialPhotoId ? { photoId: initialPhotoId } : {})
    );

    TestBed.configureTestingModule({
      imports: [GalleryPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { slug: 'baby-shoots' } },
            data: new BehaviorSubject({ slug: 'baby-shoots' }),
            paramMap: paramMapSubject,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryPageComponent);
    fixture.detectChanges();
  }

  it('renders the category hero title and hero images', () => {
    setup(null);
    const category = getCategory('baby-shoots')!;
    expect(fixture.nativeElement.textContent).toContain(category.title);
    const heroImg: HTMLImageElement = fixture.nativeElement.querySelector('.hero-preview img.hero-main');
    expect(heroImg.getAttribute('src')).toBe(category.heroImage);
  });

  it('does not show the lightbox when there is no photoId in the route', () => {
    setup(null);
    expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeFalsy();
  });

  it('shows the lightbox with the correct image when photoId is present', () => {
    setup('baby-002');
    fixture.detectChanges();
    const lightboxImg: HTMLImageElement = fixture.nativeElement.querySelector(
      'app-image-lightbox img.lightbox-image'
    );
    expect(lightboxImg.getAttribute('src')).toBe('assets/images/baby/baby-002.svg');
  });

  it('renders the masonry gallery with all of the category images', () => {
    setup(null);
    const figures = fixture.nativeElement.querySelectorAll('app-masonry-gallery figure');
    expect(figures.length).toBe(getCategory('baby-shoots')!.images.length);
  });

  it('navigates to the photo route when the masonry gallery emits imageSelected', () => {
    setup(null);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onImageSelected('baby-003');
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'photo', 'baby-003']);
  });

  it('navigates back to the plain category route when the lightbox requests close', () => {
    setup('baby-002');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxClose();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots']);
  });

  it('navigates to the next image id when the lightbox requests next', () => {
    setup('baby-002');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxNext();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'photo', 'baby-003']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-page.component.spec.ts'`
Expected: FAIL against the Task 10 placeholder template (no hero preview, no masonry gallery, no lightbox wiring, `onImageSelected`/`onLightboxClose`/`onLightboxNext` don't exist).

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/pages/gallery-page/gallery-page.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { findAdjacentImage, findImage, getCategory } from '../../data/gallery-data';
import { GalleryCategory } from '../../core/models/gallery.model';
import { WatermarkComponent } from '../../shared/watermark/watermark.component';
import { MasonryGalleryComponent } from '../../shared/masonry-gallery/masonry-gallery.component';
import { ImageLightboxComponent } from '../../shared/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, WatermarkComponent, MasonryGalleryComponent, ImageLightboxComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css',
})
export class GalleryPageComponent implements OnInit {
  category!: GalleryCategory;
  private slug!: string;

  private readonly activePhotoId = signal<string | null>(null);

  readonly activeImage = computed(() => {
    const photoId = this.activePhotoId();
    return photoId ? findImage(this.slug, photoId) ?? null : null;
  });

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.data['slug'];
    this.category = getCategory(this.slug)!;
    this.activePhotoId.set(this.route.snapshot.paramMap.get('photoId'));
    this.route.paramMap.subscribe((paramMap) => {
      this.activePhotoId.set(paramMap.get('photoId'));
    });
  }

  scrollToGallery(): void {
    document.getElementById('full-gallery')?.scrollIntoView({ behavior: 'smooth' });
  }

  onImageSelected(photoId: string): void {
    this.router.navigate(['/', this.slug, 'photo', photoId]);
  }

  onLightboxClose(): void {
    this.router.navigate(['/', this.slug]);
  }

  onLightboxNext(): void {
    const current = this.activePhotoId();
    if (!current) {
      return;
    }
    const next = findAdjacentImage(this.slug, current, 'next');
    if (next) {
      this.router.navigate(['/', this.slug, 'photo', next.id]);
    }
  }

  onLightboxPrevious(): void {
    const current = this.activePhotoId();
    if (!current) {
      return;
    }
    const prev = findAdjacentImage(this.slug, current, 'prev');
    if (prev) {
      this.router.navigate(['/', this.slug, 'photo', prev.id]);
    }
  }
}
```

```html
<!-- man-clicks/src/app/pages/gallery-page/gallery-page.component.html -->
<section class="hero-preview">
  <img class="hero-main" [src]="category.heroImage" [alt]="category.title + ' featured photograph'" />
  <img class="hero-secondary" [src]="category.secondaryHeroImage" [alt]="category.title + ' detail photograph'" />
  <h1 class="hero-preview__title">{{ category.title }}</h1>

  <div class="hero-preview__watermark">
    <app-watermark></app-watermark>
  </div>

  <button type="button" class="hero-preview__view-gallery" (click)="scrollToGallery()">
    VIEW GALLERY &darr;
  </button>
</section>

<section id="full-gallery">
  <app-masonry-gallery
    [images]="category.images"
    [categorySlug]="category.slug"
    (imageSelected)="onImageSelected($event)"
  ></app-masonry-gallery>
</section>

<app-image-lightbox
  *ngIf="activeImage() as image"
  [image]="image"
  [categorySlug]="category.slug"
  (closeRequested)="onLightboxClose()"
  (previousRequested)="onLightboxPrevious()"
  (nextRequested)="onLightboxNext()"
></app-image-lightbox>
```

```css
/* man-clicks/src/app/pages/gallery-page/gallery-page.component.css */
.hero-preview {
  position: relative;
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1fr;
  padding: var(--space-lg) var(--space-md);
  background: var(--color-espresso);
  overflow: hidden;
}

.hero-main {
  width: 100%;
  height: 60vh;
  object-fit: cover;
}

.hero-secondary {
  position: absolute;
  width: 40%;
  max-width: 320px;
  bottom: var(--space-xl);
  right: var(--space-md);
  border: 4px solid var(--color-ivory);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.hero-preview__title {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-md);
  color: var(--color-ivory);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.hero-preview__watermark {
  position: absolute;
  bottom: var(--space-md);
  left: var(--space-md);
}

.hero-preview__view-gallery {
  position: absolute;
  bottom: var(--space-md);
  right: var(--space-md);
  background: none;
  border: none;
  color: var(--color-ivory);
  letter-spacing: 0.08em;
  font-size: 0.85rem;
}

@media (max-width: 640px) {
  .hero-secondary {
    width: 55%;
    right: var(--space-sm);
    bottom: var(--space-lg);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-page.component.spec.ts'`
Expected: PASS, all 7 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/pages/gallery-page
git commit -m "Implement GalleryPageComponent hero preview, masonry gallery, and lightbox wiring"
```

---

## Task 20: App shell wiring (root AppComponent)

**Files:**
- Modify: `man-clicks/src/app/app.component.ts`
- Modify: `man-clicks/src/app/app.component.html`
- Modify: `man-clicks/src/app/app.component.spec.ts`
- Delete (if generated by `ng new`): `man-clicks/src/app/app.component.css` content replaced with minimal layout CSS

**Interfaces:**
- Consumes: `NavbarComponent` (Task 12), `FooterComponent` (Task 13), Angular `RouterOutlet`.
- Produces: root shell rendering `<app-navbar>`, `<router-outlet>`, `<app-footer>` on every route — pages themselves contain no navbar/footer markup.

- [ ] **Step 1: Update the app component test**

Read the existing `man-clicks/src/app/app.component.spec.ts` first (it's the CLI-generated default), then replace its contents:

```ts
// man-clicks/src/app/app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the navbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-navbar')).toBeTruthy();
  });

  it('renders the footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-footer')).toBeTruthy();
  });

  it('renders the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/app.component.spec.ts'`
Expected: FAIL — the CLI-default `AppComponent` template doesn't contain `app-navbar`/`app-footer` yet.

- [ ] **Step 3: Update the implementation**

Read the existing `man-clicks/src/app/app.component.ts` first, then replace its contents:

```ts
// man-clicks/src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
```

Replace `man-clicks/src/app/app.component.html`:

```html
<!-- man-clicks/src/app/app.component.html -->
<app-navbar></app-navbar>
<main>
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

Replace `man-clicks/src/app/app.component.css` (remove the CLI-generated demo styles):

```css
/* man-clicks/src/app/app.component.css */
main {
  min-height: 60vh;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/app.component.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/app.component.ts man-clicks/src/app/app.component.html man-clicks/src/app/app.component.css man-clicks/src/app/app.component.spec.ts
git commit -m "Wire root AppComponent shell with global navbar and footer"
```

---

## Task 21: Deep-link integration test

**Files:**
- Create: `man-clicks/src/app/gallery-deep-link.integration.spec.ts`

**Interfaces:**
- Consumes: `routes` (Task 10), `RouterTestingHarness` from `@angular/router/testing`.
- Verifies the end-to-end contract described in the spec: navigating directly to `/baby-shoots/photo/baby-002` loads the correct category, opens the lightbox to the correct image, and next/prev/back all work through real router navigation (not just component-level spies).

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/gallery-deep-link.integration.spec.ts
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';

describe('Gallery deep link integration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('opening /baby-shoots/photo/baby-002 directly renders the lightbox with that image', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const lightboxImg: HTMLImageElement | null = harness.routeNativeElement?.querySelector(
      'app-image-lightbox img.lightbox-image'
    ) ?? null;
    expect(lightboxImg?.getAttribute('src')).toBe('assets/images/baby/baby-002.svg');
  });

  it('clicking next from /baby-shoots/photo/baby-002 navigates to baby-003', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const nextButton = harness.routeNativeElement?.querySelector(
      'app-image-lightbox button.next'
    ) as HTMLButtonElement;
    nextButton.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/baby-shoots/photo/baby-003');
  });

  it('clicking back from the lightbox navigates to the plain category URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const backButton = harness.routeNativeElement?.querySelector(
      'app-image-lightbox button.back'
    ) as HTMLButtonElement;
    backButton.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/baby-shoots');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-deep-link.integration.spec.ts'`
Expected: FAIL if any wiring from Tasks 10/19 is incomplete (this test exercises the real route table end-to-end); if Tasks 10–20 were done correctly it may already pass — in that case skip straight to Step 4, there is no implementation step needed since this task tests existing wiring rather than introducing new production code.

- [ ] **Step 3: Fix any wiring gaps found**

If the test fails, the most likely causes are: `activePhotoId` not re-evaluating on `paramMap` changes in `GalleryPageComponent` (Task 19), or the lightbox not re-rendering when the image input changes. Fix `GalleryPageComponent` (Task 19's file) directly rather than adding new files.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/gallery-deep-link.integration.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Commit**

```bash
git add man-clicks/src/app/gallery-deep-link.integration.spec.ts
git commit -m "Add end-to-end deep-link integration test for gallery lightbox routing"
```

---

## Task 22: Scroll-reveal animation directive

**Files:**
- Create: `man-clicks/src/app/shared/scroll-reveal.directive.ts`
- Test: `man-clicks/src/app/shared/scroll-reveal.directive.spec.ts`
- Modify: `man-clicks/src/app/pages/home/home.component.ts`, `.html` (apply the directive to the categories and contact sections)
- Modify: `man-clicks/src/app/pages/gallery-page/gallery-page.component.ts`, `.html` (apply the directive to the gallery section)

**Interfaces:**
- Produces: `ScrollRevealDirective`, selector `[appScrollReveal]`, standalone. Adds a `is-visible` class to its host element the first time it intersects the viewport (via `IntersectionObserver`), then disconnects the observer. No-ops instantly (adds the class immediately, no transition) when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true.

- [ ] **Step 1: Write the failing test**

```ts
// man-clicks/src/app/shared/scroll-reveal.directive.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  standalone: true,
  imports: [ScrollRevealDirective],
  template: `<div appScrollReveal>content</div>`,
})
class HostComponent {}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let observeSpy: jasmine.Spy;
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeSpy = jasmine.createSpy('observe');
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
      observe = observeSpy;
      disconnect = jasmine.createSpy('disconnect');
    };

    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('does not have the is-visible class before intersecting', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(div.classList.contains('is-visible')).toBeFalse();
  });

  it('adds the is-visible class once IntersectionObserver reports intersection', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    intersectionCallback(
      [{ isIntersecting: true, target: div } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    expect(div.classList.contains('is-visible')).toBeTrue();
  });

  it('observes the host element on init', () => {
    expect(observeSpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/scroll-reveal.directive.spec.ts'`
Expected: FAIL — cannot find module `./scroll-reveal.directive`.

- [ ] **Step 3: Write the implementation**

```ts
// man-clicks/src/app/shared/scroll-reveal.directive.ts
import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.host.nativeElement.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.host.nativeElement.classList.add('is-visible');
          this.observer?.disconnect();
        }
      });
    });
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/scroll-reveal.directive.spec.ts'`
Expected: PASS, all 3 specs green.

- [ ] **Step 5: Apply the directive to home and gallery-page sections**

In `man-clicks/src/app/pages/home/home.component.ts`, add `ScrollRevealDirective` to the `imports` array (`import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';`). In `home.component.html`, add `appScrollReveal` to the `<section class="categories">` and `<section class="contact">` tags.

In `man-clicks/src/app/pages/gallery-page/gallery-page.component.ts`, add the same import to its `imports` array. In `gallery-page.component.html`, add `appScrollReveal` to the `<section id="full-gallery">` tag.

Add the fade-up CSS to `man-clicks/src/styles.css` (append):

```css
[appScrollReveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[appScrollReveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 6: Re-run the home and gallery-page component tests to confirm no regressions**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless --include='**/home.component.spec.ts' --include='**/gallery-page.component.spec.ts'`
Expected: PASS, all previously-passing specs still green (the directive doesn't hide content in tests because JSDOM/Karma's `IntersectionObserver` triggers `ngOnInit` but content is still present in the DOM regardless of the `is-visible` class — the specs assert `textContent`/`querySelector`, not visibility).

- [ ] **Step 7: Commit**

```bash
git add man-clicks/src/app/shared/scroll-reveal.directive.ts man-clicks/src/app/shared/scroll-reveal.directive.spec.ts man-clicks/src/app/pages/home man-clicks/src/app/pages/gallery-page man-clicks/src/styles.css
git commit -m "Add scroll-reveal fade-up animation respecting prefers-reduced-motion"
```

---

## Task 23: Full-suite build and test verification

**Files:** none created or modified — verification only.

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `cd man-clicks && npm test -- --watch=false --browsers=ChromeHeadless`
Expected: all specs across every file pass (0 failures).

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors. Note any budget warnings (see Global Constraints — default Angular CLI budgets) but treat errors, not warnings, as blocking.

- [ ] **Step 3: Serve the app and manually verify the golden path**

Run: `npm start` (leave running), then in a browser visit `http://localhost:4200/` and check:
- Home hero renders with tagline and CTA button.
- All 4 category cards navigate to their routes.
- Each category's gallery page shows the hero preview (overlapping images, title, watermark linking to Instagram in a new tab, "VIEW GALLERY ↓" smooth-scrolling down).
- The masonry gallery shows all images with no captions, hover reveals like/download/share.
- Clicking an image opens the fullscreen lightbox; prev/next/Escape/arrow keys work; back returns to the same scroll position.
- Liking an image, then refreshing the page, keeps it liked.
- Downloading an image saves the placeholder SVG file.
- Sharing opens a WhatsApp URL (`web.whatsapp.com` or the WhatsApp app) with the correct photo link and message.
- Resize the window to tablet and mobile widths: navbar collapses to hamburger, masonry gallery drops to 2/3 then 1/2 columns, hero overlap still looks intentional.

Stop the dev server (`Ctrl+C`) once verified.

- [ ] **Step 4: Commit (only if Step 3 required fixes)**

If manual verification in Step 3 required any code fixes, stage and commit them with a message describing the fix, e.g.:

```bash
git add -A
git commit -m "Fix issues found during manual golden-path verification"
```

If no fixes were needed, there is nothing to commit for this task.
