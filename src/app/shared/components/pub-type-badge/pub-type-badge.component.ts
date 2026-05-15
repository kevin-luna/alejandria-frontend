import { Component, Input } from '@angular/core';
import { PUBLICATION_TYPE_LABELS, PublicationType } from '../../../core/models/publication.model';

@Component({
  selector: 'app-pub-type-badge',
  standalone: true,
  template: `<span class="badge type-{{ pubType }}">{{ label }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 3px 10px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border: 1px solid currentColor;
    }
    .type-0 { color: #0D47A1; background: #E3F2FD; }
    .type-1 { color: #283593; background: #E8EAF6; }
    .type-2 { color: #004D40; background: #E0F2F1; }
    .type-3 { color: #E65100; background: #FFF3E0; }
    .type-4 { color: #4A148C; background: #F3E5F5; }
    .type-5 { color: #1B5E20; background: #E8F5E9; }
    .type-6 { color: #424242; background: #F5F5F5; }
  `],
})
export class PubTypeBadgeComponent {
  @Input({ required: true }) pubType!: number;

  get label(): string {
    return PUBLICATION_TYPE_LABELS[this.pubType as PublicationType] ?? 'Desconocido';
  }
}
