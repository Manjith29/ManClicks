# Hero Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the hero section's visuals so it opens with a frosted-glass "AK" monogram badge that morphs into the "Alekya Kurapati" heading, set against a layered/spotlight background — with no content or structural changes beyond the existing name/shortRole/tagline/scroll-arrow.

**Architecture:** Purely presentational CSS/Tailwind + Angular template changes to one component (`HeroComponent`). No component logic (`hero.component.ts`) changes, no new Angular state — all sequencing is driven by CSS `animation-delay`/`animation-fill-mode: both`, exactly like the existing `letter-contract`/`reveal-rest` mechanism.

**Tech Stack:** Angular 17 standalone components, Tailwind CSS 3 (custom keyframes/animations in `tailwind.config.js`), `@lucide/angular` icons.

## Global Constraints

- No new content elements (no CTA buttons, social links, avatar, or extra badges) — visual/animation polish only, per `docs/superpowers/specs/2026-07-06-hero-redesign-design.md`.
- `personalInfo.shortRole` / `personalInfo.tagline` bindings, the scroll-to-about link, and the arrow icon must remain functionally unchanged.
- The glass badge and its shimmer must be `aria-hidden="true"` (decorative only) — the existing `sr-only` span already carries the accessible name; do not duplicate or remove it.
- Must not introduce layout shift: the heading's box must already reserve its final width/height before and after the animation (this already works today via the `sr-only` full-name span sizing the `h1`).
- Existing global `prefers-reduced-motion` rule in `src/styles.css` (collapses all animation durations to `0.001ms`) must continue to apply to all new animations without additional code — achieved automatically since it targets `*`.
- Reuse the existing `letter-contract` (0.7s ease-out, 0.9s delay) and `reveal-rest` (0.7s ease-out, 0.9s delay) animations/timings unchanged — the new badge-out animation must match this same 0.9s delay / 0.7s duration so all three stay synchronized.

---

## File Structure

- **Modify: `alekya-portfolio/tailwind.config.js`** — add three new keyframes (`badge-in`, `badge-out`, `badge-shimmer`) and their corresponding `animation` entries (`badge`, `badge-shimmer`). No existing keyframes/animations are changed.
- **Modify: `alekya-portfolio/src/app/components/hero/hero.component.html`** — replace the background shapes block (spotlight + repositioned/dimmed blobs + dialed-down masked grid) and the `h1` block (add the glass monogram badge + shimmer sweep, minor `shortRole` tracking tweak). No other sections of the file change.
- **No changes to `hero.component.ts`** — purely presentational.

---

### Task 1: Add Tailwind keyframes/animations for the glass badge

**Files:**
- Modify: `alekya-portfolio/tailwind.config.js:41-70`

**Interfaces:**
- Produces: Tailwind utility classes `animate-badge` (combines badge entrance + dissolve) and `animate-badge-shimmer`, consumed by Task 2's HTML.

- [ ] **Step 1: Add the new keyframes**

In `alekya-portfolio/tailwind.config.js`, inside `theme.extend.keyframes`, add these three entries alongside the existing ones (`float`, `fade-in-up`, `blob`, `letter-contract`, `reveal-rest`):

```js
        'badge-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'badge-out': {
          '0%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
          '100%': { opacity: '0', transform: 'scale(1.08)', filter: 'blur(6px)' },
        },
        'badge-shimmer': {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '15%': { opacity: '0.7' },
          '50%': { opacity: '0.7' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)', opacity: '0' },
        },
```

**Step 2: Add the corresponding animation entries**

In the same file, inside `theme.extend.animation`, add these two entries alongside the existing ones (`float`, `fade-in-up`, `blob`, `letter-contract`, `reveal-rest`):

```js
        badge: 'badge-in 0.5s ease-out both, badge-out 0.7s ease-out 0.9s both',
        'badge-shimmer': 'badge-shimmer 0.45s ease-in-out 0.45s both',
```

The full `theme.extend` block should read:

```js
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.97)' },
        },
        'letter-contract': {
          '0%': { letterSpacing: '0.15em' },
          '100%': { letterSpacing: 'normal' },
        },
        'reveal-rest': {
          '0%': { opacity: '0', width: '0' },
          '100%': { opacity: '1', width: 'var(--reveal-w, 6ch)' },
        },
        'badge-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'badge-out': {
          '0%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
          '100%': { opacity: '0', transform: 'scale(1.08)', filter: 'blur(6px)' },
        },
        'badge-shimmer': {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '15%': { opacity: '0.7' },
          '50%': { opacity: '0.7' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        blob: 'blob 14s infinite ease-in-out',
        'letter-contract': 'letter-contract 0.7s ease-out 0.9s both',
        'reveal-rest': 'reveal-rest 0.7s ease-out 0.9s both',
        badge: 'badge-in 0.5s ease-out both, badge-out 0.7s ease-out 0.9s both',
        'badge-shimmer': 'badge-shimmer 0.45s ease-in-out 0.45s both',
      },
```

- [ ] **Step 3: Verify Tailwind picks up the new utilities**

Run: `cd alekya-portfolio && npx tailwindcss -i ./src/styles.css -o /tmp/tw-check.css --content ./src/app/components/hero/hero.component.html`

Expected: command exits 0 with no errors (confirms `tailwind.config.js` is syntactically valid JS and loads cleanly). It's fine that `animate-badge` doesn't appear in the output yet — the HTML using it isn't written until Task 2.

- [ ] **Step 4: Commit**

```bash
git add alekya-portfolio/tailwind.config.js
git commit -m "Add glass badge keyframes and animations to Tailwind config"
```

---

### Task 2: Redesign the background (spotlight + repositioned blobs + dialed-down grid)

**Files:**
- Modify: `alekya-portfolio/src/app/components/hero/hero.component.html:6-22`

**Interfaces:**
- Consumes: existing `animate-blob` animation (unchanged, from `tailwind.config.js`).
- Produces: no new interfaces — this is a self-contained background swap inside the existing `<section>`.

- [ ] **Step 1: Replace the background shapes block**

Replace lines 6-22 (the `<!-- Animated background shapes -->` comment through its closing `</div>`) with:

```html
  <!-- Layered background: radial spotlight, corner-anchored blobs, dialed-down grid -->
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div
      class="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender-400/25 blur-3xl dark:bg-lavender-600/20"
    ></div>
    <div
      class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-lavender-300/20 blur-3xl animate-blob dark:bg-lavender-700/10"
    ></div>
    <div
      class="absolute top-0 -right-20 h-96 w-96 rounded-full bg-navy-300/20 blur-3xl animate-blob dark:bg-navy-700/10"
      style="animation-delay: 4s"
    ></div>
    <div
      class="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-lavender-200/25 blur-3xl animate-blob dark:bg-navy-800/15"
      style="animation-delay: 8s"
    ></div>
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--border))_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_75%)]"
    ></div>
  </div>
```

This keeps exactly 3 blob shapes (now corner-anchored, at ~20-25% opacity instead of 30-40%) plus the new centered spotlight, and reduces the grid from `opacity-[0.15]` to `opacity-[0.06]` with a radial mask fading it out near the center.

- [ ] **Step 2: Verify the file is well-formed Angular template**

Run: `cd alekya-portfolio && npx ng build --configuration development`

Expected: build succeeds (exit 0), output includes `Application bundle generation complete`.

- [ ] **Step 3: Commit**

```bash
git add alekya-portfolio/src/app/components/hero/hero.component.html
git commit -m "Redesign hero background with radial spotlight and corner-anchored blobs"
```

---

### Task 3: Add the glass monogram badge and shimmer over the heading

**Files:**
- Modify: `alekya-portfolio/src/app/components/hero/hero.component.html:24-53` (the `shortRole` paragraph and the `h1` block)

**Interfaces:**
- Consumes: `animate-badge` and `animate-badge-shimmer` utilities from Task 1.
- Produces: no new interfaces — final markup for the hero's text content block.

- [ ] **Step 1: Add the glass badge markup inside the `h1`, before the existing `aria-hidden` name span**

Replace the `<h1>...</h1>` block (originally lines 32-53) with:

```html
    <h1
      class="relative mt-5 animate-fade-in-up font-display text-5xl font-bold tracking-tight text-[rgb(var(--text))] sm:text-6xl md:text-7xl"
    >
      <span class="sr-only">{{ personalInfo.name }}</span>

      <!-- Glass monogram badge: shows "AK", then dissolves into the full name below -->
      <span
        class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <span
          class="relative flex animate-badge items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 px-8 py-4 shadow-lg shadow-navy-900/10 backdrop-blur-md dark:border-white/10 dark:bg-white/5"
        >
          <span
            class="pointer-events-none absolute inset-0 animate-badge-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20"
          ></span>
          <span class="relative font-display text-6xl font-bold sm:text-7xl">AK</span>
        </span>
      </span>

      <span class="inline-flex items-baseline justify-center" aria-hidden="true">
        <span class="inline-block">
          <span class="animate-letter-contract">A</span><span
            class="animate-reveal-rest inline-block overflow-hidden whitespace-nowrap align-bottom"
            style="--reveal-w: 5ch"
            >lekya</span
          >
        </span>
        <span class="inline-block w-[0.3em]"></span>
        <span class="inline-block">
          <span class="animate-letter-contract">K</span><span
            class="animate-reveal-rest inline-block overflow-hidden whitespace-nowrap align-bottom"
            style="--reveal-w: 7ch"
            >urapati</span
          >
        </span>
      </span>
    </h1>
```

Note the `h1` gained `relative` (needed so the absolutely-positioned badge wrapper positions itself against the heading, not the page), and the badge wrapper has `pointer-events-none` so it never intercepts clicks even before it fades out.

- [ ] **Step 2: Apply the minor `shortRole` tracking refinement**

In the same file, find the `shortRole` paragraph (originally lines 25-30):

```html
    <p
      class="animate-fade-in-up text-sm font-semibold uppercase tracking-[0.3em] text-lavender-600 dark:text-lavender-300"
      style="animation-delay: 1.6s"
    >
      {{ personalInfo.shortRole }}
    </p>
```

Change `tracking-[0.3em]` to `tracking-[0.35em]`:

```html
    <p
      class="animate-fade-in-up text-sm font-semibold uppercase tracking-[0.35em] text-lavender-600 dark:text-lavender-300"
      style="animation-delay: 1.6s"
    >
      {{ personalInfo.shortRole }}
    </p>
```

- [ ] **Step 3: Verify the build**

Run: `cd alekya-portfolio && npx ng build --configuration development`

Expected: build succeeds (exit 0), output includes `Application bundle generation complete`, no template errors referencing the hero component.

- [ ] **Step 4: Commit**

```bash
git add alekya-portfolio/src/app/components/hero/hero.component.html
git commit -m "Add glass monogram badge with shimmer sweep over hero heading"
```

---

### Task 4: Manual visual verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the fully assembled hero section from Tasks 1-3.

- [ ] **Step 1: Start the dev server**

Run: `cd alekya-portfolio && npm start` (run in background — it stays running)

Expected: output includes `Local: http://localhost:4200/` (or similar) with no compile errors.

- [ ] **Step 2: Load the page and take a screenshot at page load**

Use the Playwright browser tools: navigate to `http://localhost:4200/`, wait ~200ms, take a screenshot.

Expected: the glass "AK" monogram badge is visible, centered where the heading will be, with a soft frosted/translucent look over the spotlight background; the three blobs are visible near the corners, faint and blurred; the grid is barely visible except near the section edges.

- [ ] **Step 3: Take a screenshot ~1 second after load**

Wait an additional ~1000ms from page load, take another screenshot.

Expected: the glass badge has dissolved away; "Alekya Kurapati" is fully readable in its place with no layout shift (heading occupies the same box as in Step 2); `shortRole` and `tagline` are visible below it.

- [ ] **Step 4: Toggle dark mode and repeat**

Click the theme toggle button in the navbar (or use `theme.cyclePreference()` via the UI), reload, and repeat Steps 2-3.

Expected: same behavior, with the badge's translucent fill/border and spotlight glow adapted to the dark palette (`bg-white/5`, `border-white/10`, `bg-lavender-600/20` spotlight) — text and badge remain legible against the dark background.

- [ ] **Step 5: Confirm no layout shift and no console errors**

While on the page (either theme), open the browser console.

Expected: no errors logged; the page does not visibly jump/reflow between the badge and heading states (confirms the `sr-only` name span is still correctly reserving the heading's box size).

- [ ] **Step 6: Stop the dev server**

Stop the background `npm start` process.

---

## Self-Review Notes

- **Spec coverage:** Section 1 (background/layout) → Task 2. Section 2 (monogram badge → heading morph, including shimmer and synced timing) → Tasks 1 & 3. Section 3 (typography/sequencing/accessibility, including the `shortRole` tweak and confirming reduced-motion needs no extra work) → Task 3 Step 2 and the Global Constraints section. Implementation notes (Tailwind config additions, template changes, no `.ts` changes) → all tasks.
- **No automated test suite exists for `HeroComponent`** (no `hero.component.spec.ts`) and this is a purely presentational/animation change, so verification is build-success + manual/Playwright visual inspection (Task 4) rather than unit tests — consistent with how this component was already built (no existing spec file to extend).
- **Timing consistency double-checked:** `badge-out` (0.9s delay, 0.7s duration) matches the existing `letter-contract`/`reveal-rest` timing exactly, so the badge dissolve and the letter reveal are frame-synced without needing to touch those two existing animations.
