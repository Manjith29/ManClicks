import { Component, Input, computed } from '@angular/core';
import { LikesService } from '../../core/services/likes.service';
import { ShareService } from '../../core/services/share.service';
import { GalleryImage } from '../../core/models/gallery.model';

@Component({
  selector: 'app-image-actions',
  standalone: true,
  templateUrl: './image-actions.component.html',
  styleUrl: './image-actions.component.css',
})
export class ImageActionsComponent {
  @Input({ required: true }) image!: GalleryImage;
  @Input({ required: true }) categorySlug!: string;

  constructor(private readonly likes: LikesService, private readonly share: ShareService) {}

  readonly isLiked = computed(() => this.likes.likedIds().has(this.image?.id));

  onLikeClick(): void {
    this.likes.toggleLike(this.image.id);
  }

  onShareClick(): void {
    const photoUrl = this.share.buildPhotoUrl(this.categorySlug, this.image.id);
    const shareUrl = this.share.buildWhatsAppShareUrl(photoUrl);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }

  get downloadFileName(): string {
    const extension = this.image.downloadSrc.split('.').pop();
    return extension ? `${this.image.id}.${extension}` : this.image.id;
  }
}
