// frontend/src/app/components/form-step3-transporte/form-step3-transporte.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step3-transporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-step3-transporte.component.html',
  styleUrl: './form-step3-transporte.component.scss'
})
export class FormStep3TransporteComponent {
  readonly svc = inject(InvitadoService);
  sel = signal<boolean | null>(this.svc.formState().necesitaBus);
  errMsg = signal('');

  continuar() {
    if (this.sel() === null) { this.errMsg.set('Selecciona una opción.'); return; }
    this.errMsg.set('');
    this.svc.actualizarDatos({ necesitaBus: this.sel()! });
    this.svc.siguientePaso();
  }
}
