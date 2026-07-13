import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageActionsComponent } from './image-actions.component';
import { LikesService } from '../../core/services/likes.service';
import { ShareService } from '../../core/services/share.service';
import { GalleryImage } from '../../core/models/gallery.model';

const TEST_IMAGE: GalleryImage = {
  id: 'baby-001',
  src: 'assets/images/baby/baby-001.svg',
  downloadSrc: 'assets/images/baby/baby-001.svg',
  alt: 'Baby shoot photography by Man Clicks',
  width: 800,
  height: 1000,
};

describe('ImageActionsComponent', () => {
  let fixture: ComponentFixture<ImageActionsComponent>;
  let likesService: LikesService;

  beforeEach(async () => {
    localStorage.removeItem('man-clicks:likes');
    await TestBed.configureTestingModule({
      imports: [ImageActionsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ImageActionsComponent);
    fixture.componentRef.setInput('image', TEST_IMAGE);
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
    likesService = TestBed.inject(LikesService);
  });

  it('renders like, download, and share buttons', () => {
    expect(fixture.nativeElement.querySelector('button.like')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a.download')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button.share')).toBeTruthy();
  });

  it('the download link points at the image downloadSrc', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.download');
    expect(link.getAttribute('href')).toBe(TEST_IMAGE.downloadSrc);
    expect(link.getAttribute('download')).toBeTruthy();
  });

  it('clicking like toggles the liked state via LikesService', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.like');
    expect(likesService.isLiked('baby-001')).toBeFalse();
    button.click();
    expect(likesService.isLiked('baby-001')).toBeTrue();
  });

  it('clicking share opens a WhatsApp URL for this image', () => {
    const shareService = TestBed.inject(ShareService);
    spyOn(window, 'open');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.share');
    button.click();
    const expectedPhotoUrl = shareService.buildPhotoUrl('baby-shoots', 'baby-001');
    const expectedShareUrl = shareService.buildWhatsAppShareUrl(expectedPhotoUrl);
    expect(window.open).toHaveBeenCalledWith(expectedShareUrl, '_blank', 'noopener,noreferrer');
  });

  it('the download filename includes the extension from downloadSrc', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.download');
    expect(link.getAttribute('download')).toBe('baby-001.svg');
  });

  it('all three action buttons have accessible labels', () => {
    const like: HTMLButtonElement = fixture.nativeElement.querySelector('button.like');
    const share: HTMLButtonElement = fixture.nativeElement.querySelector('button.share');
    const download: HTMLAnchorElement = fixture.nativeElement.querySelector('a.download');
    expect(like.getAttribute('aria-label')).toBeTruthy();
    expect(share.getAttribute('aria-label')).toBeTruthy();
    expect(download.getAttribute('aria-label')).toBeTruthy();
  });
});
