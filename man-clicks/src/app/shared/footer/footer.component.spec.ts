import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it('displays the brand name', () => {
    expect(fixture.nativeElement.textContent).toContain('Man Clicks');
  });

  it('displays the email as a mailto link', () => {
    const mail: HTMLAnchorElement = fixture.nativeElement.querySelector(
      `a[href="mailto:${SOCIAL_CONFIG.email}"]`
    );
    expect(mail).toBeTruthy();
  });

  it('displays the Instagram link', () => {
    const insta: HTMLAnchorElement = fixture.nativeElement.querySelector(
      `a[href="${SOCIAL_CONFIG.instagramUrl}"]`
    );
    expect(insta).toBeTruthy();
  });

  it('displays the location', () => {
    expect(fixture.nativeElement.textContent).toContain(SOCIAL_CONFIG.location);
  });

  it('displays a copyright line with the current year', () => {
    const year = new Date().getFullYear().toString();
    expect(fixture.nativeElement.textContent).toContain(year);
  });
});
