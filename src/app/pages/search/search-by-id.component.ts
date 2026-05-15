import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { Publication } from '../../core/models/publication.model';
import { ContractService } from '../../core/services/contract.service';
import { PublicationCardComponent } from '../../shared/components/publication-card/publication-card.component';

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
    ProgressSpinnerModule,
    MessageModule,
    PublicationCardComponent,
  ],
  templateUrl: './search-by-id.component.html',
  styleUrl: './search-by-id.component.css',
})
export class SearchByIdComponent {
  private readonly contract = inject(ContractService);

  searchId: string | number = '';
  readonly loading = signal(false);
  readonly publication = signal<Publication | null>(null);
  readonly error = signal<string | null>(null);

  async search(): Promise<void> {
    const raw = String(this.searchId ?? '').trim();
    const id = parseInt(raw, 10);

    if (!raw || isNaN(id) || id <= 0) {
      this.error.set('Ingresa un ID válido (número entero mayor a 0).');
      return;
    }

    this.loading.set(true);
    this.publication.set(null);
    this.error.set(null);

    try {
      const result = await this.contract.getPublication(BigInt(id));
      this.publication.set(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('PublicationNotFound') || msg.includes('revert') || msg.includes('0x')) {
        this.error.set(`No existe ninguna publicación con el ID ${id}.`);
      } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('ECONNREFUSED')) {
        this.error.set('No se pudo conectar al nodo local. Verifica que Hardhat esté corriendo en http://127.0.0.1:8545.');
      } else {
        this.error.set('Error inesperado al consultar el contrato. Revisa la consola para más detalles.');
        console.error('[ContractService]', e);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
