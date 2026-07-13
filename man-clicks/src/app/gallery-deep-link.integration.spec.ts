import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { GalleryRouteReuseStrategy } from './core/gallery-route-reuse-strategy';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';

describe('Gallery deep link integration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: RouteReuseStrategy, useClass: GalleryRouteReuseStrategy },
      ],
    });
  });

  it('opening /baby-shoots/photo/baby-002 directly renders the lightbox with that image', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const lightboxImg: HTMLImageElement | null = harness.routeNativeElement?.querySelector(
      'app-image-lightbox img.lightbox-image'
    ) ?? null;
    expect(lightboxImg?.getAttribute('src')).toBe('assets/images/baby/baby-002.svg');
  });

  it('clicking next from /baby-shoots/photo/baby-002 navigates to baby-003', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const nextButton = harness.routeNativeElement?.querySelector(
      'app-image-lightbox button.next'
    ) as HTMLButtonElement;
    nextButton.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/baby-shoots/photo/baby-003');
  });

  it('clicking back from the lightbox navigates to the plain category URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/baby-shoots/photo/baby-002');
    harness.detectChanges();
    const backButton = harness.routeNativeElement?.querySelector(
      'app-image-lightbox button.back'
    ) as HTMLButtonElement;
    backButton.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/baby-shoots');
  });

  it('reuses the same GalleryPageComponent instance when navigating from /baby-shoots to /baby-shoots/photo/baby-001', async () => {
    const harness = await RouterTestingHarness.create();
    const galleryInstance = await harness.navigateByUrl('/baby-shoots', GalleryPageComponent);
    harness.detectChanges();

    const photoInstance = await harness.navigateByUrl(
      '/baby-shoots/photo/baby-001',
      GalleryPageComponent
    );
    harness.detectChanges();

    // If the RouteReuseStrategy were the Angular default, this navigation
    // would destroy and recreate GalleryPageComponent (the two routes are
    // distinct Route objects), losing scroll position. The custom
    // GalleryRouteReuseStrategy registered above must keep the same
    // instance alive across the transition.
    expect(photoInstance).toBe(galleryInstance);
  });
});
