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

  enviando    = signal(false);
  error       = signal('');
  ibanCopiado = signal(false);

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

  async copyIban() {
    await copiarAlPortapapeles('ES29 1583 0001 1190 8967 3376');
    this.ibanCopiado.set(true);
    setTimeout(() => this.ibanCopiado.set(false), 2000);
  }

  irAInicio() { this.router.navigate(['/']); }
}

/** Copia texto al portapapeles con fallback para móviles */
async function copiarAlPortapapeles(texto: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(texto);
    return;
  } catch { /* continúa con el fallback */ }

  const el = document.createElement('textarea');
  el.value = texto;
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;font-size:16px;';
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, texto.length);
  try { document.execCommand('copy'); } catch { /* ignorar */ }
  document.body.removeChild(el);
}
