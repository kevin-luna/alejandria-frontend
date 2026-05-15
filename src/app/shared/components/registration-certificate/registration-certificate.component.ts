import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import QRCode from 'qrcode';
import { EnvService } from '../../../core/services/env.service';
import { PUBLICATION_TYPE_LABELS } from '../../../core/models/publication.model';

export interface CertificateData {
  publicationId: bigint | null;
  txHash: string;
  title: string;
  pubType: number;
  institution: string;
  doi: string;
  contentHash: string;
  ipfsHash: string;
  authorNames: string[];
  registrant: string;
  registrationDate: Date;
}

@Component({
  selector: 'app-registration-certificate',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './registration-certificate.component.html',
  styleUrl: './registration-certificate.component.css',
})
export class RegistrationCertificateComponent implements OnInit {
  @Input({ required: true }) data!: CertificateData;

  private readonly env = inject(EnvService);

  txQrDataUrl: string | null = null;
  ipfsQrDataUrl: string | null = null;

  get pubTypeLabel(): string {
    return PUBLICATION_TYPE_LABELS[this.data.pubType as keyof typeof PUBLICATION_TYPE_LABELS] ?? 'Otro';
  }

  get formattedDate(): string {
    return this.data.registrationDate.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  get txUrl(): string {
    return this.env.explorerUrl ? `${this.env.explorerUrl}/tx/${this.data.txHash}` : '';
  }

  get ipfsUrl(): string {
    return this.data.ipfsHash ? `${this.env.pinataGatewayUrl}/${this.data.ipfsHash}` : '';
  }

  async ngOnInit(): Promise<void> {
    const opts: QRCode.QRCodeToDataURLOptions = {
      width: 148,
      margin: 1,
      color: { dark: '#1565C0', light: '#FFFFFF' },
    };
    if (this.txUrl)   this.txQrDataUrl   = await QRCode.toDataURL(this.txUrl,   opts);
    if (this.ipfsUrl) this.ipfsQrDataUrl = await QRCode.toDataURL(this.ipfsUrl, opts);
  }

  print(): void {
    window.print();
  }
}
