import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasonryGalleryComponent } from './masonry-gallery.component';
import { GalleryImage } from '../../core/models/gallery.model';

function makeImages(count: number): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `baby-${String(i + 1).padStart(3, '0')}`,
    src: `assets/images/baby/baby-${String(i + 1).padStart(3, '0')}.svg`,
    downloadSrc: `assets/images/baby/baby-${String(i + 1).padStart(3, '0')}.svg`,
    alt: 'Baby shoot photography by Man Clicks',
    width: 800,
    height: 1000 + i * 10,
  }));
}

describe('MasonryGalleryComponent', () => {
  let fixture: ComponentFixture<MasonryGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasonryGalleryComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MasonryGalleryComponent);
    fixture.componentRef.setInput('images', makeImages(5));
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
  });

  it('renders one figure per image', () => {
    const figures = fixture.nativeElement.querySelectorAll('figure');
    expect(figures.length).toBe(5);
  });

  it('renders no caption text under any image', () => {
    const figcaptions = fixture.nativeElement.querySelectorAll('figcaption');
    expect(figcaptions.length).toBe(0);
  });

  it('emits imageSelected with the clicked image id', () => {
    const emitted: string[] = [];
    fixture.componentInstance.imageSelected.subscribe((id: string) => emitted.push(id));
    const firstImageButton: HTMLElement = fixture.nativeElement.querySelector(
      'figure button.gallery-image-trigger'
    );
    firstImageButton.click();
    expect(emitted).toEqual(['baby-001']);
  });

  it('renders an ImageActionsComponent for every image', () => {
    const actions = fixture.nativeElement.querySelectorAll('app-image-actions');
    expect(actions.length).toBe(5);
  });
});
