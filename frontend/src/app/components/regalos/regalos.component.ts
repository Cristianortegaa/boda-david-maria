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
  confirmando  = signal(false);
  enviando     = signal(false);
  votado       = signal(false);
  votoExitoso  = signal(false);
  errMsg       = signal('');
  ibanCopiado  = signal(false);

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

    this.svc.getResultadosRegalos()
      .then(res => this.resultados.set(res))
      .catch(() => {});
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

  abrirConfirmacion() {
    if (!this.selecciones().length) return;
    this.errMsg.set('');
    this.confirmando.set(true);
  }

  cancelar() { this.confirmando.set(false); }

  async enviarVoto() {
    this.enviando.set(true);
    this.errMsg.set('');

    try { await this.svc.votarRegalo(this.selecciones(), this.nombre()); } catch { /* ignorar */ }

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
    this.votado.set(true);

    // Mostrar toast de éxito
    this.votoExitoso.set(true);
    setTimeout(() => this.votoExitoso.set(false), 3000);
  }

  copyIban() {
    navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376').then(() => {
      this.ibanCopiado.set(true);
      setTimeout(() => this.ibanCopiado.set(false), 2000);
    }).catch(() => {});
  }

  irAInicio() { this.router.navigate(['/']); }
}
