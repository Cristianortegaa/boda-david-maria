// frontend/src/app/components/home/home.component.ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  menuOpen = signal(false);

  copyIban() {
    navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376');
  }
}
