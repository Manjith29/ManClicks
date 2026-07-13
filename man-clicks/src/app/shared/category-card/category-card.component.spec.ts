import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(CategoryCardComponent);
    fixture.componentRef.setInput('slug', 'baby-shoots');
    fixture.componentRef.setInput('title', 'Baby Shoots');
    fixture.componentRef.setInput('image', 'assets/images/baby/baby-hero-main.svg');
    fixture.detectChanges();
  });

  it('renders the category title', () => {
    expect(fixture.nativeElement.textContent).toContain('Baby Shoots');
  });

  it('renders the featured image with the given src', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('assets/images/baby/baby-hero-main.svg');
  });

  it('links to the category route', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/baby-shoots');
  });
});
