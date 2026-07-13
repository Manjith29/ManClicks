import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatermarkComponent } from './watermark.component';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('WatermarkComponent', () => {
  let fixture: ComponentFixture<WatermarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatermarkComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(WatermarkComponent);
    fixture.detectChanges();
  });

  it('renders a link to the Instagram profile URL', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.href).toBe(SOCIAL_CONFIG.instagramUrl);
  });

  it('opens the link in a new tab safely', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('displays the Instagram handle as the visible watermark text', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.textContent).toContain(SOCIAL_CONFIG.instagramHandle);
  });
});
