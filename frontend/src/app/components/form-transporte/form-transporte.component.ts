// frontend/src/app/components/form-transporte/form-transporte.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-transporte',
  standalone: true,
  imports: [],
  templateUrl: './form-transporte.component.html',
  styleUrl: './form-transporte.component.scss'
})
export class FormTransporteComponent {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  ida    = signal<'autobus' | 'coche'>('autobus');
  vuelta = signal<'autobus' | 'coche'>('autobus');

  cerrar()   { this.router.navigate(['/']); }
  anterior() { this.router.navigate(['/formulario']); }
  continuar() {
    this.svc.actualizarDatos({
      idaTransporte:    this.ida(),
      vueltaTransporte: this.vuelta(),
    });
    this.router.navigate(['/formulario-alojamiento']);
  }
}
