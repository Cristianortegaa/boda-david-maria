// frontend/src/app/components/regalos/regalos.component.ts
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-regalos',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './regalos.component.html',
  styleUrl: './regalos.component.scss'
})
export class RegalosComponent implements OnInit {
  private readonly svc    = inject(InvitadoService);
  private readonly router = inject(Router);

  opciones     = signal<string[]>([]);
  selecciones  = signal<string[]>([]);
  resultados   = signal<{opcion: string, votos: number}[]>([]);
  nombre       = signal('');
  confirmando  = signal(false);   // muestra el bottom sheet
  enviando     = signal(false);
  votado       = signal(false);
  errMsg       = signal('');

  maxVotos = computed(() => Math.max(...this.resultados().map(r => r.votos), 1));

  ngOnInit() {
    const fallback = [
      'Viaje de novios',
      'La granja de PinyPon',
      'Tablero de Parchís y Oca',
      'Bote de proteínas',
      'Paté PREMIUM para los gatos'
    ];

    this.svc.getOpcionesRegalos().subscribe({
      next:  ops => this.opciones.set(ops),
      error: ()  => this.opciones.set(fallback)
    });

    // Carga votos actuales en tiempo real al abrir la página
    this.svc.getResultadosRegalos()
      .then(res => this.resultados.set(res))
      .catch(() => {}); // backend offline → sin barras, no pasa nada
  }

  toggle(op: string) {
    this.selecciones.update(s =>
      s.includes(op) ? s.filter(x => x !== op) : [...s, op]
    );
  }

  isSelected(op: string) { return this.selecciones().includes(op); }

  getVotos(op: string) {
    return this.resultados().find(r => r.opcion === op)?.votos ?? 0;
  }

  getPorcentaje(op: string) {
    const max = this.maxVotos();
    return max ? (this.getVotos(op) / max) * 100 : 0;
  }

  // Abre el bottom sheet de confirmación
  abrirConfirmacion() {
    if (!this.selecciones().length) return;
    this.errMsg.set('');
    this.confirmando.set(true);
  }

  cancelar() { this.confirmando.set(false); }

  // Envía el voto real al backend y muestra resultados
  async enviarVoto() {
    this.enviando.set(true);
    this.errMsg.set('');

    // Enviar al backend (ignorar errores para no bloquear la UX)
    try { await this.svc.votarRegalo(this.selecciones(), this.nombre()); } catch { /* ignorar */ }

    // Obtener resultados reales o usar mock
    try {
      const res = await this.svc.getResultadosRegalos();
      this.resultados.set(res);
    } catch {
      const base = [22, 7, 15, 3, 5];
      this.resultados.set(
        this.opciones().map((op, i) => ({
          opcion: op,
          votos:  base[i] ?? Math.floor(Math.random() * 10) + 1
        }))
      );
    }

    this.enviando.set(false);
    this.confirmando.set(false);
    this.router.navigate(['/']);
  }

  copyIban() {
    navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376');
  }

  irAInicio() { this.router.navigate(['/']); }
}
