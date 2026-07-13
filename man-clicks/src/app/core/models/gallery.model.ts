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

export interface GalleryAlbum {
  slug: string;
  title: string;
  images: GalleryImage[];
}

export interface GalleryCategory {
  slug: string;
  title: string;
  heroImage: string;
  secondaryHeroImage: string;
  /** Default image set, shown when no album is selected (the "All" view). */
  images: GalleryImage[];
  /** Optional sub-albums nested under this category, e.g. Tonsure Ceremony under Baby Shoots. */
  albums?: GalleryAlbum[];
}
