import { Component } from '@angular/core';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly social = SOCIAL_CONFIG;
  readonly year = new Date().getFullYear();
}
