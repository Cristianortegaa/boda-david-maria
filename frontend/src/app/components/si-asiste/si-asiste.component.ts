// frontend/src/app/components/si-asiste/si-asiste.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-si-asiste',
  standalone: true,
  imports: [],
  templateUrl: './si-asiste.component.html',
  styleUrl: './si-asiste.component.scss'
})
export class SiAsisteComponent {
  private router = inject(Router);
  irAInicio()     { this.router.navigate(['/']); }
  irAFormulario() { this.router.navigate(['/formulario']); }
}
