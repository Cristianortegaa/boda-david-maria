// frontend/src/app/components/form-wizard/form-wizard.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [],
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss'
})
export class FormWizardComponent implements OnInit {
  private router  = inject(Router);
  private svc     = inject(InvitadoService);

  nombre       = signal('');
  acompanante  = signal('');
  ninos314     = signal(0);
  ninos1518    = signal(0);
  alergias     = signal('');
  enviando     = signal(false);

  ngOnInit() {
    // Restaurar estado guardado al volver atrás
    const s = this.svc.formState();
    if (s.nombre) this.nombre.set(s.nombre);
    if (s.alergias) this.alergias.set(s.alergias);

    // Restaurar acompañantes: primer adulto → campo de texto; niños → contadores
    const adultos  = s.acompanantes.filter(a => a.tipo === 'Adulto');
    const n314     = s.acompanantes.filter(a => a.tipo === 'Nino' && a.nombre.includes('3-14'));
    const n1518    = s.acompanantes.filter(a => a.tipo === 'Nino' && a.nombre.includes('15-18'));

    if (adultos.length) this.acompanante.set(adultos[0].nombre);
    if (n314.length)    this.ninos314.set(n314.length);
    if (n1518.length)   this.ninos1518.set(n1518.length);
  }

  irAtras() { this.router.navigate(['/si-asiste']); }

  cambiar314(d: number)  { this.ninos314.update(v => Math.max(0, v + d)); }
  cambiar1518(d: number) { this.ninos1518.update(v => Math.max(0, v + d)); }

  async continuar() {
    if (!this.nombre().trim()) return;
    this.enviando.set(true);

    const acompanantes: import('../../services/invitado.service').AcompananteForm[] = [];
    if (this.acompanante().trim()) {
      acompanantes.push({ nombre: this.acompanante().trim(), tipo: 'Adulto', alergias: '' });
    }
    for (let i = 0; i < this.ninos314(); i++) {
      acompanantes.push({ nombre: `Niño ${i + 1} (3-14)`, tipo: 'Nino', alergias: '' });
    }
    for (let i = 0; i < this.ninos1518(); i++) {
      acompanantes.push({ nombre: `Joven ${i + 1} (15-18)`, tipo: 'Nino', alergias: '' });
    }

    this.svc.actualizarDatos({
      nombre:      this.nombre().trim(),
      alergias:    this.alergias().trim(),
      acompanantes
    });

    this.enviando.set(false);
    this.router.navigate(['/formulario-transporte']);
  }
}
