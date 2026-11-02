// frontend/src/app/components/encajar.directive.ts
import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/**
 * Red de seguridad de las páginas de una sola pantalla (las que usan el mixin
 * pantalla-fija). Las medidas compactas de _alto.scss ya las hacen caber en los
 * móviles normales; si en alguno muy pequeño o estrecho aun así no cupiera,
 * reduce la página entera lo justo (zoom) para que entre sin scroll.
 */
@Directive({ selector: '[appEncajar]', standalone: true })
export class EncajarDirective implements AfterViewInit, OnDestroy {
  private readonly pagina: HTMLElement = inject(ElementRef).nativeElement;
  private tamanos?: ResizeObserver;
  private cambios?: MutationObserver;

  ngAfterViewInit(): void {
    const encajar = () => this.encajar();
    this.tamanos = new ResizeObserver(encajar);
    this.tamanos.observe(this.pagina);
    for (const hijo of Array.from(this.pagina.children)) this.tamanos.observe(hijo);
    // Preguntas que aparecen o desaparecen (p. ej. los días de alojamiento)
    this.cambios = new MutationObserver(encajar);
    this.cambios.observe(this.pagina, { childList: true, subtree: true });
    // Las fuentes web cambian cuántas líneas ocupa cada texto
    document.fonts?.ready.then(encajar);
    encajar();
  }

  ngOnDestroy(): void {
    this.tamanos?.disconnect();
    this.cambios?.disconnect();
  }

  private encajar(): void {
    // Con el teclado abierto algunos móviles encogen la pantalla: mientras se escribe no se toca
    const activo = document.activeElement;
    if (activo instanceof HTMLInputElement || activo instanceof HTMLTextAreaElement) return;

    // Se mide sin zoom y se vuelve a poner en el mismo instante, así que no llega a verse
    const estilo = this.pagina.style;
    estilo.zoom = '';
    const ocupa = this.altoContenido();
    const cabe = this.pagina.clientHeight;
    estilo.zoom = ocupa > cabe + 1 ? String(Math.floor((cabe / ocupa) * 100) / 100) : '';
  }

  /** Alto que pide el contenido según la maqueta, sin contar las animaciones de entrada */
  private altoContenido(): number {
    let alto = 0;
    for (const hijo of Array.from(this.pagina.children) as HTMLElement[]) {
      const margen = parseFloat(getComputedStyle(hijo).marginBottom) || 0;
      alto = Math.max(alto, hijo.offsetTop + hijo.offsetHeight + margen);
    }
    return alto;
  }
}
