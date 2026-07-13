import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  it('renders one nav link per gallery category', () => {
    const links = fixture.nativeElement.querySelectorAll('nav a[href^="/"]');
    expect(links.length).toBe(4);
  });

  it('renders the 4 categories in the required order', () => {
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll(
      'nav a[href^="/"]'
    );
    const titles = Array.from(links).map((a) => a.textContent?.trim());
    expect(titles).toEqual(['Baby Shoots', 'Professional Portraits', 'Engagements', 'Birthdays']);
  });

  it('starts with the mobile menu closed', () => {
    expect(fixture.componentInstance.isMenuOpen()).toBeFalse();
  });

  it('toggleMenu opens and closes the mobile menu', () => {
    const component = fixture.componentInstance;
    component.toggleMenu();
    expect(component.isMenuOpen()).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen()).toBeFalse();
  });

  it('the hamburger button has an aria-label', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.hamburger');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
