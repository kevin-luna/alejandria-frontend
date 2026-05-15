import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CardModule } from 'primeng/card';
import { Publication } from '../../../core/models/publication.model';
import { PubTypeBadgeComponent } from '../pub-type-badge/pub-type-badge.component';
import { PinataService } from '../../../core/services/pinata.service';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CardModule, PubTypeBadgeComponent],
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.css',
})
export class PublicationCardComponent {
  @Input({ required: true }) publication!: Publication;

  private readonly pinata = inject(PinataService);

  get registrationDateStr(): string {
    const ts = Number(this.publication.registrationDate) * 1000;
    return new Date(ts).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get ipfsUrl(): string {
    return this.pinata.getGatewayUrl(this.publication.ipfsHash);
  }

  get shortHash(): string {
    const h = this.publication.contentHash;
    return `${h.slice(0, 10)}…${h.slice(-8)}`;
  }

  formatAddress(addr: string): string {
    return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
  }
}
