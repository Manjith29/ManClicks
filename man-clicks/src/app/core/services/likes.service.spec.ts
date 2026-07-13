import { TestBed } from '@angular/core/testing';
import { LikesService } from './likes.service';

const STORAGE_KEY = 'man-clicks:likes';

describe('LikesService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  it('starts with no liked images', () => {
    const service = TestBed.inject(LikesService);
    expect(service.isLiked('baby-001')).toBeFalse();
  });

  it('toggleLike marks an image as liked', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-001');
    expect(service.isLiked('baby-001')).toBeTrue();
  });

  it('toggleLike unlikes an already-liked image', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-001');
    service.toggleLike('baby-001');
    expect(service.isLiked('baby-001')).toBeFalse();
  });

  it('persists liked ids to localStorage', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-002');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toContain('baby-002');
  });

  it('restores liked ids from localStorage on a fresh instance', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['baby-003']));
    const service = TestBed.inject(LikesService);
    expect(service.isLiked('baby-003')).toBeTrue();
  });

  it('exposes likedIds as a readable signal', () => {
    const service = TestBed.inject(LikesService);
    service.toggleLike('baby-004');
    expect(service.likedIds().has('baby-004')).toBeTrue();
  });
});
