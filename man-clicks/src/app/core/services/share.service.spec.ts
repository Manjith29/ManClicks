import { TestBed } from '@angular/core/testing';
import { ShareService } from './share.service';

describe('ShareService', () => {
  let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareService);
  });

  it('builds an absolute photo URL from the category slug and photo id', () => {
    const url = service.buildPhotoUrl('baby-shoots', 'baby-001');
    expect(url).toBe(`${window.location.origin}/baby-shoots/photo/baby-001`);
  });

  it('builds a WhatsApp share URL containing an encoded message and the photo URL', () => {
    const photoUrl = 'https://example.com/baby-shoots/photo/baby-001';
    const shareUrl = service.buildWhatsAppShareUrl(photoUrl);
    expect(shareUrl.startsWith('https://wa.me/?text=')).toBeTrue();
    const decoded = decodeURIComponent(shareUrl.replace('https://wa.me/?text=', ''));
    expect(decoded).toContain('Check out this photo from Man Clicks');
    expect(decoded).toContain(photoUrl);
  });
});
