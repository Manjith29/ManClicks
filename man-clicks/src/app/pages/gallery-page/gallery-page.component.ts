import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { findAdjacentImage, findImage, getAlbum, getCategory } from '../../data/gallery-data';
import { GalleryCategory, GalleryImage } from '../../core/models/gallery.model';
import { WatermarkComponent } from '../../shared/watermark/watermark.component';
import { MasonryGalleryComponent } from '../../shared/masonry-gallery/masonry-gallery.component';
import { ImageLightboxComponent } from '../../shared/image-lightbox/image-lightbox.component';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [
    CommonModule,
    WatermarkComponent,
    MasonryGalleryComponent,
    ImageLightboxComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPageComponent implements OnInit {
  @ViewChild(MasonryGalleryComponent) galleryComponent!: MasonryGalleryComponent;

  category!: GalleryCategory;
  private slug!: string;

  private readonly activePhotoId = signal<string | null>(null);
  private readonly _activeAlbumSlug = signal<string | null>(null);
  readonly activeAlbumSlug = this._activeAlbumSlug.asReadonly();

  /** The images currently on display: the selected album's, or the category's default ("All") set. */
  readonly activeImages = computed<GalleryImage[]>(() => {
    const albumSlug = this._activeAlbumSlug();
    return (albumSlug ? getAlbum(this.slug, albumSlug)?.images : this.category.images) ?? [];
  });

  /**
   * The category/album path segment used both for navigation and for
   * building this photo's public shareable URL (e.g. "baby-shoots" or
   * "baby-shoots/tonsure-ceremony") — passed straight through as the
   * `categorySlug` input MasonryGalleryComponent/ImageLightboxComponent
   * forward to ShareService.
   */
  readonly categoryPath = computed(() => {
    const albumSlug = this._activeAlbumSlug();
    return albumSlug ? `${this.slug}/${albumSlug}` : this.slug;
  });

  readonly activeImage = computed(() => {
    const photoId = this.activePhotoId();
    return photoId ? findImage(this.slug, photoId, this._activeAlbumSlug() ?? undefined) ?? null : null;
  });

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.data['slug'];
    this.category = getCategory(this.slug)!;
    // route.paramMap/route.data both replay their current value synchronously
    // to a new subscriber (both in the real Router and in this test's
    // BehaviorSubject mock), and push a new value whenever
    // GalleryRouteReuseStrategy reuses this component across a route
    // transition — so these subscriptions alone supply both the initial
    // value and every subsequent re-evaluation.
    this.route.paramMap.subscribe((paramMap) => {
      this.activePhotoId.set(paramMap.get('photoId'));
    });
    this.route.data.subscribe((data) => {
      this._activeAlbumSlug.set(data['albumSlug'] ?? null);
    });
  }

  scrollToGallery(): void {
    document.getElementById('full-gallery')?.scrollIntoView({ behavior: 'smooth' });
  }

  selectAlbum(albumSlug: string | null): void {
    this.galleryComponent?.stopSlideshow();
    this.router.navigate(this.galleryPath(albumSlug));
  }

  onImageSelected(photoId: string): void {
    this.router.navigate(this.photoPath(photoId));
  }

  onLightboxClose(): void {
    this.router.navigate(this.galleryPath());
  }

  onLightboxNext(): void {
    const current = this.activePhotoId();
    if (!current) {
      return;
    }
    this.galleryComponent?.stopSlideshow();
    const next = findAdjacentImage(this.slug, current, 'next', this._activeAlbumSlug() ?? undefined);
    if (next) {
      this.router.navigate(this.photoPath(next.id));
    }
  }

  onLightboxPrevious(): void {
    const current = this.activePhotoId();
    if (!current) {
      return;
    }
    this.galleryComponent?.stopSlideshow();
    const prev = findAdjacentImage(this.slug, current, 'prev', this._activeAlbumSlug() ?? undefined);
    if (prev) {
      this.router.navigate(this.photoPath(prev.id));
    }
  }

  private galleryPath(albumSlug: string | null = this._activeAlbumSlug()): unknown[] {
    return albumSlug ? ['/', this.slug, albumSlug] : ['/', this.slug];
  }

  private photoPath(photoId: string): unknown[] {
    return [...this.galleryPath(), 'photo', photoId];
  }
}
