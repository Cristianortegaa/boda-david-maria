// frontend/src/app/components/form-alojamiento/form-alojamiento.component.ts
import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-alojamiento',
  standalone: true,
  imports: [],
  templateUrl: './form-alojamiento.component.html',
  styleUrl: './form-alojamiento.component.scss'
})
export class FormAlojamientoComponent implements OnInit {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  gestionaAlojamiento = signal<'si' | 'no'>('si');
  quiereGestion       = computed(() => this.gestionaAlojamiento() === 'si');

  constructor() {
    effect(() => {
      this.svc.actualizarDatos({
        necesitaAlojamiento: this.quiereGestion(),
      });
    });
  }

  ngOnInit() {
    const s = this.svc.formState();
    if (s.necesitaAlojamiento !== null) {
      this.gestionaAlojamiento.set(s.necesitaAlojamiento ? 'si' : 'no');
    }
  }

  cerrar()    { this.router.navigate(['/']); }
  anterior()  { this.router.navigate(['/formulario-transporte']); }
  confirmar() { this.router.navigate(['/confirmacion']); }
}
