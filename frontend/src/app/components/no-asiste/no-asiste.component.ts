// frontend/src/app/components/no-asiste/no-asiste.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-asiste',
  standalone: true,
  imports: [],
  templateUrl: './no-asiste.component.html',
  styleUrl: './no-asiste.component.scss'
})
export class NoAsisteComponent {
  private router = inject(Router);
  nombre = signal('');

  irAInicio() { this.router.navigate(['/']); }

  confirmar() {
    // TODO: enviar al backend si se necesita registrar ausencias
    this.router.navigate(['/']);
  }
}
