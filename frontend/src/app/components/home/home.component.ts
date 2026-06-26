// frontend/src/app/components/home/home.component.ts
import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  menuOpen    = signal(false);
  ibanCopiado = signal(false);

  ngAfterViewInit() {
    const v = this.videoEl.nativeElement;
    v.muted = true;
    v.play().catch(() => {});
  }

  copyIban() {
    navigator.clipboard.writeText('ES29 1583 0001 1190 8967 3376').then(() => {
      this.ibanCopiado.set(true);
      setTimeout(() => this.ibanCopiado.set(false), 2000);
    }).catch(() => {});
  }
}
