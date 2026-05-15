import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CertificateStateService } from '../../core/services/certificate-state.service';
import { RegistrationCertificateComponent } from '../../shared/components/registration-certificate/registration-certificate.component';
import type { CertificateData } from '../../shared/components/registration-certificate/registration-certificate.component';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [RegistrationCertificateComponent],
  template: `
    @if (data) {
      <app-registration-certificate [data]="data" />
    }
  `,
})
export class CertificateComponent implements OnInit {
  private readonly state  = inject(CertificateStateService);
  private readonly router = inject(Router);

  data: CertificateData | null = null;

  ngOnInit(): void {
    this.data = this.state.data();
    if (!this.data) {
      this.router.navigate(['/registrar']);
      return;
    }
    this.state.clear();
  }
}
