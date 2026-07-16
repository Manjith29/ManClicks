import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { getAllCategorySlugs, getCategory } from '../../data/gallery-data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly isMenuOpen = signal(false);
  readonly isHidden = signal(false);
  private lastScrollY = 0;
  private scrollListener: (() => void) | null = null;

  readonly navItems = getAllCategorySlugs().map((slug) => ({
    slug,
    title: getCategory(slug)!.title,
  }));

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private onScroll(): void {
    const currentScrollY = window.scrollY;
    const isHomePage = this.router.url === '/';

    if (isHomePage) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.isHidden.set(true);
      } else if (currentScrollY < this.lastScrollY) {
        this.isHidden.set(false);
      }
    } else {
      this.isHidden.set(false);
    }

    this.lastScrollY = currentScrollY;
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
