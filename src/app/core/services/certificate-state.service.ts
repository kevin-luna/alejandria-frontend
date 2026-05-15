import { Injectable, signal } from '@angular/core';
import type { CertificateData } from '../../shared/components/registration-certificate/registration-certificate.component';

@Injectable({ providedIn: 'root' })
export class CertificateStateService {
  private readonly _data = signal<CertificateData | null>(null);

  readonly data = this._data.asReadonly();

  set(data: CertificateData): void {
    this._data.set(data);
  }

  clear(): void {
    this._data.set(null);
  }
}
