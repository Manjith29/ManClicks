# Man Clicks Portfolio Enhancements — Design Spec

**Date:** 2026-07-12  
**Project:** Man Clicks Photography Portfolio  
**Status:** Design approved

---

## Overview

Five UI/UX enhancements to improve the portfolio's visual presentation and user experience:

1. Implement Pinterest-style masonry layout (variable image heights, no cropping)
2. Add centered loading spinner while gallery renders
3. Hide navbar on scroll down, show on scroll up
4. Replace navbar text "Man Clicks" with logo image
5. Rename "Engagements" category to "Couple Photoshoot" (everywhere)

---

## 1. Masonry Gallery Layout (Pinterest-style)

### Current Problem
Images are cropped to fit uniform grid heights, creating odd visual artifacts and wasting image content.

### Solution
Switch from CSS Grid with row-span calculations to **CSS Columns** layout, allowing images to display at their natural aspect ratios.

### Implementation Details

**File:** `man-clicks/src/app/shared/masonry-gallery/masonry-gallery.component.css`

Replace the grid-based layout:
- **Old:** `display: grid; grid-template-columns: repeat(N, 1fr); grid-auto-rows: var(--row-height, 8px);`
- **New:** `column-count: N; column-gap: var(--space-sm);`

Responsive breakpoints:
- Mobile (< 480px): `column-count: 1`
- Tablet (≥ 640px): `column-count: 2`
- Desktop (≥ 1024px): `column-count: 3`

**Component changes:**
- Remove `rowSpanFor()` method from `masonry-gallery.component.ts` (no longer needed)
- Remove `[style.grid-row-end]` binding from template
- Keep `object-fit: cover` on images (maintains aspect ratio within container)
- Maintain padding/gap and hover animations

### Visual Outcome
Images flow naturally down columns like Pinterest, with no uniform height constraint. Taller images naturally create visual breaks and balance.

### Trade-offs
- Images won't align horizontally (expected in columns layout)
- Reordering or filtering images will cause reflow (acceptable for pagination)

---

## 2. Loading Screen (Centered Spinner)

### Current Problem
Gallery section appears empty until images render, providing no visual feedback.

### Solution
Display a centered, animated spinner overlay that appears before images load and fades out once rendering begins.

### Implementation Details

**Files:**
- `masonry-gallery.component.ts` — Add loading state
- `masonry-gallery.component.html` — Add overlay structure
- `masonry-gallery.component.css` — Add spinner styles

**Component logic:**
- Add signal: `private readonly isLoading = signal(true)`
- Set to `false` when `displayedImages()` emits (first paint of images)
- Overlay covers entire gallery section during load

**Spinner design:**
- CSS-based animation (no external library)
- Centered vertically/horizontally
- Subtle opacity fade-out transition
- Uses existing color scheme (gold/espresso)

### Visual Outcome
User sees a loading indicator immediately, knows content is loading, and it gracefully fades as images appear.

---

## 3. Navbar Hide on Scroll

### Current Problem
Navbar is always visible (sticky), taking up space when scrolling through gallery.

### Solution
Implement scroll-direction detection: hide navbar when scrolling down, show when scrolling up or at page top.

### Implementation Details

**Files:**
- `navbar.component.ts` — Add scroll listener
- `navbar.component.html` — No changes (class binding only)
- `navbar.component.css` — Add transform styles

**Component logic:**
- Inject `HostListener` for `@window:scroll` event
- Track last scroll position and direction
- Signal: `isHidden = signal(false)`
- Always show navbar when at top (scrollY < 50px threshold)
- Debounce scroll events (250ms) to avoid excessive updates

**CSS animation:**
- `.navbar[data-hidden="true"]`: `transform: translateY(-100%)`
- Smooth transition: `transition: transform 300ms ease-out`
- Maintain `position: sticky; top: 0;` for layout

### Visual Outcome
Navbar elegantly slides up when scrolling down, slides back down when scrolling up, creating more viewing space for gallery.

---

## 4. Logo Replacement in Navbar

### Current Problem
Navbar displays text "Man Clicks" where a branded logo would be more professional.

### Solution
Replace navbar brand text with the `light_mode_logo.png` asset from `/assets/branding/`.

### Implementation Details

**File:** `navbar.component.html`

**Change:**
- Old: `<a routerLink="/" class="brand">Man Clicks</a>`
- New: `<a routerLink="/" class="brand"><img src="assets/branding/light_mode_logo.png" alt="Man Clicks Photography" class="brand__logo" /></a>`

**File:** `navbar.component.css`

Add logo sizing:
```css
.brand__logo {
  height: 40px;  /* Maintains navbar height aesthetic */
  width: auto;   /* Preserve aspect ratio */
}
```

### Visual Outcome
Professional logo displays in navbar, maintaining brand consistency and visual hierarchy.

---

## 5. Rename "Engagements" → "Couple Photoshoot"

### Current Problem
Category name "Engagements" is too generic; doesn't clearly describe couple photography.

### Solution
Rename category everywhere: title, slug, file, and image asset prefixes.

### Implementation Details

**Files to rename:**
- `man-clicks/src/app/data/categories/engagements.data.ts` → `couple-photoshoot.data.ts`

**Files to update:**

1. **couple-photoshoot.data.ts** (formerly engagements.data.ts):
   - Export name: `ENGAGEMENTS_CATEGORY` → `COUPLE_PHOTOSHOOT_CATEGORY`
   - `slug: 'engagements'` → `slug: 'couple-photoshoot'`
   - `title: 'Engagements'` → `title: 'Couple Photoshoot'`
   - Image asset prefix: `'engagement'` → `'couple-photoshoot'`
   - Image paths: `assets/images/engagement/` → `assets/images/couple-photoshoot/`
   - buildImages call: `buildImages('couple-photoshoot', 'Couple Photoshoot')`

2. **gallery-data.ts**:
   - Import: `import { COUPLE_PHOTOSHOOT_CATEGORY } from './categories/couple-photoshoot.data'`
   - Update `ALL_CATEGORIES` array with new constant

3. **navbar.component.ts**:
   - No changes (categories are pulled from `ALL_CATEGORIES`, which auto-updates)

### Note on Asset Renaming
Image files in `/assets/images/engagement/` should ideally be renamed to match:
- `engagement-001.svg` → `couple-photoshoot-001.svg`
- etc.

This ensures consistency and clarity. If not done, the `buildImages()` function will still work but reference old filenames.

### Route Impact
Old URL: `/engagements` → New URL: `/couple-photoshoot`
Old bookmarks will 404. A redirect route can be added later if needed (out of scope for this spec).

---

## Testing Checklist

- [ ] Masonry layout displays correctly on mobile (1 col), tablet (2 col), desktop (3 col)
- [ ] Images show full aspect ratios without cropping
- [ ] Loading spinner appears and fades smoothly
- [ ] Navbar hides on scroll down, shows on scroll up
- [ ] Navbar always visible at page top (scrollY < 50px)
- [ ] Logo appears in navbar with correct sizing
- [ ] "Couple Photoshoot" displays in navbar and category cards
- [ ] Navigating to `/couple-photoshoot` works
- [ ] All image paths resolve correctly
- [ ] No console errors

---

## Files Summary

### To Modify
1. `masonry-gallery.component.css` — Layout change
2. `masonry-gallery.component.ts` — Loading state
3. `masonry-gallery.component.html` — Loading overlay
4. `navbar.component.html` — Logo img element
5. `navbar.component.css` — Hide/show animation
6. `navbar.component.ts` — Scroll listener + hide logic
7. `couple-photoshoot.data.ts` (renamed) — Category config
8. `gallery-data.ts` — Import update

### To Rename
- `engagements.data.ts` → `couple-photoshoot.data.ts`

### Asset Reorganization (Optional but Recommended)
- Rename `/assets/images/engagement/` folder to `/assets/images/couple-photoshoot/`
- Rename image files from `engagement-XXX.svg` to `couple-photoshoot-XXX.svg`

---

## Notes

- All changes are isolated and don't require refactoring existing code
- Loading spinner uses CSS animations (no external dependencies)
- Scroll hide logic uses Angular's `@HostListener` (built-in)
- Column layout is widely supported in modern browsers
- No breaking changes to component APIs or data models
