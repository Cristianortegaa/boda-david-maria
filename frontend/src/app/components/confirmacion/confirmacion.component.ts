// frontend/src/app/components/confirmacion/confirmacion.component.ts
import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.scss'
})
export class ConfirmacionComponent implements OnInit {
  private router = inject(Router);
  readonly svc   = inject(InvitadoService);

  readonly state = computed(() => this.svc.formState());

  enviando = signal(false);
  error    = signal('');

  readonly resumenTransporte = computed(() => {
    const s = this.svc.formState();
    const ida    = s.idaTransporte    === 'coche' ? 'Coche' : 'Autobús';
    const vuelta = s.vueltaTransporte === 'coche' ? 'Coche' : 'Autobús';
    return `Ida: ${ida}  ·  Vuelta: ${vuelta}`;
  });

  readonly resumenAcompanantes = computed(() => {
    const a = this.svc.formState().acompanantes;
    if (!a.length) return 'Sin acompañantes';
    return a.map(x => x.nombre).join(', ');
  });

  readonly resumenAlojamiento = computed(() => {
    return this.svc.formState().necesitaAlojamiento ? 'Sí' : 'No';
  });

  async ngOnInit(): Promise<void> {
    // Si no hay nombre (p.ej. el usuario abrió esta URL directamente), no enviar
    if (!this.svc.formState().nombre) return;

    this.enviando.set(true);
    try {
      await this.svc.submitForm();
    } catch {
      this.error.set('No se pudo guardar tu confirmación. Vuelve atrás e inténtalo de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }

  copyIban() {
    navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376').catch(() => {});
  }

  irAInicio() { this.router.navigate(['/']); }
}
