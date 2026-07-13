import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

/**
 * The gallery and photo routes for a given category slug (`/<slug>` and
 * `/<slug>/photo/:photoId`) are two separate Route objects so the app can
 * expose clean, shareable URLs for each, but they must resolve to the same
 * GalleryPageComponent instance so opening/closing the lightbox doesn't
 * destroy and recreate the gallery (which would lose scroll position).
 * Angular's default strategy only reuses a route when `routeConfig` is
 * reference-equal, which is false here — this strategy additionally treats
 * two routes as reusable when both carry the same `data.slug`.
 */
@Injectable()
export class GalleryRouteReuseStrategy extends RouteReuseStrategy {
  override shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  override store(_route: ActivatedRouteSnapshot, _handle: DetachedRouteHandle | null): void {}

  override shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  override retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.routeConfig === curr.routeConfig) {
      return true;
    }
    const futureSlug = future.data['slug'];
    const currSlug = curr.data['slug'];
    return futureSlug !== undefined && futureSlug === currSlug;
  }
}
