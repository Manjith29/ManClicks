import { Component } from '@angular/core';
import { SOCIAL_CONFIG } from '../../core/config/social.config';

@Component({
  selector: 'app-watermark',
  standalone: true,
  templateUrl: './watermark.component.html',
  styleUrl: './watermark.component.css',
})
export class WatermarkComponent {
  readonly social = SOCIAL_CONFIG;
}
