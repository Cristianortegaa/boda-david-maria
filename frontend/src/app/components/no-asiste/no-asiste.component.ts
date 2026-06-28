// frontend/src/app/components/no-asiste/no-asiste.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-no-asiste',
  standalone: true,
  imports: [],
  templateUrl: './no-asiste.component.html',
  styleUrl: './no-asiste.component.scss'
})
export class NoAsisteComponent {
  private router = inject(Router);
  private svc    = inject(InvitadoService);

  nombre   = signal('');
  enviando = signal(false);
  enviado  = signal(false);

  irAInicio() { this.router.navigate(['/']); }

  async confirmar() {
    if (!this.nombre().trim()) return;
    this.enviando.set(true);
    try {
      await this.svc.noAsiste(this.nombre().trim());
    } catch { /* silencioso */ }
    finally { this.enviando.set(false); }
    this.enviado.set(true);  // dead-end: no navegar, mostrar pantalla final
  }
}
