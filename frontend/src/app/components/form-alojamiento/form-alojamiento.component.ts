// frontend/src/app/components/form-alojamiento/form-alojamiento.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
  private svc     = inject(InvitadoService);

  gestionaAlojamiento = signal<'si' | 'no'>('si');
  diasAlojamiento     = signal<'viernes-sabado' | 'sabado'>('viernes-sabado');

  quiereGestion = computed(() => this.gestionaAlojamiento() === 'si');

  ngOnInit() {
    const s = this.svc.formState();
    if (s.necesitaAlojamiento !== null) {
      this.gestionaAlojamiento.set(s.necesitaAlojamiento ? 'si' : 'no');
    }
  }

  cerrar()   { this.router.navigate(['/']); }
  anterior() { this.router.navigate(['/formulario-transporte']); }

  confirmar() {
    this.svc.actualizarDatos({
      necesitaAlojamiento: this.quiereGestion(),
    });
    this.router.navigate(['/confirmacion']);
  }
}
