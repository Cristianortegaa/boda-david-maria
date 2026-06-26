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

  async copyIban() {
    await copiarAlPortapapeles('ES29 1583 0001 1190 8967 3376');
    this.ibanCopiado.set(true);
    setTimeout(() => this.ibanCopiado.set(false), 2000);
  }
}

/** Copia texto al portapapeles con fallback para móviles */
async function copiarAlPortapapeles(texto: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(texto);
    return;
  } catch { /* continúa con el fallback */ }

  // Fallback: textarea temporal + execCommand
  const el = document.createElement('textarea');
  el.value = texto;
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;font-size:16px;';
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, texto.length); // iOS Safari
  try { document.execCommand('copy'); } catch { /* ignorar */ }
  document.body.removeChild(el);
}
