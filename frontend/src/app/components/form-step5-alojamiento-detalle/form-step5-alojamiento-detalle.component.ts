// frontend/src/app/components/form-step5-alojamiento-detalle/form-step5-alojamiento-detalle.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step5-alojamiento-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-step5-alojamiento-detalle.component.html',
  styleUrl: './form-step5-alojamiento-detalle.component.scss'
})
export class FormStep5AlojamientoDetalleComponent {
  readonly svc = inject(InvitadoService);

  readonly opciones = [
    { valor: 'individual', label: 'Habitación individual' },
    { valor: 'doble',      label: 'Habitación doble' },
    { valor: 'suite',      label: 'Suite' }
  ];

  tipoHab = signal(this.svc.formState().tipoAlojamiento || '');
  numHab = 1;
  errMsg = signal('');

  continuar() {
    if (!this.tipoHab()) { this.errMsg.set('Selecciona un tipo de habitación.'); return; }
    this.errMsg.set('');
    this.svc.actualizarDatos({ tipoAlojamiento: this.tipoHab() });
    this.svc.siguientePaso();
  }
}
