import { routes } from './app.routes';
import { ALL_CATEGORIES, getAllCategorySlugs } from './data/gallery-data';

describe('app.routes', () => {
  it('routes the empty path to the home page', () => {
    const homeRoute = routes.find((r) => r.path === '');
    expect(homeRoute).toBeTruthy();
  });

  it('generates a gallery route and a photo route for every category slug', () => {
    const slugs = getAllCategorySlugs();
    slugs.forEach((slug) => {
      expect(routes.some((r) => r.path === slug)).toBeTrue();
      expect(routes.some((r) => r.path === `${slug}/photo/:photoId`)).toBeTrue();
    });
  });

  it('attaches the category slug as route data for both the gallery and photo routes', () => {
    const gallerySlugRoute = routes.find((r) => r.path === 'baby-shoots');
    const photoSlugRoute = routes.find((r) => r.path === 'baby-shoots/photo/:photoId');
    expect(gallerySlugRoute?.data?.['slug']).toBe('baby-shoots');
    expect(photoSlugRoute?.data?.['slug']).toBe('baby-shoots');
  });

  it('has exactly 1 + 2*N category routes + 2*A album routes for N categories and A albums', () => {
    const slugs = getAllCategorySlugs();
    const albumCount = ALL_CATEGORIES.reduce((sum, c) => sum + (c.albums?.length ?? 0), 0);
    expect(routes.length).toBe(1 + slugs.length * 2 + albumCount * 2);
  });

  it('generates an album route and an album photo route for baby-shoots/tonsure-ceremony', () => {
    expect(routes.some((r) => r.path === 'baby-shoots/tonsure-ceremony')).toBeTrue();
    expect(routes.some((r) => r.path === 'baby-shoots/tonsure-ceremony/photo/:photoId')).toBeTrue();
  });

  it('attaches both slug and albumSlug as route data for album routes', () => {
    const albumRoute = routes.find((r) => r.path === 'baby-shoots/tonsure-ceremony');
    const albumPhotoRoute = routes.find(
      (r) => r.path === 'baby-shoots/tonsure-ceremony/photo/:photoId'
    );
    expect(albumRoute?.data).toEqual({ slug: 'baby-shoots', albumSlug: 'tonsure-ceremony' });
    expect(albumPhotoRoute?.data).toEqual({ slug: 'baby-shoots', albumSlug: 'tonsure-ceremony' });
  });

  it('does not generate album routes for categories with no albums', () => {
    expect(routes.some((r) => r.path?.startsWith('birthdays/') && r.path !== 'birthdays/photo/:photoId')).toBeFalse();
  });
});
