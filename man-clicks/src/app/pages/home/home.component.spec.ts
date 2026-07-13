import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { ALL_CATEGORIES } from '../../data/gallery-data';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('displays the brand tagline', () => {
    expect(fixture.nativeElement.textContent).toContain('Capturing your moments, forever.');
  });

  it('renders one category card per category', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-category-card');
    expect(cards.length).toBe(ALL_CATEGORIES.length);
  });

  it('renders the contact section heading', () => {
    expect(fixture.nativeElement.textContent).toContain("Let's Create Something Timeless");
  });

  it('renders the Instagram, email, and location in the contact section', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(SOCIAL_CONFIG.instagramHandle);
    expect(text).toContain(SOCIAL_CONFIG.location);
  });

  it('has an explore-the-portfolio call to action linking into the gallery categories', () => {
    const cta: HTMLAnchorElement = fixture.nativeElement.querySelector('a.hero-cta');
    expect(cta).toBeTruthy();
    expect(cta.getAttribute('href')).toBe(`/${ALL_CATEGORIES[0].slug}`);
  });
});
