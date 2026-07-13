import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { GalleryPageComponent } from './gallery-page.component';
import { getCategory } from '../../data/gallery-data';

describe('GalleryPageComponent', () => {
  let fixture: ComponentFixture<GalleryPageComponent>;
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let dataSubject: BehaviorSubject<Record<string, unknown>>;

  function setup(initialPhotoId: string | null, initialAlbumSlug: string | null = null) {
    paramMapSubject = new BehaviorSubject(
      convertToParamMap(initialPhotoId ? { photoId: initialPhotoId } : {})
    );
    dataSubject = new BehaviorSubject<Record<string, unknown>>(
      initialAlbumSlug ? { slug: 'baby-shoots', albumSlug: initialAlbumSlug } : { slug: 'baby-shoots' }
    );

    TestBed.configureTestingModule({
      imports: [GalleryPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: dataSubject.value },
            data: dataSubject,
            paramMap: paramMapSubject,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryPageComponent);
    fixture.detectChanges();
  }

  it('renders the category hero title and hero images', () => {
    setup(null);
    const category = getCategory('baby-shoots')!;
    expect(fixture.nativeElement.textContent).toContain(category.title);
    const heroImg: HTMLImageElement = fixture.nativeElement.querySelector('.hero-preview img.hero-main');
    expect(heroImg.getAttribute('src')).toBe(category.heroImage);
  });

  it('does not show the lightbox when there is no photoId in the route', () => {
    setup(null);
    expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeFalsy();
  });

  it('shows the lightbox with the correct image when photoId is present', () => {
    setup('baby-002');
    fixture.detectChanges();
    const lightboxImg: HTMLImageElement = fixture.nativeElement.querySelector(
      'app-image-lightbox img.lightbox-image'
    );
    expect(lightboxImg.getAttribute('src')).toBe('assets/images/baby/baby-002.svg');
  });

  it('renders the masonry gallery with all of the category images', () => {
    setup(null);
    const figures = fixture.nativeElement.querySelectorAll('app-masonry-gallery figure');
    expect(figures.length).toBe(getCategory('baby-shoots')!.images.length);
  });

  it('navigates to the photo route when the masonry gallery emits imageSelected', () => {
    setup(null);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onImageSelected('baby-003');
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'photo', 'baby-003']);
  });

  it('navigates back to the plain category route when the lightbox requests close', () => {
    setup('baby-002');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxClose();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots']);
  });

  it('navigates to the next image id when the lightbox requests next', () => {
    setup('baby-002');
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxNext();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'photo', 'baby-003']);
  });

  it('renders an "All" tab and one tab per album when the category has albums', () => {
    setup(null);
    const tabs: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.album-tab');
    const labels = Array.from(tabs).map((t) => t.textContent?.trim());
    expect(labels).toEqual(['All', 'Tonsure Ceremony']);
  });

  it('shows the album images in the masonry gallery when an album is selected via route data', () => {
    setup(null, 'tonsure-ceremony');
    const figures = fixture.nativeElement.querySelectorAll('app-masonry-gallery figure');
    expect(figures.length).toBe(getCategory('baby-shoots')!.albums![0].images.length);
  });

  it('marks the matching album tab as active', () => {
    setup(null, 'tonsure-ceremony');
    const activeTab: HTMLButtonElement = fixture.nativeElement.querySelector('.album-tab--active');
    expect(activeTab.textContent?.trim()).toBe('Tonsure Ceremony');
  });

  it('selectAlbum navigates to the album route', () => {
    setup(null);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.selectAlbum('tonsure-ceremony');
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'tonsure-ceremony']);
  });

  it('selectAlbum(null) navigates back to the plain category route', () => {
    setup(null, 'tonsure-ceremony');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.selectAlbum(null);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots']);
  });

  it('shows the lightbox with the correct album image when photoId is present within an album', () => {
    setup('tonsure-005', 'tonsure-ceremony');
    const lightboxImg: HTMLImageElement = fixture.nativeElement.querySelector(
      'app-image-lightbox img.lightbox-image'
    );
    expect(lightboxImg.getAttribute('src')).toBe('assets/images/baby/tonsure-ceremony/tonsure-005.jpg');
  });

  it('navigates to the album photo route (not the plain photo route) when selecting an image within an album', () => {
    setup(null, 'tonsure-ceremony');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onImageSelected('tonsure-001');
    expect(router.navigate).toHaveBeenCalledWith([
      '/',
      'baby-shoots',
      'tonsure-ceremony',
      'photo',
      'tonsure-001',
    ]);
  });

  it('navigates to the next image within the same album when the lightbox requests next', () => {
    setup('tonsure-001', 'tonsure-ceremony');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxNext();
    expect(router.navigate).toHaveBeenCalledWith([
      '/',
      'baby-shoots',
      'tonsure-ceremony',
      'photo',
      'tonsure-002',
    ]);
  });

  it('closing the lightbox from within an album returns to the album route, not the plain category route', () => {
    setup('tonsure-001', 'tonsure-ceremony');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onLightboxClose();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'baby-shoots', 'tonsure-ceremony']);
  });
});
