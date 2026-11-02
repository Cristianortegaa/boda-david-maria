// frontend/src/app/components/form-alojamiento/form-alojamiento.component.ts
import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';
import { EncajarDirective } from '../encajar.directive';

@Component({
  selector: 'app-form-alojamiento',
  standalone: true,
  imports: [EncajarDirective],
  templateUrl: './form-alojamiento.component.html',
  styleUrl: './form-alojamiento.component.scss'
})
export class FormAlojamientoComponent implements OnInit {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  gestionaAlojamiento = signal<'si' | 'no'>('si');
  diasAlojamiento     = signal<'viernes-sabado' | 'sabado'>('viernes-sabado');
  quiereGestion       = computed(() => this.gestionaAlojamiento() === 'si');

  constructor() {
    effect(() => {
      this.svc.actualizarDatos({
        necesitaAlojamiento: this.quiereGestion(),
        tipoAlojamiento:     this.diasAlojamiento(),
      });
    });
  }

  ngOnInit() {
    const s = this.svc.formState();
    if (s.necesitaAlojamiento !== null) {
      this.gestionaAlojamiento.set(s.necesitaAlojamiento ? 'si' : 'no');
    }
    if (s.tipoAlojamiento === 'viernes-sabado' || s.tipoAlojamiento === 'sabado') {
      this.diasAlojamiento.set(s.tipoAlojamiento);
    }
  }

  cerrar()    { this.router.navigate(['/']); }
  anterior()  { this.router.navigate(['/formulario-transporte']); }
  continuar() { this.router.navigate(['/formulario-detalles']); }
}
