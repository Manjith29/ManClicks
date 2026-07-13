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
