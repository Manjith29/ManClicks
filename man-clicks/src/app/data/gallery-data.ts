import { GalleryAlbum, GalleryCategory, GalleryImage } from '../core/models/gallery.model';
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

export function getAlbum(slug: string, albumSlug: string): GalleryAlbum | undefined {
  return getCategory(slug)?.albums?.find((album) => album.slug === albumSlug);
}

/**
 * Resolves the active image set for a category: the named album's images
 * when `albumSlug` is given, otherwise the category's default ("All") images.
 */
function resolveImages(slug: string, albumSlug?: string): GalleryImage[] | undefined {
  if (albumSlug) {
    return getAlbum(slug, albumSlug)?.images;
  }
  return getCategory(slug)?.images;
}

export function findImage(slug: string, photoId: string, albumSlug?: string): GalleryImage | undefined {
  return resolveImages(slug, albumSlug)?.find((image) => image.id === photoId);
}

export function findAdjacentImage(
  slug: string,
  photoId: string,
  direction: 'prev' | 'next',
  albumSlug?: string
): GalleryImage | undefined {
  const images = resolveImages(slug, albumSlug);
  if (!images) {
    return undefined;
  }
  const index = images.findIndex((image) => image.id === photoId);
  if (index === -1) {
    return undefined;
  }
  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (index + delta + images.length) % images.length;
  return images[nextIndex];
}
