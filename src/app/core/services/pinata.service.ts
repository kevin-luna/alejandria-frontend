import { Injectable, inject } from '@angular/core';
import { EnvService } from './env.service';

// Pinata v3 API — uses API key (short token), not the legacy v2 JWT.
// Upload endpoint: https://uploads.pinata.cloud/v3/files
// Response shape: { data: { cid: string, name: string, ... } }

@Injectable({ providedIn: 'root' })
export class PinataService {
  private readonly env = inject(EnvService);
  private readonly uploadUrl = 'https://uploads.pinata.cloud/v3/files';

  async upload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('network', 'public'); // Pinata v3: public = pinned to IPFS network

    const response = await fetch(this.uploadUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.env.pinataJwt}` },
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Pinata ${response.status}: ${detail || response.statusText}`);
    }

    const json = await response.json();
    const cid: string = json?.data?.cid;

    if (!cid) {
      throw new Error('Pinata no devolvió un CID válido en la respuesta.');
    }

    return cid;
  }

  getGatewayUrl(cid: string): string {
    if (!cid) return '';
    return `${this.env.pinataGatewayUrl}/${cid}`;
  }
}
