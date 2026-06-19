// frontend/src/app/components/form-wizard/form-wizard.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [],
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss'
})
export class FormWizardComponent {
  private router  = inject(Router);
  private svc     = inject(InvitadoService);

  nombre       = signal('');
  acompanante  = signal('');
  ninos314     = signal(0);
  ninos1518    = signal(0);
  alergias     = signal('');
  enviando     = signal(false);

  irAtras() { this.router.navigate(['/si-asiste']); }

  cambiar314(d: number)  { this.ninos314.update(v => Math.max(0, v + d)); }
  cambiar1518(d: number) { this.ninos1518.update(v => Math.max(0, v + d)); }

  async continuar() {
    if (!this.nombre().trim()) return;
    this.enviando.set(true);

    // Construye acompañantes a partir de los datos del form
    const acompanantes: import('../../services/invitado.service').AcompananteForm[] = [];
    if (this.acompanante().trim()) {
      acompanantes.push({ nombre: this.acompanante().trim(), tipo: 'Adulto', alergias: '' });
    }
    for (let i = 0; i < this.ninos314(); i++) {
      acompanantes.push({ nombre: `Niño ${i + 1} (3-14)`, tipo: 'Nino', alergias: '' });
    }
    for (let i = 0; i < this.ninos1518(); i++) {
      acompanantes.push({ nombre: `Joven ${i + 1} (15-18)`, tipo: 'Nino', alergias: '' });
    }

    this.svc.actualizarDatos({
      nombre:      this.nombre().trim(),
      alergias:    this.alergias().trim(),
      acompanantes
    });

    this.enviando.set(false);
    this.router.navigate(['/formulario-transporte']);
  }
}
