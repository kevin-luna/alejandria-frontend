import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { MetaMaskService } from '../../core/services/metamask.service';
import { PinataService } from '../../core/services/pinata.service';
import { TextNormalizer, type TextFieldKey } from '../../core/services/text-normalizer.service';
import { CertificateStateService } from '../../core/services/certificate-state.service';
import {
  PUBLICATION_TYPE_LABELS,
  PublicationType,
} from '../../core/models/publication.model';

type UploadStep = 'idle' | 'hashing' | 'checking' | 'uploading' | 'done' | 'error';
type SubmitStep = 'idle' | 'simulating' | 'awaiting-wallet' | 'mining' | 'done' | 'error';

const BYTES32_PATTERN = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contract = inject(ContractService);
  private readonly pinata = inject(PinataService);
  private readonly normalizer = inject(TextNormalizer);
  readonly metamask = inject(MetaMaskService);

  readonly publicationTypes = Object.entries(PUBLICATION_TYPE_LABELS).map(
    ([value, label]) => ({ value: Number(value) as PublicationType, label })
  );

  readonly uploadStep = signal<UploadStep>('idle');
  readonly uploadError = signal<string | null>(null);
  readonly selectedFileName = signal<string | null>(null);
  readonly duplicateHash = signal<boolean>(false);
  readonly checkingHash = signal<boolean>(false);

  private readonly certState = inject(CertificateStateService);
  private readonly router    = inject(Router);

  readonly submitStep  = signal<SubmitStep>('idle');
  readonly submitError = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    pubType: [null, Validators.required],
    institution: [''],
    doi: [''],
    contentHash: ['', [Validators.required, Validators.pattern(BYTES32_PATTERN)]],
    ipfsHash: [{ value: '', disabled: true }],
    authors: this.fb.array([this.buildAuthorGroup()]),
  });

  get authors(): FormArray {
    return this.form.get('authors') as FormArray;
  }

  get isSubmitting(): boolean {
    return ['simulating', 'awaiting-wallet', 'mining'].includes(this.submitStep());
  }

  get isBusy(): boolean {
    return this.isSubmitting || this.uploadStep() === 'checking' || this.checkingHash();
  }

  private buildAuthorGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.pattern(ADDRESS_PATTERN)],
    });
  }

  normalizeField(field: TextFieldKey): void {
    const ctrl = this.form.get(field);
    if (!ctrl) return;
    ctrl.setValue(this.normalizer.normalize(ctrl.value ?? '', field), { emitEvent: false });
  }

  normalizeAuthorName(index: number): void {
    const ctrl = this.authors.at(index)?.get('name');
    if (!ctrl) return;
    ctrl.setValue(this.normalizer.normalize(ctrl.value ?? '', 'authorName'), { emitEvent: false });
  }

  private normalizeAllFields(): void {
    (['title', 'institution', 'doi'] as TextFieldKey[]).forEach((f) => this.normalizeField(f));
    this.authors.controls.forEach((_, i) => this.normalizeAuthorName(i));
  }

  addAuthor(): void {
    this.authors.push(this.buildAuthorGroup());
  }

  removeAuthor(index: number): void {
    if (this.authors.length > 1) this.authors.removeAt(index);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFileName.set(file.name);
    this.uploadStep.set('hashing');
    this.uploadError.set(null);
    this.duplicateHash.set(false);

    try {
      // Compute SHA-256 using the Web Crypto API
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const contentHash = `0x${hex}` as `0x${string}`;
      this.form.patchValue({ contentHash });

      // Verify the hash is not already registered before uploading to IPFS
      this.uploadStep.set('checking');
      const alreadyRegistered = await this.isHashRegistered(contentHash);
      if (alreadyRegistered) {
        this.duplicateHash.set(true);
        this.uploadError.set('Este documento ya está registrado en la blockchain.');
        this.uploadStep.set('error');
        return;
      }

      // Upload to Pinata
      this.uploadStep.set('uploading');
      const cid = await this.pinata.upload(file);
      this.form.patchValue({ ipfsHash: cid });
      this.uploadStep.set('done');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al procesar el archivo.';
      this.uploadError.set(msg);
      this.uploadStep.set('error');
    } finally {
      input.value = '';
    }
  }

  async checkHashManually(): Promise<void> {
    const ctrl = this.form.get('contentHash');
    if (!ctrl || ctrl.invalid || !ctrl.value) return;

    this.duplicateHash.set(false);
    this.checkingHash.set(true);
    try {
      const alreadyRegistered = await this.isHashRegistered(ctrl.value as `0x${string}`);
      this.duplicateHash.set(alreadyRegistered);
    } finally {
      this.checkingHash.set(false);
    }
  }

  private async isHashRegistered(hash: `0x${string}`): Promise<boolean> {
    try {
      await this.contract.getByHash(hash);
      return true;
    } catch {
      return false;
    }
  }

  triggerFileInput(input: HTMLInputElement): void {
    input.click();
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting || this.duplicateHash() || this.checkingHash()) return;
    if (!this.metamask.isConnected()) {
      this.submitError.set('Conecta tu wallet MetaMask antes de registrar.');
      return;
    }

    this.normalizeAllFields();

    const { title, pubType, institution, doi, contentHash, ipfsHash, authors } =
      this.form.getRawValue();

    const authorNames = (authors as { name: string; address: string }[]).map(
      (a) => a.name
    );
    const authorAddresses = (authors as { name: string; address: string }[])
      .map((a) => a.address?.trim() || null)
      .map((a) => (a && ADDRESS_PATTERN.test(a) ? (a as `0x${string}`) : ('0x0000000000000000000000000000000000000000' as `0x${string}`)));

    this.submitStep.set('simulating');
    this.submitError.set(null);

    try {
      this.submitStep.set('awaiting-wallet');
      const res = await this.contract.register({
        title,
        pubType,
        institution: institution ?? '',
        doi: doi ?? '',
        contentHash: contentHash as `0x${string}`,
        ipfsHash: ipfsHash ?? '',
        authorNames,
        authorAddresses,
      });
      this.certState.set({
        publicationId:    res.publicationId,
        txHash:           res.txHash,
        title,
        pubType,
        institution:      institution ?? '',
        doi:              doi ?? '',
        contentHash,
        ipfsHash:         ipfsHash ?? '',
        authorNames,
        registrant:       this.metamask.account()!,
        registrationDate: new Date(),
      });
      this.form.reset();
      this.resetAuthors();
      this.router.navigate(['/certificado']);
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      this.submitError.set(this.parseContractError(raw));
      this.submitStep.set('error');
    }
  }

  private resetAuthors(): void {
    this.authors.clear();
    this.authors.push(this.buildAuthorGroup());
  }

  private parseContractError(msg: string): string {
    if (msg.includes('ContentHashAlreadyRegistered'))
      return 'Este documento ya fue registrado previamente (hash duplicado).';
    if (msg.includes('EmptyTitle'))
      return 'El título no puede estar vacío.';
    if (msg.includes('InvalidContentHash'))
      return 'El hash del contenido no es válido.';
    if (msg.includes('User rejected') || msg.includes('user rejected'))
      return 'La transacción fue rechazada desde MetaMask.';
    if (msg.includes('insufficient funds'))
      return 'Fondos insuficientes para pagar el gas.';
    return 'Error al registrar la publicación. Revisa la consola para más detalles.';
  }

  get submitStatusLabel(): string {
    switch (this.submitStep()) {
      case 'simulating':     return 'Validando…';
      case 'awaiting-wallet': return 'Esperando MetaMask…';
      case 'mining':         return 'Minando transacción…';
      default:               return 'Registrar Publicación';
    }
  }
}
