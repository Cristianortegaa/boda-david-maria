// frontend/src/app/components/form-step1-inicio/form-step1-inicio.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step1-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-step1-inicio.component.html',
  styleUrl: './form-step1-inicio.component.scss'
})
export class FormStep1InicioComponent {
  readonly svc = inject(InvitadoService);
  private readonly router = inject(Router);

  asiste = signal<boolean | null>(null);
  mostrarAcomp = signal(false);
  nombreAcomp = '';
  errMsg = signal('');

  toggleAcomp() { this.mostrarAcomp.update(v => !v); }

  continuar() {
    if (this.asiste() === null) { this.errMsg.set('Selecciona Sí o No.'); return; }
    if (this.asiste() === false) { this.svc.resetear(); this.router.navigate(['/no-asiste']); return; }
    if (this.mostrarAcomp() && this.nombreAcomp.trim()) {
      this.svc.agregarAcompanante({ nombre: this.nombreAcomp.trim(), tipo: 'Adulto', alergias: '' });
    }
    this.errMsg.set('');
    this.svc.siguientePaso();
  }
}
