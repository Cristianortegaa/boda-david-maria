// frontend/src/app/components/form-step4-alojamiento/form-step4-alojamiento.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step4-alojamiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-step4-alojamiento.component.html',
  styleUrl: './form-step4-alojamiento.component.scss'
})
export class FormStep4AlojamientoComponent {
  readonly svc = inject(InvitadoService);
  sel = signal<boolean | null>(this.svc.formState().necesitaAlojamiento);
  errMsg = signal('');

  continuar() {
    if (this.sel() === null) { this.errMsg.set('Selecciona una opción.'); return; }
    this.errMsg.set('');
    this.svc.actualizarDatos({ necesitaAlojamiento: this.sel()! });
    this.sel() ? this.svc.siguientePaso() : this.svc.irAPaso(6);
  }
}
