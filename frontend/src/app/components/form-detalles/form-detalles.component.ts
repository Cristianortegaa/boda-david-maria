// frontend/src/app/components/form-detalles/form-detalles.component.ts
import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-detalles',
  standalone: true,
  imports: [],
  templateUrl: './form-detalles.component.html',
  styleUrl: './form-detalles.component.scss'
})
export class FormDetallesComponent implements OnInit {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  readonly opcionesComportamiento = [
    'Lloraré como una magdalena',
    'Me pondré mis mejores galas',
    'Gritaré “¡Viva los novios!”',
    'Estaré donde haya comida',
    'Yo solo vengo por la fiesta…'
  ];

  // Deben coincidir con OpcionesDisponibles de RegalosController
  readonly opcionesRegalo = [
    'Viaje de novios a Albacete',
    'La granja de PinyPon',
    'Tablero de Parchís y Oca',
    'Bote de proteínas',
    'Paté PREMIUM para los gatos'
  ];

  comportamiento = signal<string[]>([]);
  regalos        = signal<string[]>([]);
  mensaje        = signal('');

  constructor() {
    effect(() => {
      this.svc.actualizarDatos({
        comportamiento: this.comportamiento(),
        regalos:        this.regalos(),
        mensaje:        this.mensaje(),
      });
    });
  }

  ngOnInit() {
    const s = this.svc.formState();
    this.comportamiento.set(s.comportamiento);
    this.regalos.set(s.regalos);
    this.mensaje.set(s.mensaje);
  }

  toggleComportamiento(op: string) { this.comportamiento.update(l => toggle(l, op)); }
  toggleRegalo(op: string)         { this.regalos.update(l => toggle(l, op)); }

  cerrar()    { this.router.navigate(['/']); }
  anterior()  { this.router.navigate(['/formulario-alojamiento']); }
  confirmar() { this.router.navigate(['/confirmacion']); }
}

function toggle(lista: string[], op: string): string[] {
  return lista.includes(op) ? lista.filter(x => x !== op) : [...lista, op];
}
