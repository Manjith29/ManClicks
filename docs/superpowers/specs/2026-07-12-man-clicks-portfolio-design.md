# Man Clicks Photography Portfolio — Design Spec

Date: 2026-07-12

## Overview

A new, standalone Angular application — `man-clicks/` — implementing a luxury, photography-focused
portfolio site for the "Man Clicks" brand. Entirely frontend-only (no backend). Separate project from
the existing `alekya-portfolio` and `manjith-portfolio` folders in this repo.

## Brand

- Name: Man Clicks
- Tagline: "Capturing your moments, forever."
- Instagram: @manclicksiowa (URL held in one config constant so it can change later)
- Email: manclicksiowa@gmail.com
- Location: Des Moines, Iowa

## Palette (CSS custom properties)

| Token | Hex |
|---|---|
| Warm Ivory | #F8F3E7 |
| Soft Cream | #EFE6D2 |
| Champagne Gold | #B79A5B |
| Deep Espresso | #352A1F |
| Muted Taupe | #8C7B68 |
| White | #FFFFFF |

## Tech stack

Angular 17 (matches Node 20 toolchain already in use elsewhere in this repo), standalone components,
Angular Router with lazy `loadComponent` routes, plain CSS (custom properties + flexbox/grid), no
third-party masonry/lightbox libraries.

## Folder structure

```
man-clicks/src/app/
  core/
    models/gallery.model.ts
    services/likes.service.ts
    services/share.service.ts
    config/social.config.ts
  data/
    categories/{baby-shoots,professional-portraits,engagements,birthdays}.data.ts
    gallery-data.ts
  shared/
    navbar/ footer/ category-card/ masonry-gallery/ image-actions/ image-lightbox/ watermark/
  pages/
    home/
    gallery-page/
  app.routes.ts
```

Adding a future category is a two-step change: add one `data/categories/<slug>.data.ts` file, add one
entry to `gallery-data.ts`. No route file or component edits needed — routes are generated
programmatically from the category list.

## Data model

```ts
interface GalleryImage {
  id: string;          // e.g. "baby-001", globally unique across the whole site
  src: string;          // display/preview asset
  downloadSrc: string;   // original hi-res asset (may equal src today; swappable later)
  alt: string;
  width: number;         // intrinsic dimensions, used to size masonry rows before load
  height: number;
}

interface GalleryCategory {
  slug: string;
  title: string;
  heroImage: string;
  secondaryHeroImage: string;
  images: GalleryImage[];
}
```

`gallery-data.ts` aggregates all category files into a `Map<string, GalleryCategory>` plus lookup
helpers (`getCategory(slug)`, `getAllCategories()`, `findImage(slug, photoId)`).

## Routing

For every category in `gallery-data.ts`, `app.routes.ts` generates:
- `/<slug>` → `GalleryPageComponent`, `data: { slug }`
- `/<slug>/photo/:photoId` → same `GalleryPageComponent`, `data: { slug }`

Both paths resolve to the same component instance for a given slug, so Angular reuses the instance
across the `photoId` param change instead of destroying/recreating it — the lightbox opens as an
overlay on top of the already-scrolled gallery, preserving scroll position. The back
arrow/Escape clears the photo param (via `location.back()`), closing the overlay in place.
Loading a photo URL directly still works: on init the component reads `photoId`, brings the gallery
into a scrolled state, and opens the lightbox to that image.

`''` → `HomeComponent`. All page routes are lazy-loaded via `loadComponent`.

## Pages & shared components

- **NavbarComponent** — logo placeholder + 4 category links; horizontal on desktop; hamburger menu
  plus a horizontally-scrollable category strip on mobile.
- **HomeComponent** — navbar, hero (branding + tagline + CTA), 4 `CategoryCardComponent`s (image,
  name, hover scale + underline, `routerLink` to the category), contact section (Instagram/email/
  location from `social.config.ts`), footer.
- **GalleryPageComponent** — hero preview section (large image + overlapping secondary image,
  category title, `WatermarkComponent` bottom-left, "VIEW GALLERY ↓" bottom-right that smooth-scrolls
  to the gallery section), followed by `MasonryGalleryComponent`. Reads route `data.slug` and
  optional `photoId` param to drive lightbox state.
- **MasonryGalleryComponent** — CSS Grid with small `grid-auto-rows` and a per-image computed
  `grid-row-end: span N` (derived from the image's natural aspect ratio once loaded — a small
  directive, no external library). Responsive column count via media queries: 4/3 columns desktop,
  2/3 tablet, 1/2 mobile. No captions/titles under images. Renders `ImageActionsComponent` on
  hover (desktop) / tap (mobile). Clicking an image navigates to `photo/:photoId`.
- **ImageActionsComponent** — like (heart toggle via `LikesService`), download (`<a download>` to
  `downloadSrc`), WhatsApp share (`ShareService` builds the public photo URL + message, opens
  `https://wa.me/?text=...`). Reused identically in the grid and inside the lightbox.
- **ImageLightboxComponent** — full-screen overlay: image, prev/next (arrow keys + on-screen
  controls, disabled/wrapped at gallery ends), back control (closes overlay), embedded
  `ImageActionsComponent`, swipe navigation on touch, smooth cross-fade transitions that respect
  `prefers-reduced-motion`.
- **WatermarkComponent** — renders the Man Clicks mark or `@manclicksiowa`, wrapped in an anchor to
  the Instagram profile URL (config constant), `target="_blank" rel="noopener"`.

## Likes (frontend-only persistence)

`LikesService` keeps a `Set<string>` of liked image ids in a signal, persisted to `localStorage`
under a single namespaced key. No backend, no shared/global like counts — state is per-browser only,
and survives refresh via localStorage read on service init.

## Placeholder assets

No real photography or final logo exists yet. A one-off Node script generates local placeholder
images as SVGs (varied portrait/landscape/square aspect ratios per category, palette-colored
backgrounds, small identifying label such as "Baby · 03") into `src/assets/images/<category>/`, plus
one hero pair per category and a typographic "Man Clicks" wordmark used for the logo and favicon.
Every placeholder asset and the wordmark component are clearly commented
`PLACEHOLDER — replace with real photography / final logo` so swapping later is a pure asset
replacement, not a code change.

## Styling & motion

Global CSS custom properties for the palette; an elegant serif for headings paired with a clean sans
for UI text (specific webfaces chosen and shown during implementation). Fade-up reveal on scroll via
an `IntersectionObserver` directive, hover scale 1.02–1.04 on cards/images, underline-draw animation
on nav links — all wrapped in `@media (prefers-reduced-motion: reduce)` overrides that disable/shorten
motion.

## Accessibility

Semantic HTML landmarks, keyboard-operable nav/lightbox (Tab, Enter/Space, Escape, Arrow keys),
`aria-label`s on icon-only buttons (like/download/share/prev/next/back/hamburger), meaningful `alt`
text sourced from the image config, visible focus rings, and palette contrast checked for text-on-
background combinations.

## Explicitly out of scope

- No backend/API, no shared like counts, no real booking/form backend.
- No CMS — gallery content lives in versioned TypeScript config files.
- No real photography or final logo — placeholders only, clearly marked for later replacement.
