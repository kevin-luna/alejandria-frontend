import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { Publication } from '../../core/models/publication.model';
import { ContractService } from '../../core/services/contract.service';
import { PublicationCardComponent } from '../../shared/components/publication-card/publication-card.component';

export type SearchMode = 'id' | 'hash' | 'doi';

const HASH_REGEX = /^0x[0-9a-fA-F]{64}$/;

@Component({
  selector: 'app-search-by-id',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    ProgressSpinnerModule,
    MessageModule,
    PublicationCardComponent,
  ],
  templateUrl: './search-by-id.component.html',
  styleUrl: './search-by-id.component.css',
})
export class SearchByIdComponent {
  private readonly contract = inject(ContractService);

  readonly searchMode = signal<SearchMode>('id');
  searchValue = '';
  readonly loading = signal(false);
  readonly publication = signal<Publication | null>(null);
  readonly error = signal<string | null>(null);

  onModeChange(mode: SearchMode): void {
    this.searchMode.set(mode);
    this.searchValue = '';
    this.publication.set(null);
    this.error.set(null);
  }

  get inputPlaceholder(): string {
    switch (this.searchMode()) {
      case 'id':   return 'Ej. 1';
      case 'hash': return 'Ej. 0x1a2b3c…';
      case 'doi':  return 'Ej. 10.1000/xyz123';
    }
  }

  get inputLabel(): string {
    switch (this.searchMode()) {
      case 'id':   return 'ID de Publicación';
      case 'hash': return 'Hash de Contenido (bytes32)';
      case 'doi':  return 'DOI / Identificador externo';
    }
  }

  get inputIcon(): string {
    switch (this.searchMode()) {
      case 'id':   return 'tag';
      case 'hash': return 'fingerprint';
      case 'doi':  return 'link';
    }
  }

  async search(): Promise<void> {
    const raw = String(this.searchValue ?? '').trim();

    this.loading.set(true);
    this.publication.set(null);
    this.error.set(null);

    try {
      const result = await this.dispatchSearch(raw);
      this.publication.set(result);
    } catch (e: unknown) {
      this.error.set(this.buildErrorMessage(e, raw));
    } finally {
      this.loading.set(false);
    }
  }

  private async dispatchSearch(raw: string): Promise<Publication> {
    switch (this.searchMode()) {
      case 'id': {
        const id = parseInt(raw, 10);
        if (!raw || isNaN(id) || id <= 0)
          throw new ValidationError('Ingresa un ID válido (número entero mayor a 0).');
        return this.contract.getPublication(BigInt(id));
      }
      case 'hash': {
        if (!HASH_REGEX.test(raw))
          throw new ValidationError('Ingresa un hash válido: 0x seguido de 64 caracteres hexadecimales.');
        return this.contract.getByHash(raw as `0x${string}`);
      }
      case 'doi': {
        if (!raw)
          throw new ValidationError('Ingresa un DOI para buscar.');
        return this.contract.getByDoi(raw);
      }
    }
  }

  private buildErrorMessage(e: unknown, raw: string): string {
    if (e instanceof ValidationError) return e.message;

    const msg = e instanceof Error ? e.message : String(e);

    if (msg.includes('PublicationNotFound'))
      return `No existe ninguna publicación con el ID ${raw}.`;
    if (msg.includes('HashNotFound'))
      return 'No existe ninguna publicación registrada con ese hash de contenido.';
    if (msg.includes('DoiNotFound'))
      return `No existe ninguna publicación registrada con el DOI "${raw}".`;
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('ECONNREFUSED'))
      return 'No se pudo conectar al nodo local. Verifica que Hardhat esté corriendo en http://127.0.0.1:8545.';

    console.error('[ContractService]', e);
    return 'Error inesperado al consultar el contrato. Revisa la consola para más detalles.';
  }
}

class ValidationError extends Error {}
