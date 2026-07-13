import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { GalleryRouteReuseStrategy } from './core/gallery-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: GalleryRouteReuseStrategy },
  ]
};
