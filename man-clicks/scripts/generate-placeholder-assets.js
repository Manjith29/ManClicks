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
