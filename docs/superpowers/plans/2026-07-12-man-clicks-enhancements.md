# Man Clicks Portfolio Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement five UI/UX enhancements: Pinterest-style masonry layout, loading spinner, navbar hide-on-scroll, logo replacement, and rename Engagements → Couple Photoshoot.

**Architecture:** Five independent feature implementations working on isolated components. Masonry gallery receives CSS layout overhaul + loading state. Navbar receives scroll listener + logo swap. Category data receives rename + import updates. No shared state changes or API modifications.

**Tech Stack:** Angular (signals, HostListener), CSS Grid → CSS Columns, native scroll events, TypeScript.

## Global Constraints

- All image assets are SVGs in `/assets/images/`
- Navbar uses `position: sticky; top: 0; z-index: 20`
- Existing CSS variables: `--space-sm`, `--space-md`, `--transition-base`, `--color-gold`, `--color-espresso`
- Gallery images have explicit `width` and `height` properties in data files (used for aspect ratio only)
- Routes auto-generate from `ALL_CATEGORIES` array

---

## Task 1: Update Masonry Gallery CSS to Columns Layout

**Files:**
- Modify: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.css`

**Interfaces:**
- Consumes: Nothing (CSS-only)
- Produces: `.masonry` uses `column-count` instead of `grid-template-columns`; `rowHeightPx` CSS variable no longer used

**Steps:**

- [ ] **Step 1: Backup and review current CSS**

Open `masonry-gallery.component.css`. Current grid setup:
```css
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
```

- [ ] **Step 2: Replace grid with columns layout**

Replace the `.masonry` ruleset:

```css
.masonry {
  display: block;
  column-count: 2;
  column-gap: var(--space-sm);
  padding: var(--space-md);
}

@media (max-width: 480px) {
  .masonry {
    column-count: 1;
  }
}

@media (min-width: 640px) {
  .masonry {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .masonry {
    column-count: 3;
  }
}
```

- [ ] **Step 3: Update .masonry__item styling for columns**

Replace the `.masonry__item` ruleset:

```css
.masonry__item {
  position: relative;
  margin: 0 0 var(--space-sm) 0;
  overflow: hidden;
  border: var(--border-hairline);
  break-inside: avoid;
  page-break-inside: avoid;
}
```

The `break-inside: avoid` prevents items from breaking across column boundaries, maintaining image integrity.

- [ ] **Step 4: Verify other styles remain unchanged**

Keep all other rules as-is:
- `.gallery-image-trigger` (button styling)
- `.gallery-image-trigger img` with `object-fit: cover`
- `.masonry__actions` (hover/focus actions)
- `.masonry-load-more` and `.load-more-btn`

These work unchanged with columns layout.

- [ ] **Step 5: Commit**

```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks
git add src/app/shared/masonry-gallery/masonry-gallery.component.css
git commit -m "feat: convert masonry gallery from grid to columns layout for Pinterest-style aspect ratios"
```

---

## Task 2: Add Loading Spinner to Masonry Gallery

**Files:**
- Modify: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.ts`
- Modify: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.html`
- Modify: `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.css`

**Interfaces:**
- Consumes: Images signal via `@Input() set images(value: GalleryImage[])`
- Produces: `isLoading: Signal<boolean>` (template can check via `isLoading()`)

**Steps:**

- [ ] **Step 1: Add loading signal to component**

Open `masonry-gallery.component.ts`. Add import for `effect` if not already imported:

```typescript
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal, effect } from '@angular/core';
```

Add loading signal after the existing `_imagesLoaded` signal:

```typescript
private readonly _imagesLoaded = signal(INITIAL_IMAGES_TO_LOAD);
readonly isLoading = signal(true);
```

Now add an `effect` that turns off loading when images render. Add this after the `rowSpanFor` method:

```typescript
constructor() {
  effect(() => {
    // Turn off loading once displayedImages emits (images are ready to render)
    if (this.displayedImages().length > 0) {
      this.isLoading.set(false);
    }
  });
}
```

- [ ] **Step 2: Update template with loading overlay**

Open `masonry-gallery.component.html`. Wrap the entire gallery in a container that shows the spinner during load:

Replace the entire content with:

```html
<div class="gallery-container">
  <!-- Loading spinner overlay -->
  <div class="gallery-loading" *ngIf="isLoading()">
    <div class="spinner"></div>
  </div>

  <!-- Gallery content -->
  <div class="masonry" [style.--row-height.px]="rowHeightPx">
    <figure
      *ngFor="let image of displayedImages()"
      class="masonry__item"
      [style.grid-row-end]="'span ' + rowSpanFor(image)"
    >
      <button
        type="button"
        class="gallery-image-trigger"
        [attr.aria-label]="'Open ' + image.alt + ' in fullscreen'"
        (click)="onImageClick(image.id)"
      >
        <img [src]="image.src" [alt]="image.alt" loading="lazy" width="320" decoding="async" />
      </button>
      <div class="masonry__actions">
        <app-image-actions [image]="image" [categorySlug]="categorySlug"></app-image-actions>
      </div>
    </figure>
  </div>

  <!-- Load more button -->
  <div *ngIf="hasMoreImages()" class="masonry-load-more">
    <button type="button" class="load-more-btn" (click)="loadMore()">
      See More ({{ remainingImagesCount() }} more)
    </button>
  </div>
</div>
```

Note: Keep the `[style.grid-row-end]` binding for now; it will be removed in a future cleanup (not breaking anything).

- [ ] **Step 3: Add spinner styles to CSS**

Open `masonry-gallery.component.css`. Add these styles at the end of the file:

```css
.gallery-container {
  position: relative;
}

.gallery-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 243, 231, 0.9);
  z-index: 10;
  animation: fadeOut 0.6s ease-out 0.3s forwards;
  pointer-events: none;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(184, 134, 11, 0.2);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

The spinner uses the gold accent color (`--color-gold`) with a subtle 0.3s delay before fading out.

- [ ] **Step 4: Test in browser**

Navigate to any gallery page. Observe:
- Spinner appears centered in gallery section
- Images load and overlay fades out after ~0.9s
- Spinner doesn't block interaction (pointer-events: none)
- No console errors

- [ ] **Step 5: Commit**

```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks
git add src/app/shared/masonry-gallery/masonry-gallery.component.ts src/app/shared/masonry-gallery/masonry-gallery.component.html src/app/shared/masonry-gallery/masonry-gallery.component.css
git commit -m "feat: add loading spinner overlay to masonry gallery"
```

---

## Task 3: Implement Navbar Hide on Scroll

**Files:**
- Modify: `man-clicks/src/app/shared/navbar/navbar.component.ts`
- Modify: `man-clicks/src/app/shared/navbar/navbar.component.html`
- Modify: `man-clicks/src/app/shared/navbar/navbar.component.css`

**Interfaces:**
- Consumes: Window scroll events
- Produces: `isNavbarHidden: Signal<boolean>` bound to navbar element via `[class.navbar--hidden]`

**Steps:**

- [ ] **Step 1: Add scroll listener to navbar component**

Open `man-clicks/src/app/shared/navbar/navbar.component.ts`. Add imports:

```typescript
import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ALL_CATEGORIES } from '../../data/gallery-data';
```

Add the signal and scroll tracking properties after existing component properties:

```typescript
readonly isNavbarHidden = signal(false);
private lastScrollY = 0;
private scrollDirection: 'up' | 'down' = 'down';
private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
```

Add the scroll listener method before the `toggleMenu()` method:

```typescript
@HostListener('window:scroll', ['$event'])
onScroll(): void {
  if (this.scrollTimeout) {
    clearTimeout(this.scrollTimeout);
  }

  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > this.lastScrollY;

  // Always show navbar at top
  if (currentScrollY < 50) {
    this.isNavbarHidden.set(false);
    this.lastScrollY = currentScrollY;
    return;
  }

  // Update direction
  if (isScrollingDown !== (this.scrollDirection === 'down')) {
    this.scrollDirection = isScrollingDown ? 'down' : 'up';
  }

  // Debounce: hide after 250ms of scrolling down
  this.scrollTimeout = setTimeout(() => {
    this.isNavbarHidden.set(this.scrollDirection === 'down');
  }, 250);

  this.lastScrollY = currentScrollY;
}
```

- [ ] **Step 2: Update template with hidden class binding**

Open `man-clicks/src/app/shared/navbar/navbar.component.html`. Update the header element to include the hidden class:

```html
<!-- man-clicks/src/app/shared/navbar/navbar.component.html -->
<header class="navbar" [class.navbar--hidden]="isNavbarHidden()">
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

- [ ] **Step 3: Add hide/show animation to CSS**

Open `man-clicks/src/app/shared/navbar/navbar.component.css`. Update the `.navbar` ruleset to add the transform transition:

```css
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
  transition: transform 300ms ease-out;
}

.navbar--hidden {
  transform: translateY(-100%);
}
```

- [ ] **Step 4: Test in browser**

Navigate to a gallery page with scrollable content. Observe:
- Scroll down: navbar slides up after ~250ms
- Scroll up: navbar slides down immediately
- At top of page (< 50px): navbar always visible
- Mobile menu stays functional
- No console errors

- [ ] **Step 5: Commit**

```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks
git add src/app/shared/navbar/navbar.component.ts src/app/shared/navbar/navbar.component.html src/app/shared/navbar/navbar.component.css
git commit -m "feat: hide navbar on scroll down, show on scroll up"
```

---

## Task 4: Replace Navbar Brand Text with Logo

**Files:**
- Modify: `man-clicks/src/app/shared/navbar/navbar.component.html`
- Modify: `man-clicks/src/app/shared/navbar/navbar.component.css`

**Interfaces:**
- Consumes: Logo asset at `assets/branding/light_mode_logo.png`
- Produces: Logo image displayed in navbar brand link

**Steps:**

- [ ] **Step 1: Update navbar template with logo image**

Open `man-clicks/src/app/shared/navbar/navbar.component.html`. Replace the `.brand` link:

Old:
```html
<a routerLink="/" class="brand" (click)="closeMenu()">Man Clicks</a>
```

New:
```html
<a routerLink="/" class="brand" (click)="closeMenu()">
  <img src="assets/branding/light_mode_logo.png" alt="Man Clicks Photography" class="brand__logo" />
</a>
```

- [ ] **Step 2: Add logo styling to CSS**

Open `man-clicks/src/app/shared/navbar/navbar.component.css`. Add the `.brand__logo` rule after the `.brand` ruleset:

```css
.brand__logo {
  height: 40px;
  width: auto;
  display: block;
}
```

The `display: block` removes any inline spacing artifacts.

- [ ] **Step 3: Test in browser**

Navigate to home page. Observe:
- Logo appears in navbar
- Logo is clickable and links to home
- Logo maintains 40px height
- Logo doesn't break on mobile/tablet
- No image 404 errors in console

- [ ] **Step 4: Commit**

```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks
git add src/app/shared/navbar/navbar.component.html src/app/shared/navbar/navbar.component.css
git commit -m "feat: replace navbar brand text with logo image"
```

---

## Task 5: Rename Engagements Category to Couple Photoshoot

**Files:**
- Rename: `man-clicks/src/app/data/categories/engagements.data.ts` → `couple-photoshoot.data.ts`
- Modify: `man-clicks/src/app/data/gallery-data.ts`

**Interfaces:**
- Consumes: Nothing (data-only changes)
- Produces: `COUPLE_PHOTOSHOOT_CATEGORY` exported from data files; routes now use `/couple-photoshoot` slug

**Steps:**

- [ ] **Step 1: Create new couple-photoshoot.data.ts file**

Create `man-clicks/src/app/data/categories/couple-photoshoot.data.ts` with this content:

```typescript
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

export const COUPLE_PHOTOSHOOT_CATEGORY: GalleryCategory = {
  slug: 'couple-photoshoot',
  title: 'Couple Photoshoot',
  heroImage: 'assets/images/couple-photoshoot/couple-photoshoot-hero-main.svg',
  secondaryHeroImage: 'assets/images/couple-photoshoot/couple-photoshoot-hero-secondary.svg',
  images: buildImages('couple-photoshoot', 'Couple Photoshoot'),
};
```

- [ ] **Step 2: Update gallery-data.ts import and export**

Open `man-clicks/src/app/data/gallery-data.ts`. Replace the engagements import:

Old:
```typescript
import { ENGAGEMENTS_CATEGORY } from './categories/engagements.data';
```

New:
```typescript
import { COUPLE_PHOTOSHOOT_CATEGORY } from './categories/couple-photoshoot.data';
```

Update the `ALL_CATEGORIES` array:

Old:
```typescript
export const ALL_CATEGORIES: GalleryCategory[] = [
  BABY_SHOOTS_CATEGORY,
  PROFESSIONAL_PORTRAITS_CATEGORY,
  ENGAGEMENTS_CATEGORY,
  BIRTHDAYS_CATEGORY,
];
```

New:
```typescript
export const ALL_CATEGORIES: GalleryCategory[] = [
  BABY_SHOOTS_CATEGORY,
  PROFESSIONAL_PORTRAITS_CATEGORY,
  COUPLE_PHOTOSHOOT_CATEGORY,
  BIRTHDAYS_CATEGORY,
];
```

- [ ] **Step 3: Rename image asset folder (optional but recommended)**

Rename the asset folder:
- Old: `man-clicks/src/assets/images/engagement/`
- New: `man-clicks/src/assets/images/couple-photoshoot/`

Also rename the hero images inside:
- `engagement-hero-main.svg` → `couple-photoshoot-hero-main.svg`
- `engagement-hero-secondary.svg` → `couple-photoshoot-hero-secondary.svg`

Rename all photo files:
- `engagement-001.svg` → `couple-photoshoot-001.svg`
- `engagement-002.svg` → `couple-photoshoot-002.svg`
- ... (all 10 files)

**If using Bash:**
```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks\src\assets\images
mv engagement couple-photoshoot
cd couple-photoshoot
# Rename hero images
mv engagement-hero-main.svg couple-photoshoot-hero-main.svg
mv engagement-hero-secondary.svg couple-photoshoot-hero-secondary.svg
# Rename numbered files
for i in {001..010}; do
  mv engagement-$i.svg couple-photoshoot-$i.svg 2>/dev/null || true
done
```

- [ ] **Step 4: Delete old engagements.data.ts file**

Remove the old file:
```bash
rm c:\Users\aleky\OneDrive\Desktop\Project\man-clicks\src\app\data\categories\engagements.data.ts
```

- [ ] **Step 5: Test in browser**

Navigate to the app. Observe:
- Home page shows "Couple Photoshoot" in category cards (not "Engagements")
- Navbar shows "Couple Photoshoot" (not "Engagements")
- Clicking "Couple Photoshoot" navigates to `/couple-photoshoot` (not `/engagements`)
- Gallery page loads and displays "Couple Photoshoot" as the title
- All images display correctly (no 404s)
- No console errors

- [ ] **Step 6: Commit**

```bash
cd c:\Users\aleky\OneDrive\Desktop\Project\man-clicks
git add src/app/data/categories/couple-photoshoot.data.ts src/app/data/gallery-data.ts
git rm src/app/data/categories/engagements.data.ts
git add -A  # Stage the folder rename
git commit -m "feat: rename engagements category to couple-photoshoot everywhere"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] Masonry gallery displays images at natural aspect ratios (no cropping)
- [ ] Column layout responsive: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Loading spinner appears and fades smoothly
- [ ] Navbar hides on scroll down, shows on scroll up
- [ ] Navbar always visible when scrollY < 50px
- [ ] Logo appears in navbar with correct sizing
- [ ] Logo is clickable (links to home)
- [ ] "Couple Photoshoot" displays in navbar and category cards
- [ ] `/couple-photoshoot` route works
- [ ] All image paths resolve correctly (no 404s)
- [ ] No console errors
- [ ] All tests pass (if applicable)

---

## Rollback Plan (if needed)

Each task is independently committed. To rollback:

```bash
# Rollback most recent task
git revert HEAD

# Rollback specific task (e.g., logo replacement)
git revert <commit-hash>

# If assets were renamed and need restoring
git checkout HEAD~N -- src/assets/images/engagement/
```

---

## Notes

- All tasks are independent and can execute in any order
- No breaking changes to component APIs or data models
- Asset renaming is recommended but not required (old filenames still work if present)
- Old bookmark URLs (`/engagements`) will 404; consider adding a redirect route in future if needed
- Loading spinner uses CSS animations (no external dependencies)
- Scroll hide logic uses Angular's built-in `@HostListener` (no external dependencies)
