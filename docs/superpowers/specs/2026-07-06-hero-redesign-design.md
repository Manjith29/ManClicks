# Hero Section Redesign — Design Spec

Date: 2026-07-06
Component: `alekya-portfolio/src/app/components/hero/hero.component.html` (+ `tailwind.config.js`, `src/styles.css` as needed)

## Goal

Give the hero section (`#home`) a more premium, glassmorphic/layered visual treatment while keeping all existing content (name, shortRole, tagline, scroll-down arrow) unchanged. The centerpiece is the intro animation: the visitor first sees "AK" as a frosted-glass monogram badge, which then morphs into the full "Alekya Kurapati" heading, followed by the shortRole and tagline fading in.

**Out of scope**: no new content elements (no CTA buttons, social links, avatar, or badges beyond the monogram itself). This is a visual/animation redesign of the existing hero, not a content redesign.

## 1. Background & Layout

- Add a soft radial-gradient "spotlight" centered on the monogram/heading position (~40rem, heavily blurred; `lavender-400/25` light, `lavender-600/20` dark) to create a clear focal point.
- Reposition the three existing blurred blob shapes (currently near-center) toward the corners/edges of the section so they read as ambient depth framing the content rather than competing with it. Keep existing `animate-blob` motion, colors, and stagger delays; reduce opacity to ~20%.
- Reduce the background grid pattern from `opacity-[0.15]` to `opacity-[0.06]` and mask it (radial fade) so it's crisper at the edges and nearly invisible directly behind the monogram/heading.
- Layout structure (centered single column, `max-w-4xl`, `text-center`) is unchanged.

## 2. Monogram Badge → Heading Morph

- **Initial state (0–~0.9s)**: "AK" renders large (`text-6xl`–`7xl`, `font-display`, bold) inside a glass badge: rounded panel with `backdrop-blur-md`, translucent fill (`bg-white/10` light / `bg-white/5` dark), `border border-white/20`, soft drop shadow, and a subtle inset top-edge highlight for the frosted look. Badge enters with a scale+fade (`scale-95 opacity-0 → scale-100 opacity-100`).
- **Shimmer**: one diagonal light-sweep animation crosses the badge shortly after it appears (~0.4s in) — a single pass, not looping.
- **Morph (~0.9s–1.6s)**: the glass badge dissolves (fade + slight scale-up + blur-out) at the same moment the hidden rest-of-name letters ("lekya", "urapati") expand in width/opacity in place, reusing the existing `letter-contract` / `reveal-rest` keyframe mechanism, retimed so both animations are synchronized (badge dissolve and letter reveal happen together, not sequentially) — reads as "the badge breaks apart into the name."
- **End state**: plain "Alekya Kurapati" heading, identical styling to today — no residual glass effect lingers on the final heading text.
- **No layout shift**: badge is absolutely positioned over the heading's reserved box (the heading already reserves its final width via the existing `sr-only` full-name span) so nothing reflows when the badge dissolves.

## 3. Typography, Sequencing & Accessibility

- Sequence (order unchanged from today, timing refined): glass monogram + shimmer (0–0.9s) → morph to full heading (0.9–1.6s) → `shortRole` fade-up (~1.6s) → `tagline` fade-up (~1.8s) → scroll-down arrow (unchanged, `animate-float`).
- The glass badge's "AK" uses the same `font-display`/weight as the final heading so the morph feels like one continuous typographic object, not a font swap.
- `shortRole` text styling gets minor refinement (letter-spacing/color) to hold its own against the new background, but stays text-only — no new decorative elements.
- Existing global `prefers-reduced-motion` rule (in `styles.css`) already collapses all animation durations to ~0; badge, shimmer, and morph will snap directly to their end states. No additional reduced-motion handling needed.
- `personalInfo.shortRole` / `personalInfo.tagline` bindings, the scroll-to-about link, and the arrow icon are unchanged.

## Implementation Notes

- Tailwind config additions needed: new keyframes for badge entrance, shimmer sweep, and badge dissolve; retimed/renamed `letter-contract`/`reveal-rest` animation delays to sync with the new morph timing.
- `hero.component.html` changes: wrap the "AK" portion in the new glass badge markup (absolutely positioned over the heading), add the shimmer element, adjust background div (blob positions/opacity, grid opacity/mask, new radial spotlight div).
- `hero.component.ts`: no changes expected (purely presentational).
- No new Angular inputs/state — animation is CSS-only, consistent with the current implementation style.
