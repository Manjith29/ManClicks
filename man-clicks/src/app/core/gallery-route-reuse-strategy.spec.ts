import { ActivatedRouteSnapshot, Route } from '@angular/router';

import { GalleryRouteReuseStrategy } from './gallery-route-reuse-strategy';

function makeSnapshot(routeConfig: Route | null, slug?: string): ActivatedRouteSnapshot {
  return {
    routeConfig,
    data: slug === undefined ? {} : { slug },
  } as unknown as ActivatedRouteSnapshot;
}

describe('GalleryRouteReuseStrategy', () => {
  let strategy: GalleryRouteReuseStrategy;

  beforeEach(() => {
    strategy = new GalleryRouteReuseStrategy();
  });

  it('reuses the route when routeConfig is reference-equal (trivial identity case)', () => {
    const sharedConfig: Route = { path: 'baby-shoots' };
    const future = makeSnapshot(sharedConfig, 'baby-shoots');
    const curr = makeSnapshot(sharedConfig, 'baby-shoots');

    expect(strategy.shouldReuseRoute(future, curr)).toBeTrue();
  });

  it('reuses the route when routeConfig differs but both snapshots share the same data.slug', () => {
    const future = makeSnapshot({ path: 'baby-shoots/photo/:photoId' }, 'baby-shoots');
    const curr = makeSnapshot({ path: 'baby-shoots' }, 'baby-shoots');

    expect(strategy.shouldReuseRoute(future, curr)).toBeTrue();
  });

  it('does not reuse the route when the slugs differ across categories', () => {
    const future = makeSnapshot({ path: 'birthdays' }, 'birthdays');
    const curr = makeSnapshot({ path: 'baby-shoots' }, 'baby-shoots');

    expect(strategy.shouldReuseRoute(future, curr)).toBeFalse();
  });

  it('does not reuse the route when data.slug is undefined on either snapshot', () => {
    const homeSnapshot = makeSnapshot({ path: '' }, undefined);
    const gallerySnapshot = makeSnapshot({ path: 'baby-shoots' }, 'baby-shoots');

    expect(strategy.shouldReuseRoute(gallerySnapshot, homeSnapshot)).toBeFalse();
    expect(strategy.shouldReuseRoute(homeSnapshot, gallerySnapshot)).toBeFalse();
  });

  it('does not reuse the route when data.slug is undefined on both snapshots', () => {
    const a = makeSnapshot({ path: '' }, undefined);
    const b = makeSnapshot({ path: 'other' }, undefined);

    expect(strategy.shouldReuseRoute(a, b)).toBeFalse();
  });

  it('never detaches, attaches, or retrieves routes (no reuse cache is kept)', () => {
    const snapshot = makeSnapshot({ path: 'baby-shoots' }, 'baby-shoots');

    expect(strategy.shouldDetach(snapshot)).toBeFalse();
    expect(strategy.shouldAttach(snapshot)).toBeFalse();
    expect(strategy.retrieve(snapshot)).toBeNull();
    expect(() => strategy.store(snapshot, null)).not.toThrow();
  });
});
