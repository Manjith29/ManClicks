import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal, effect } from '@angular/core';
import { GalleryImage } from '../../core/models/gallery.model';
import { ImageActionsComponent } from '../image-actions/image-actions.component';

const INITIAL_IMAGES_TO_LOAD = 60;
const IMAGES_PER_PAGE = 12;
const SLIDESHOW_INTERVAL_MS = 3000;

@Component({
  selector: 'app-masonry-gallery',
  standalone: true,
  imports: [CommonModule, ImageActionsComponent],
  templateUrl: './masonry-gallery.component.html',
  styleUrl: './masonry-gallery.component.css',
})
export class MasonryGalleryComponent {
  private readonly _images = signal<GalleryImage[]>([]);

  @Input({ required: true }) set images(value: GalleryImage[]) {
    this._images.set(value);
    this._imagesLoaded.set(INITIAL_IMAGES_TO_LOAD);
    this._slideshowIndex.set(0);
    this._isPlaying.set(false);
  }
  @Input({ required: true }) categorySlug!: string;
  @Output() imageSelected = new EventEmitter<string>();

  private readonly _imagesLoaded = signal(INITIAL_IMAGES_TO_LOAD);
  private readonly _isPlaying = signal(false);
  private readonly _slideshowIndex = signal(0);
  private slideshowIntervalId: number | null = null;

  readonly displayedImages = computed(() => {
    return this._images().slice(0, this._imagesLoaded());
  });

  readonly hasMoreImages = computed(() => {
    return this._imagesLoaded() < this._images().length;
  });

  readonly remainingImagesCount = computed(() => {
    return this._images().length - this._imagesLoaded();
  });

  readonly isPlaying = this._isPlaying.asReadonly();
  readonly totalImages = computed(() => this._images().length);

  constructor() {
    effect(() => {
      if (this._isPlaying()) {
        this.startSlideshow();
      } else {
        this.cleanupSlideshow();
      }
    });
  }

  onImageClick(imageId: string): void {
    this.imageSelected.emit(imageId);
  }

  loadMore(): void {
    this._imagesLoaded.update((current) => Math.min(current + IMAGES_PER_PAGE, this._images().length));
  }

  toggleSlideshow(): void {
    this._isPlaying.update((v) => !v);
  }

  stopSlideshow(): void {
    this._isPlaying.set(false);
  }

  private startSlideshow(): void {
    if (this.slideshowIntervalId !== null) {
      return;
    }
    this.slideshowIntervalId = window.setInterval(() => {
      this._slideshowIndex.update((current) => (current + 1) % this._images().length);
      const image = this._images()[this._slideshowIndex()];
      if (image) {
        this.imageSelected.emit(image.id);
      }
    }, SLIDESHOW_INTERVAL_MS);
  }

  private cleanupSlideshow(): void {
    if (this.slideshowIntervalId !== null) {
      clearInterval(this.slideshowIntervalId);
      this.slideshowIntervalId = null;
    }
  }

  async downloadAllAsZip(): Promise<void> {
    const images = this._images();
    if (images.length === 0) return;

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      for (const image of images) {
        const response = await fetch(image.downloadSrc);
        if (!response.ok) {
          console.warn(`Failed to fetch image ${image.id}: ${response.statusText}`);
          continue;
        }
        const blob = await response.blob();
        const fileName = image.downloadSrc.split('/').pop() || `${image.id}.jpg`;
        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.categorySlug}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download images as ZIP:', error);
    }
  }
}
