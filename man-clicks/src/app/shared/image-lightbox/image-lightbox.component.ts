// man-clicks/src/app/shared/image-lightbox/image-lightbox.component.ts
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GalleryImage } from '../../core/models/gallery.model';
import { ImageActionsComponent } from '../image-actions/image-actions.component';

const SWIPE_THRESHOLD_PX = 50;

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [ImageActionsComponent],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.css',
})
export class ImageLightboxComponent {
  @Input({ required: true }) image!: GalleryImage;
  @Input({ required: true }) categorySlug!: string;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() previousRequested = new EventEmitter<void>();
  @Output() nextRequested = new EventEmitter<void>();

  private touchStartX: number | null = null;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeRequested.emit();
    } else if (event.key === 'ArrowRight') {
      this.nextRequested.emit();
    } else if (event.key === 'ArrowLeft') {
      this.previousRequested.emit();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const deltaX = endX - this.touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX < 0) {
        this.nextRequested.emit();
      } else {
        this.previousRequested.emit();
      }
    }
    this.touchStartX = null;
  }
}
