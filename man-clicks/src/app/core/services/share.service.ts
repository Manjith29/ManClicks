import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareService {
  buildPhotoUrl(slug: string, photoId: string): string {
    return `${window.location.origin}/${slug}/photo/${photoId}`;
  }

  buildWhatsAppShareUrl(photoUrl: string): string {
    const message = `Check out this photo from Man Clicks:\n${photoUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}
