import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'man-clicks:likes';

function readStoredIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

/**
 * Frontend-only "likes" persisted per-browser via localStorage. There is
 * no backend and no shared/global like count — this only remembers what
 * this browser has liked.
 */
@Injectable({ providedIn: 'root' })
export class LikesService {
  private readonly liked = signal<ReadonlySet<string>>(readStoredIds());

  readonly likedIds = this.liked.asReadonly();

  isLiked(photoId: string): boolean {
    return this.liked().has(photoId);
  }

  toggleLike(photoId: string): void {
    const next = new Set(this.liked());
    if (next.has(photoId)) {
      next.delete(photoId);
    } else {
      next.add(photoId);
    }
    this.liked.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  }
}
