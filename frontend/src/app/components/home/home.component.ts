// frontend/src/app/components/home/home.component.ts
import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

type EstadoSobre = 'cerrado' | 'abriendo' | 'abierto';

// El sobre solo se muestra al entrar en la web; si el invitado vuelve a la
// home desde el formulario ya aparece abierto.
let sobreYaAbierto = false;

// Duración total de la animación de apertura (debe cuadrar con el SCSS)
const DURACION_APERTURA_MS = 1500;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  estado = signal<EstadoSobre>(sobreYaAbierto ? 'abierto' : 'cerrado');

  private timer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit() {
    const v = this.videoEl.nativeElement;
    v.muted = true;
    v.play().catch(() => {});

    if (this.estado() === 'cerrado') {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    document.body.style.overflow = '';
  }

  abrirSobre() {
    if (this.estado() !== 'cerrado') return;
    this.estado.set('abriendo');
    sobreYaAbierto = true;

    // El vídeo empieza desde el principio justo cuando se descubre
    const v = this.videoEl.nativeElement;
    v.currentTime = 0;
    v.play().catch(() => {});

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.timer = setTimeout(() => {
      this.estado.set('abierto');
      document.body.style.overflow = '';
    }, reducido ? 300 : DURACION_APERTURA_MS);
  }
}
