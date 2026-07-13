import {
  ALL_CATEGORIES,
  getCategory,
  getAllCategorySlugs,
  getAlbum,
  findImage,
  findAdjacentImage,
} from './gallery-data';

describe('gallery-data', () => {
  it('exposes exactly the 4 expected category slugs', () => {
    expect(getAllCategorySlugs().sort()).toEqual(
      ['baby-shoots', 'birthdays', 'engagements', 'professional-portraits'].sort()
    );
  });

  it('getCategory returns the matching category', () => {
    const category = getCategory('baby-shoots');
    expect(category?.title).toBe('Baby Shoots');
    expect(category?.images.length).toBe(10);
  });

  it('getCategory returns undefined for an unknown slug', () => {
    expect(getCategory('weddings')).toBeUndefined();
  });

  it('findImage returns the matching image by id', () => {
    const image = findImage('baby-shoots', 'baby-003');
    expect(image?.id).toBe('baby-003');
  });

  it('findImage returns undefined when the photo id does not belong to the category', () => {
    expect(findImage('baby-shoots', 'birthday-001')).toBeUndefined();
  });

  it('findAdjacentImage("next") returns the following image', () => {
    const next = findAdjacentImage('baby-shoots', 'baby-001', 'next');
    expect(next?.id).toBe('baby-002');
  });

  it('findAdjacentImage("prev") wraps around from the first image to the last', () => {
    const prev = findAdjacentImage('baby-shoots', 'baby-001', 'prev');
    expect(prev?.id).toBe('baby-010');
  });

  it('findAdjacentImage("next") wraps around from the last image to the first', () => {
    const next = findAdjacentImage('baby-shoots', 'baby-010', 'next');
    expect(next?.id).toBe('baby-001');
  });

  it('ALL_CATEGORIES contains all 4 categories', () => {
    expect(ALL_CATEGORIES.length).toBe(4);
  });

  it('getAlbum returns the matching album for a category that has one', () => {
    const album = getAlbum('baby-shoots', 'tonsure-ceremony');
    expect(album?.title).toBe('Tonsure Ceremony');
    expect(album?.images.length).toBe(90);
  });

  it('getAlbum returns undefined for an unknown album slug', () => {
    expect(getAlbum('baby-shoots', 'not-a-real-album')).toBeUndefined();
  });

  it('getAlbum returns undefined for a category with no albums', () => {
    expect(getAlbum('birthdays', 'tonsure-ceremony')).toBeUndefined();
  });

  it('findImage with an albumSlug searches within that album, not the default images', () => {
    const image = findImage('baby-shoots', 'tonsure-005', 'tonsure-ceremony');
    expect(image?.id).toBe('tonsure-005');
    // Not present in the default ("All") image set.
    expect(findImage('baby-shoots', 'tonsure-005')).toBeUndefined();
  });

  it('findAdjacentImage with an albumSlug navigates within that album', () => {
    const next = findAdjacentImage('baby-shoots', 'tonsure-001', 'next', 'tonsure-ceremony');
    expect(next?.id).toBe('tonsure-002');
  });

  it('findAdjacentImage with an albumSlug wraps around within that album only', () => {
    const prev = findAdjacentImage('baby-shoots', 'tonsure-001', 'prev', 'tonsure-ceremony');
    expect(prev?.id).toBe('tonsure-090');
  });
});
