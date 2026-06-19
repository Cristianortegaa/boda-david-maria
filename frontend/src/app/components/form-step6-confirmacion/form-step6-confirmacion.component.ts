// frontend/src/app/components/form-step6-confirmacion/form-step6-confirmacion.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step6-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-step6-confirmacion.component.html',
  styleUrl: './form-step6-confirmacion.component.scss'
})
export class FormStep6ConfirmacionComponent {
  readonly svc = inject(InvitadoService);
  private readonly router = inject(Router);

  get estado() { return this.svc.formState(); }

  enviando  = signal(false);
  enviado   = signal(false);
  errorMsg  = signal('');

  readonly labelTipo: Record<string, string> = {
    Adulto: 'Adulto',
    Nino:   'Niño',
    Bebe:   'Bebé'
  };

  readonly labelAloj: Record<string, string> = {
    hotel_recinto: 'Hotel en el recinto',
    casa_rural:    'Casa rural cercana',
    por_mi_cuenta: 'Me lo busco yo'
  };

  async confirmar(): Promise<void> {
    this.enviando.set(true);
    this.errorMsg.set('');
    try {
      await this.svc.submitForm();
      this.enviado.set(true);
    } catch {
      this.errorMsg.set('Ha ocurrido un error. Inténtalo de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }

  volver(): void { this.svc.anteriorPaso(); }

  irAInicio(): void {
    this.svc.resetear();
    this.router.navigate(['/']);
  }
}
