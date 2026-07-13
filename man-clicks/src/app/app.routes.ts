import { Routes } from '@angular/router';
import { ALL_CATEGORIES } from './data/gallery-data';

const loadGalleryPage = () =>
  import('./pages/gallery-page/gallery-page.component').then((m) => m.GalleryPageComponent);

const categoryRoutes: Routes = ALL_CATEGORIES.flatMap((category) => {
  const slug = category.slug;

  const baseRoutes: Routes = [
    { path: slug, loadComponent: loadGalleryPage, data: { slug } },
    { path: `${slug}/photo/:photoId`, loadComponent: loadGalleryPage, data: { slug } },
  ];

  // Sub-albums nested under this category (e.g. Tonsure Ceremony under Baby
  // Shoots) get their own clean URL segment, and their own photo route for
  // deep-linking. All of these still resolve to the same GalleryPageComponent
  // and carry the same `data.slug`, so GalleryRouteReuseStrategy keeps one
  // instance alive across album/photo transitions too.
  const albumRoutes: Routes = (category.albums ?? []).flatMap((album) => [
    {
      path: `${slug}/${album.slug}`,
      loadComponent: loadGalleryPage,
      data: { slug, albumSlug: album.slug },
    },
    {
      path: `${slug}/${album.slug}/photo/:photoId`,
      loadComponent: loadGalleryPage,
      data: { slug, albumSlug: album.slug },
    },
  ]);

  return [...baseRoutes, ...albumRoutes];
});

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  ...categoryRoutes,
];
