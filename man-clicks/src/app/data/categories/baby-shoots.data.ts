import { GalleryAlbum, GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

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

// [fileNumber, extension, width, height] for each real photo in
// src/assets/images/baby/tonsure-ceremony/. Dimensions read directly from
// the original files so the masonry grid sizes each image correctly.
const TONSURE_CEREMONY_FILES: Array<[string, string, number, number]> = [
  ['001', 'jpg', 6000, 4000], ['002', 'jpg', 6000, 4000], ['003', 'jpg', 6000, 4000],
  ['004', 'jpg', 6000, 4000], ['005', 'jpg', 6000, 4000], ['006', 'jpg', 6000, 4000],
  ['007', 'jpg', 6000, 4000], ['008', 'jpg', 6000, 4000], ['009', 'jpg', 6000, 4000],
  ['010', 'jpg', 6000, 4000], ['011', 'jpg', 6000, 4000], ['012', 'jpg', 6000, 4000],
  ['013', 'jpg', 6000, 4000], ['014', 'jpg', 6000, 4000], ['015', 'jpg', 6000, 4000],
  ['016', 'jpg', 6000, 4000], ['017', 'jpg', 6000, 4000], ['018', 'jpg', 6000, 4000],
  ['019', 'jpg', 6000, 4000], ['020', 'jpg', 6000, 4000], ['021', 'jpg', 6000, 4000],
  ['022', 'jpg', 6000, 4000], ['023', 'jpg', 6000, 4000], ['024', 'jpg', 6000, 4000],
  ['025', 'jpg', 6000, 4000], ['026', 'jpg', 6000, 4000], ['027', 'jpg', 6000, 4000],
  ['028', 'jpg', 6000, 4000], ['029', 'jpg', 6000, 4000], ['030', 'jpg', 6000, 4000],
  ['031', 'jpg', 4000, 3278], ['032', 'jpg', 6000, 4000], ['033', 'jpg', 6000, 4000],
  ['034', 'jpg', 6000, 4000], ['035', 'jpg', 6000, 4000], ['036', 'jpg', 6000, 4000],
  ['037', 'jpg', 6000, 4000], ['038', 'jpg', 6000, 4000], ['039', 'jpg', 6000, 4000],
  ['040', 'jpg', 6000, 4000], ['041', 'jpg', 6000, 4000], ['042', 'jpg', 6000, 4000],
  ['043', 'jpg', 6000, 4000], ['044', 'jpg', 6000, 4000], ['045', 'jpg', 6000, 4000],
  ['046', 'jpg', 6000, 4000], ['047', 'jpg', 6000, 4000], ['048', 'jpg', 6000, 4000],
  ['049', 'jpg', 6000, 4000], ['050', 'jpg', 6000, 4000], ['051', 'jpg', 6000, 4000],
  ['052', 'jpg', 6000, 4000], ['053', 'jpg', 6000, 4000], ['054', 'jpg', 6000, 4000],
  ['055', 'jpg', 6000, 4000], ['056', 'jpg', 6000, 4000], ['057', 'jpg', 6000, 4000],
  ['058', 'jpg', 6000, 4000], ['059', 'jpg', 6000, 4000], ['060', 'jpg', 6000, 4000],
  ['061', 'jpg', 6000, 4000], ['062', 'jpg', 6000, 4000], ['063', 'jpg', 6000, 4000],
  ['064', 'jpg', 6000, 4000], ['065', 'jpg', 6000, 4000], ['066', 'jpg', 6000, 4000],
  ['067', 'jpg', 6000, 4000], ['068', 'jpg', 6000, 4000], ['069', 'jpg', 6000, 4000],
  ['070', 'jpg', 6000, 4000], ['071', 'jpg', 6000, 4000], ['072', 'jpg', 6000, 4000],
  ['073', 'jpg', 6000, 4000], ['074', 'jpg', 6000, 4000], ['075', 'jpg', 6000, 4000],
  ['076', 'jpg', 6000, 4000], ['077', 'jpg', 6000, 4000], ['078', 'jpg', 6000, 4000],
  ['079', 'jpg', 6000, 4000], ['080', 'jpg', 6000, 4000], ['081', 'jpg', 6000, 4000],
  ['082', 'jpg', 3724, 3660], ['083', 'jpg', 6000, 4000], ['084', 'jpg', 6000, 4000],
  ['085', 'jpg', 6000, 4000], ['086', 'jpg', 6000, 4000], ['087', 'jpg', 6000, 4000],
  ['088', 'jpg', 6000, 4000], ['089', 'png', 1122, 1402], ['090', 'png', 1535, 1024],
];

function buildTonsureCeremonyImages(): GalleryImage[] {
  return TONSURE_CEREMONY_FILES.map(([num, ext, width, height]) => {
    const src = `assets/images/baby/tonsure-ceremony/tonsure-${num}.${ext}`;
    return {
      id: `tonsure-${num}`,
      src,
      downloadSrc: src,
      alt: 'Tonsure ceremony photography by Man Clicks',
      width,
      height,
    };
  });
}

const TONSURE_CEREMONY_ALBUM: GalleryAlbum = {
  slug: 'tonsure-ceremony',
  title: 'Tonsure Ceremony',
  images: buildTonsureCeremonyImages(),
};

export const BABY_SHOOTS_CATEGORY: GalleryCategory = {
  slug: 'baby-shoots',
  title: 'Baby Shoots',
  heroImage: 'assets/images/baby/baby-hero-main.svg',
  secondaryHeroImage: 'assets/images/baby/baby-hero-secondary.svg',
  images: buildImages('baby', 'Baby shoot'),
  albums: [TONSURE_CEREMONY_ALBUM],
};
