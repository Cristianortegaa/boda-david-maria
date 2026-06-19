// frontend/src/app/components/form-alojamiento-fuera/form-alojamiento-fuera.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-alojamiento-fuera',
  standalone: true,
  imports: [],
  templateUrl: './form-alojamiento-fuera.component.html',
  styleUrl: './form-alojamiento-fuera.component.scss'
})
export class FormAlojamientoFueraComponent {
  private router = inject(Router);
  private svc     = inject(InvitadoService);

  alojamientoFuera = signal<'si' | 'no'>('no');

  cerrar()   { this.router.navigate(['/']); }
  anterior() { this.router.navigate(['/formulario-alojamiento']); }

  confirmar() {
    this.router.navigate(['/confirmacion']);
  }
}
