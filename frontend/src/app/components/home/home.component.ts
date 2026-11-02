// frontend/src/app/components/home/home.component.ts
import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

type EstadoSobre = 'cerrado' | 'abriendo' | 'abierto';
type TipoPieza = 'petalo' | 'flor' | 'hoja' | 'arroz' | 'destello';

// El sobre solo se muestra al entrar en la web; si el invitado vuelve a la
// home desde el formulario ya aparece abierto.
let sobreYaAbierto = false;

// ── Cronología de la apertura (ms desde el toque; debe cuadrar con el SCSS) ──
const DURACION_APERTURA_MS = 5400;   // se retira el sobre y se desbloquea el scroll
const T_PETALOS_SOBRE      = 2350;   // estallan pétalos por la abertura cuando sale la carta
const T_ARROZ              = [4900, 5400, 5950];   // tandas de arroz, ya con la invitación detrás
const LIMPIEZA_MS          = 13000;  // respaldo: borra lo que quede

const COLORES_PETALO = ['#F3D8C5', '#E8B4A0', '#F7E7DC', '#FFFFFF', '#EBA9A1', '#F9D9CF', '#C62F3B', '#F3D8C5'];
// La mitad de las flores son rojas
const COLORES_FLOR   = ['#C62F3B', '#D94A4A', '#A61E2D', '#C62F3B', '#F3D8C5', '#FFFFFF', '#E8B4A0'];
const COLOR_HOJA     = '#6A6B4B';
const COLOR_CENTRO   = '#E9C46A';

/** Parámetros físicos de una pieza: lanzamiento con rozamiento del aire. */
interface Vuelo {
  x0: number; y0: number;        // origen (px)
  vx: number; vy: number;        // velocidad inicial (px/s)
  k: number;                     // rozamiento: más alto = frena antes (pétalo) que el arroz
  g: number;                     // gravedad (px/s²); g/k = velocidad máxima de caída
  vaiven: number;                // amplitud del balanceo lateral (px)
  frecuencia: number;            // velocidad del balanceo (rad/s)
  giro: number;                  // rotación en el plano (grados/s)
  volteo: number;                // amplitud del volteo 3D (grados)
  escala: number;
  duracion: number;              // ms
  retraso: number;               // ms
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl')       videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('celebracionEl') celebracionEl!: ElementRef<HTMLDivElement>;

  estado    = signal<EstadoSobre>(sobreYaAbierto ? 'abierto' : 'cerrado');
  // Se queda a true tras abrir para que las animaciones de entrada de la home
  // terminen aunque el sobre ya se haya retirado
  revelando = signal(false);

  private timers: ReturnType<typeof setTimeout>[] = [];

  ngAfterViewInit() {
    const v = this.videoEl.nativeElement;
    v.muted = true;
    v.play().catch(() => {});

    if (this.estado() === 'cerrado') {
      window.scrollTo(0, 0);
      bloquearScroll(true);
    }
  }

  ngOnDestroy() {
    this.timers.forEach(clearTimeout);
    this.celebracionEl?.nativeElement.replaceChildren();
    bloquearScroll(false);
  }

  abrirSobre() {
    if (this.estado() !== 'cerrado') return;
    this.estado.set('abriendo');
    this.revelando.set(true);
    sobreYaAbierto = true;

    navigator.vibrate?.([12, 70, 20]);

    // El vídeo empieza desde el principio justo cuando se descubre
    const v = this.videoEl.nativeElement;
    v.currentTime = 0;
    v.play().catch(() => {});

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducido) {
      this.programar(T_PETALOS_SOBRE, () => this.petalosDelSobre());
      T_ARROZ.forEach((t, tanda) => this.programar(t, () => this.lanzarArroz(tanda)));
      this.programar(LIMPIEZA_MS, () => this.celebracionEl.nativeElement.replaceChildren());
    }
    this.programar(reducido ? 350 : DURACION_APERTURA_MS, () => {
      this.estado.set('abierto');
      bloquearScroll(false);
    });
  }

  private programar(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms));
  }

  // ── Escenas ────────────────────────────────────────────────────────────────

  /** Al abrirse, salen pétalos, flores, hojas y destellos de dentro del sobre. */
  private petalosDelSobre() {
    const { width: W, height: H } = this.lienzo();
    const piezas: [TipoPieza, number][] = [['petalo', 34], ['flor', 10], ['hoja', 6], ['destello', 10]];
    for (const [tipo, n] of piezas) {
      for (let i = 0; i < n; i++) {
        const angulo = -Math.PI / 2 + azar(-1.35, 1.35);
        const fuerza = tipo === 'destello' ? azar(260, 520) : azar(380, 760);
        this.volar(tipo, {
          x0: W / 2 + azar(-60, 60), y0: H * 0.49 - 120,   // por la abertura, junto a la carta
          vx: Math.cos(angulo) * fuerza, vy: Math.sin(angulo) * fuerza,
          k: tipo === 'destello' ? 3 : 2.4,
          g: tipo === 'destello' ? 150 : 520,
          vaiven: azar(14, 34), frecuencia: azar(2.5, 4.5),
          giro: azar(-220, 220), volteo: tipo === 'destello' ? 0 : azar(50, 85),
          escala: azar(0.75, 1.25),
          duracion: tipo === 'destello' ? azar(1400, 2000) : azar(3200, 4400),
          retraso: azar(0, 140),
        });
      }
    }
  }

  /**
   * Como a la salida de la iglesia: los invitados lanzan puñados de arroz desde
   * los dos lados. Los granos de un puñado salen juntos y se abren en abanico.
   */
  private lanzarArroz(tanda: number) {
    const { width: W, height: H } = this.lienzo();
    const punados = tanda === 1 ? 4 : 3;
    for (const lado of [-1, 1]) {
      for (let p = 0; p < punados; p++) {
        const x0 = lado < 0 ? -6 : W + 6;
        const y0 = H * azar(0.55, 0.9);
        const vx = -lado * azar(300, 520);
        const vy = -azar(700, 980);
        const retraso = p * azar(110, 190) + azar(0, 60);
        for (let i = 0; i < 11; i++) {
          this.volar('arroz', {
            x0: x0 + azar(-6, 6), y0: y0 + azar(-10, 10),
            vx: vx * azar(0.8, 1.2), vy: vy * azar(0.85, 1.1),
            k: 1.7, g: 760,              // queda más tiempo en el aire: cae a ≈450 px/s
            vaiven: 0, frecuencia: 0,
            giro: azar(-1400, 1400), volteo: azar(0, 70),
            escala: azar(0.9, 1.2),
            duracion: azar(2300, 3000),
            retraso: retraso + azar(0, 70),
          });
        }
        // Algún pétalo va mezclado en el puñado
        if (p === 0) {
          this.volar('petalo', {
            x0, y0, vx: vx * 0.8, vy: vy * 0.8,
            k: 2.2, g: 560, vaiven: azar(16, 30), frecuencia: azar(3, 5),
            giro: azar(-300, 300), volteo: azar(50, 80), escala: azar(0.9, 1.15),
            duracion: azar(2800, 3600), retraso,
          });
        }
      }
    }
  }


  // ── Motor ──────────────────────────────────────────────────────────────────

  private lienzo() {
    return this.celebracionEl.nativeElement.getBoundingClientRect();
  }

  private volar(tipo: TipoPieza, v: Vuelo) {
    const pieza = crearPieza(tipo);
    this.celebracionEl.nativeElement.appendChild(pieza);

    const pasos = 18;
    const fase  = azar(0, Math.PI * 2);
    const seg   = v.duracion / 1000;
    const frames: Keyframe[] = [];

    for (let i = 0; i <= pasos; i++) {
      const p = i / pasos;
      const s = p * seg;
      const frenado = (1 - Math.exp(-v.k * s)) / v.k;
      // Rozamiento lineal: sube rápido, frena y cae a velocidad constante g/k
      const x = v.x0 + v.vx * frenado + v.vaiven * Math.sin(v.frecuencia * s + fase) * (1 - Math.exp(-2 * s));
      const y = v.y0 + (v.vy - v.g / v.k) * frenado + (v.g / v.k) * s;
      const vuelta = v.volteo * Math.sin(v.frecuencia * 1.3 * s + fase);
      frames.push({
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(v.giro * s).toFixed(1)}deg) ` +
                   `rotateX(${vuelta.toFixed(1)}deg) rotateY(${(vuelta * 0.6).toFixed(1)}deg) scale(${v.escala})`,
        opacity: p < 0.04 ? p / 0.04 : p > 0.82 ? (1 - p) / 0.18 : 1,
        offset: p,
      });
    }

    pieza.animate(frames, { duration: v.duracion, delay: v.retraso, easing: 'linear', fill: 'both' })
      .onfinish = () => pieza.remove();
  }
}

// ── Utilidades ───────────────────────────────────────────────────────────────

function azar(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function elegir<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

/** html y body: el scroll de la página lo lleva html (tiene overflow-x en styles.scss). */
function bloquearScroll(bloquear: boolean) {
  const valor = bloquear ? 'hidden' : '';
  document.documentElement.style.overflow = valor;
  document.body.style.overflow = valor;
}

/** Crea el elemento de una pieza. Los SVG son constantes; no llevan datos del usuario. */
function crearPieza(tipo: TipoPieza): HTMLElement {
  const el = document.createElement('span');
  el.className = `pieza pieza--${tipo}`;

  switch (tipo) {
    case 'arroz':
      break;

    case 'destello':
      el.textContent = '✦';
      break;

    case 'petalo': {
      const color = elegir(COLORES_PETALO);
      const borde = color === '#FFFFFF' ? ' stroke="#E6D9CE" stroke-width=".8"' : '';
      el.style.width = '14px';
      el.style.height = '19px';
      el.innerHTML =
        `<svg viewBox="0 0 20 28"><path d="M10 0C17 7 18.5 18 10 28C1.5 18 3 7 10 0Z" fill="${color}"${borde}/>` +
        `<path d="M10 0C3 7 1.5 18 10 28C6 19 6 8 10 0Z" fill="#fff" opacity=".35"/>` +
        `<path d="M10 3C12.5 9 13 17 10 25" stroke="rgba(120,70,50,.12)" stroke-width=".8" fill="none"/></svg>`;
      break;
    }

    case 'flor': {
      const color = elegir(COLORES_FLOR);
      const borde = color === '#FFFFFF' ? ' stroke="#E6D9CE" stroke-width=".6"' : '';
      const petalos = [0, 72, 144, 216, 288]
        .map(r => `<ellipse cx="12" cy="6.5" rx="3.8" ry="5.8" fill="${color}"${borde} transform="rotate(${r} 12 12)"/>`)
        .join('');
      el.style.width = '20px';
      el.style.height = '20px';
      el.innerHTML = `<svg viewBox="0 0 24 24">${petalos}<circle cx="12" cy="12" r="3" fill="${COLOR_CENTRO}"/></svg>`;
      break;
    }

    case 'hoja':
      el.style.width = '18px';
      el.style.height = '10px';
      el.innerHTML =
        `<svg viewBox="0 0 26 14"><path d="M1 7C7 0 19 0 25 7C19 14 7 14 1 7Z" fill="${COLOR_HOJA}" opacity=".9"/>` +
        `<path d="M2 7H24" stroke="rgba(255,255,255,.35)" stroke-width=".8"/></svg>`;
      break;
  }
  return el;
}
