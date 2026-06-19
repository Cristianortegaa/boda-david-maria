// frontend/src/app/components/desscode/desscode.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desscode',
  standalone: true,
  imports: [],
  templateUrl: './desscode.component.html',
  styleUrl: './desscode.component.scss'
})
export class DessCodeComponent {
  private router = inject(Router);
  irAInicio() { this.router.navigate(['/']); }
  copyIban()  { navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376'); }
}
