// frontend/src/app/components/admin/admin.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface InvitadoAdmin {
  id: number;
  nombre: string;
  asiste: boolean;
  alergias?: string;
  necesitaBus: boolean;
  necesitaAlojamiento: boolean;
  tipoAlojamiento?: string;
  idaTransporte?: string;
  vueltaTransporte?: string;
  comportamiento?: string;
  mensaje?: string;
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

  clave        = signal('');
  autenticado  = signal(false);
  cargando     = signal(false);
  errorMsg     = signal('');
  invitados    = signal<InvitadoAdmin[]>([]);
  busqueda     = signal('');
  filtro       = signal<'todos' | 'asisten' | 'no-asisten'>('todos');

  // La clave no está en el código: la comprueba el servidor con la que escribe el admin
  readonly excelUrl = computed(() => `${this.API}/invitados/export?key=${encodeURIComponent(this.clave())}`);

  readonly asistentes  = computed(() => this.invitados().filter(i => i.asiste));
  readonly noAsisten   = computed(() => this.invitados().filter(i => !i.asiste));
  readonly totalPersonas = computed(() =>
    this.asistentes().reduce((sum, i) => sum + 1 + (i.acompanantes?.length ?? 0), 0)
  );

  readonly invitadosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const f     = this.filtro();

    return this.invitados().filter(i => {
      const coincideTexto = !texto ||
        i.nombre.toLowerCase().includes(texto) ||
        i.acompanantes?.some(a => a.nombre.toLowerCase().includes(texto));
      const coincideFiltro =
        f === 'todos' ? true :
        f === 'asisten' ? i.asiste :
        !i.asiste;
      return coincideTexto && coincideFiltro;
    });
  });

  readonly asistentesVisibles  = computed(() => this.invitadosFiltrados().filter(i => i.asiste));
  readonly noAsistenVisibles   = computed(() => this.invitadosFiltrados().filter(i => !i.asiste));

  async entrar() {
    if (!this.clave().trim()) { this.errorMsg.set('Escribe la clave'); return; }
    this.cargando.set(true);
    this.errorMsg.set('');
    try {
      const lista = await firstValueFrom(this.http.get<InvitadoAdmin[]>(
        `${this.API}/invitados`, { params: { key: this.clave() } }));
      this.invitados.set(lista);
      this.autenticado.set(true);
    } catch (e) {
      this.errorMsg.set(e instanceof HttpErrorResponse && e.status === 401
        ? 'Clave incorrecta'
        : 'No se puede conectar con el servidor. Inténtalo más tarde.');
    } finally {
      this.cargando.set(false);
    }
  }

  onKeyEnter(e: KeyboardEvent) { if (e.key === 'Enter') this.entrar(); }

  async eliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    try {
      await firstValueFrom(
        this.http.delete(`${this.API}/invitados/${id}`, { params: { key: this.clave() } })
      );
      this.invitados.update(lista => lista.filter(i => i.id !== id));
    } catch {
      alert('Error al eliminar. Inténtalo de nuevo.');
    }
  }
}
