// frontend/src/app/components/form-transporte/form-transporte.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-transporte',
  standalone: true,
  imports: [],
  templateUrl: './form-transporte.component.html',
  styleUrl: './form-transporte.component.scss'
})
export class FormTransporteComponent implements OnInit {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  ida    = signal<'autobus' | 'coche'>('autobus');
  vuelta = signal<'autobus' | 'coche'>('autobus');

  ngOnInit() {
    const s = this.svc.formState();
    if (s.idaTransporte)    this.ida.set(s.idaTransporte);
    if (s.vueltaTransporte) this.vuelta.set(s.vueltaTransporte);
  }

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
