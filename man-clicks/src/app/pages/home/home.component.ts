import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ALL_CATEGORIES } from '../../data/gallery-data';
import { SOCIAL_CONFIG } from '../../core/config/social.config';
import { CategoryCardComponent } from '../../shared/category-card/category-card.component';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryCardComponent, ScrollRevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly categories = ALL_CATEGORIES;
  readonly social = SOCIAL_CONFIG;
}
