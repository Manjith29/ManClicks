import { GalleryAlbum, GalleryCategory, GalleryImage } from '../../core/models/gallery.model';

// Highlights images with their dimensions
const HIGHLIGHTS_FILES: Array<[string, string, number, number]> = [
  ['V&L_highlight', 'png', 1023, 1537],
];

function buildHighlightsImages(): GalleryImage[] {
  return HIGHLIGHTS_FILES.map(([name, ext, width, height]) => {
    const src = `assets/images/couple-photoshoot/Highlightes/${name}.${ext}`;
    return {
      id: `highlight-${name}`,
      src,
      downloadSrc: src,
      alt: 'Couple photoshoot highlights by Man Clicks',
      width,
      height,
    };
  });
}

// [fileNumber, extension, width, height] for each real photo in
// src/assets/images/couple-photoshoot/V&L/. Dimensions read directly from
// the original files so the masonry grid sizes each image correctly.
const VL_ALBUM_FILES: Array<[string, string, number, number]> = [
  ['001', 'JPG', 6000, 4000], ['004', 'JPG', 6000, 4000], ['006', 'JPG', 6000, 4000],
  ['009', 'JPG', 6000, 4000], ['011', 'JPG', 6000, 4000], ['013', 'JPG', 6000, 4000],
  ['017', 'JPG', 6000, 4000], ['019', 'JPG', 6000, 4000], ['022', 'JPG', 6000, 4000],
  ['023', 'JPG', 6000, 4000], ['025', 'JPG', 6000, 4000], ['027', 'JPG', 6000, 4000],
  ['029', 'JPG', 6000, 4000], ['033', 'JPG', 6000, 4000], ['035', 'JPG', 6000, 4000],
  ['039', 'JPG', 6000, 4000], ['043', 'JPG', 6000, 4000], ['045', 'JPG', 6000, 4000],
  ['046', 'JPG', 6000, 4000], ['047', 'JPG', 6000, 4000], ['049', 'JPG', 6000, 4000],
  ['050', 'JPG', 6000, 4000], ['054', 'JPG', 6000, 4000], ['057', 'JPG', 6000, 4000], 
  ['059', 'JPG', 6000, 4000], ['060', 'JPG', 6000, 4000], ['066', 'JPG', 6000, 4000], 
  ['067', 'JPG', 6000, 4000], ['070', 'JPG', 6000, 4000], ['074', 'JPG', 6000, 4000],
  ['076', 'JPG', 6000, 4000], ['080', 'JPG', 6000, 4000], ['082', 'JPG', 6000, 4000],
  ['084', 'JPG', 6000, 4000], ['087', 'JPG', 6000, 4000], ['139', 'JPG', 6000, 4000],
  ['090', 'JPG', 6000, 4000], ['094', 'JPG', 6000, 4000], ['100', 'JPG', 6000, 4000],
  ['111', 'JPG', 6000, 4000], ['117', 'JPG', 6000, 4000], ['123', 'JPG', 6000, 4000],
  ['129', 'JPG', 6000, 4000], ['130', 'JPG', 6000, 4000], ['132', 'JPG', 6000, 4000],
  ['133', 'JPG', 6000, 4000], ['135', 'JPG', 6000, 4000], ['137', 'JPG', 6000, 4000],
];

function buildVLAlbumImages(): GalleryImage[] {
  return VL_ALBUM_FILES.map(([num, ext, width, height]) => {
    const src = `assets/images/couple-photoshoot/V&L/man_clicks_${num}.${ext}`;
    return {
      id: `vl-${num}`,
      src,
      downloadSrc: src,
      alt: 'V&L couple photoshoot photography by Man Clicks',
      width,
      height,
    };
  });
}

const VL_ALBUM: GalleryAlbum = {
  slug: 'vl',
  title: 'V&L',
  images: buildVLAlbumImages(),
};

export const ENGAGEMENTS_CATEGORY: GalleryCategory = {
  slug: 'engagements',
  title: 'Couple Photoshoot',
  heroImage: 'assets/images/couple-photoshoot/V&L/man_clicks_054.JPG',
  secondaryHeroImage: 'assets/images/couple-photoshoot/V&L/man_clicks_060.JPG',
  images: buildHighlightsImages(),
  albums: [VL_ALBUM],
};
