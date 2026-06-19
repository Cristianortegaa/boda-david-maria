// frontend/src/app/components/admin/admin.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface InvitadoAdmin {
  id: number;
  nombre: string;
  asiste: boolean;
  alergias?: string;
  necesitaBus: boolean;
  necesitaAlojamiento: boolean;
  acompanantes: { nombre: string; tipo: string }[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private http = inject(HttpClient);
  private readonly API = environment.apiUrl;
  private readonly CLAVE = 'boda2026secreto';

  clave        = signal('');
  autenticado  = signal(false);
  cargando     = signal(false);
  errorMsg     = signal('');
  invitados    = signal<InvitadoAdmin[]>([]);

  readonly excelUrl = `${this.API}/invitados/export?key=${this.CLAVE}`;

  readonly asistentes  = computed(() => this.invitados().filter(i => i.asiste));
  readonly noAsisten   = computed(() => this.invitados().filter(i => !i.asiste));
  readonly totalPersonas = computed(() =>
    this.asistentes().reduce((sum, i) => sum + 1 + (i.acompanantes?.length ?? 0), 0)
  );

  async entrar() {
    if (this.clave() !== this.CLAVE) {
      this.errorMsg.set('Clave incorrecta');
      return;
    }
    this.cargando.set(true);
    this.errorMsg.set('');
    try {
      const lista = await firstValueFrom(
        this.http.get<InvitadoAdmin[]>(`${this.API}/invitados`)
      );
      this.invitados.set(lista);
      this.autenticado.set(true);
    } catch {
      this.errorMsg.set('Error al cargar los invitados');
    } finally {
      this.cargando.set(false);
    }
  }

  onKeyEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') this.entrar();
  }
}
