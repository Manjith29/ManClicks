import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { GalleryImage } from '../../core/models/gallery.model';
import { ImageActionsComponent } from '../image-actions/image-actions.component';

const INITIAL_IMAGES_TO_LOAD = 12;
const IMAGES_PER_PAGE = 12;

@Component({
  selector: 'app-masonry-gallery',
  standalone: true,
  imports: [CommonModule, ImageActionsComponent],
  templateUrl: './masonry-gallery.component.html',
  styleUrl: './masonry-gallery.component.css',
})
export class MasonryGalleryComponent {
  @Input({ required: true }) set images(value: GalleryImage[]) {
    this._allImages = value;
    this._imagesLoaded.set(INITIAL_IMAGES_TO_LOAD);
  }
  @Input({ required: true }) categorySlug!: string;
  @Output() imageSelected = new EventEmitter<string>();

  private _allImages: GalleryImage[] = [];
  private readonly _imagesLoaded = signal(INITIAL_IMAGES_TO_LOAD);

  readonly displayedImages = computed(() => {
    return this._allImages.slice(0, this._imagesLoaded());
  });

  readonly hasMoreImages = computed(() => {
    return this._imagesLoaded() < this._allImages.length;
  });

  readonly remainingImagesCount = computed(() => {
    return this._allImages.length - this._imagesLoaded();
  });

  onImageClick(imageId: string): void {
    this.imageSelected.emit(imageId);
  }

  loadMore(): void {
    this._imagesLoaded.update((current) => Math.min(current + IMAGES_PER_PAGE, this._allImages.length));
  }
}
