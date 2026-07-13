// man-clicks/src/app/shared/image-lightbox/image-lightbox.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageLightboxComponent } from './image-lightbox.component';
import { GalleryImage } from '../../core/models/gallery.model';

const TEST_IMAGE: GalleryImage = {
  id: 'baby-002',
  src: 'assets/images/baby/baby-002.svg',
  downloadSrc: 'assets/images/baby/baby-002.svg',
  alt: 'Baby shoot photography by Man Clicks',
  width: 1000,
  height: 750,
};

describe('ImageLightboxComponent', () => {
  let fixture: ComponentFixture<ImageLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLightboxComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ImageLightboxComponent);
    fixture.componentRef.setInput('image', TEST_IMAGE);
    fixture.componentRef.setInput('categorySlug', 'baby-shoots');
    fixture.detectChanges();
  });

  it('renders the full-size image', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img.lightbox-image');
    expect(img.src).toContain(TEST_IMAGE.src);
  });

  it('clicking the back button emits closeRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.closeRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.back') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('clicking next emits nextRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.nextRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.next') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('clicking previous emits previousRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.previousRequested.subscribe(() => emitted.push(undefined));
    (fixture.nativeElement.querySelector('button.prev') as HTMLButtonElement).click();
    expect(emitted.length).toBe(1);
  });

  it('Escape key emits closeRequested', () => {
    const emitted: void[] = [];
    fixture.componentInstance.closeRequested.subscribe(() => emitted.push(undefined));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(emitted.length).toBe(1);
  });

  it('ArrowRight key emits nextRequested, ArrowLeft emits previousRequested', () => {
    const nextEmitted: void[] = [];
    const prevEmitted: void[] = [];
    fixture.componentInstance.nextRequested.subscribe(() => nextEmitted.push(undefined));
    fixture.componentInstance.previousRequested.subscribe(() => prevEmitted.push(undefined));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(nextEmitted.length).toBe(1);
    expect(prevEmitted.length).toBe(1);
  });

  it('renders an ImageActionsComponent for the current image', () => {
    expect(fixture.nativeElement.querySelector('app-image-actions')).toBeTruthy();
  });
});
