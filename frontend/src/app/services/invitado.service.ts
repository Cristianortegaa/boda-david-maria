// frontend/src/app/services/invitado.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AcompananteForm {
  nombre: string;
  tipo: 'Adulto' | 'Nino' | 'Bebe';
  alergias: string;
}

export interface FormState {
  // Paso 1 — ¿Asistes?  (gestionado por el wizard antes del formulario)
  // Paso 2 — Datos personales
  nombre: string;
  alergias: string;
  acompanantes: AcompananteForm[];

  // Paso 3 — Transporte
  necesitaBus: boolean | null;
  idaTransporte: 'autobus' | 'coche' | null;
  vueltaTransporte: 'autobus' | 'coche' | null;

  // Paso 4-5 — Alojamiento
  necesitaAlojamiento: boolean | null;
  tipoAlojamiento: string;
}

const INITIAL_STATE: FormState = {
  nombre: '',
  alergias: '',
  acompanantes: [],
  necesitaBus: null,
  idaTransporte: null,
  vueltaTransporte: null,
  necesitaAlojamiento: null,
  tipoAlojamiento: ''
};

@Injectable({ providedIn: 'root' })
export class InvitadoService {
  private readonly API = environment.apiUrl;

  // ── Estado del formulario (Signal) ────────────────────────────────────────
  readonly formState = signal<FormState>({ ...INITIAL_STATE });

  // Paso actual del wizard (1-6)
  readonly pasoActual = signal<number>(1);

  readonly totalPasos = 6;

  readonly progreso = computed(() =>
    Math.round((this.pasoActual() / this.totalPasos) * 100)
  );

  constructor(private http: HttpClient) {}

  // ── Mutadores ─────────────────────────────────────────────────────────────
  actualizarDatos(parcial: Partial<FormState>): void {
    this.formState.update(s => ({ ...s, ...parcial }));
  }

  agregarAcompanante(a: AcompananteForm): void {
    this.formState.update(s => ({ ...s, acompanantes: [...s.acompanantes, a] }));
  }

  eliminarAcompanante(index: number): void {
    this.formState.update(s => ({
      ...s,
      acompanantes: s.acompanantes.filter((_, i) => i !== index)
    }));
  }

  siguientePaso(): void {
    this.pasoActual.update(p => Math.min(p + 1, this.totalPasos));
  }

  anteriorPaso(): void {
    this.pasoActual.update(p => Math.max(p - 1, 1));
  }

  irAPaso(paso: number): void {
    this.pasoActual.set(paso);
  }

  resetear(): void {
    this.formState.set({ ...INITIAL_STATE });
    this.pasoActual.set(1);
  }

  // ── Envío final al backend ────────────────────────────────────────────────
  async submitForm(): Promise<{ id: number }> {
    const s = this.formState();
    const payload = {
      nombre:              s.nombre,
      alergias:            s.alergias || null,
      necesitaBus:         s.necesitaBus ?? false,
      necesitaAlojamiento: s.necesitaAlojamiento ?? false,
      tipoAlojamiento:     s.tipoAlojamiento || null,
      acompanantes:        s.acompanantes
    };
    return firstValueFrom(
      this.http.post<{ id: number }>(`${this.API}/invitados`, payload)
    );
  }

  // ── Votar regalo ──────────────────────────────────────────────────────────
  votarRegalo(opciones: string[], nombreInvitado: string = '') {
    return firstValueFrom(
      this.http.post(`${this.API}/regalos/votar`, { opciones, nombreInvitado })
    );
  }

  getOpcionesRegalos() {
    return this.http.get<string[]>(`${this.API}/regalos/opciones`);
  }

  getResultadosRegalos(): Promise<{opcion: string, votos: number}[]> {
    return firstValueFrom(
      this.http.get<{opcion: string, votos: number}[]>(`${this.API}/regalos/votos`)
    );
  }
}
