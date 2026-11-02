// frontend/src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // tinte-safari: tira fija al pie para que Safari pinte su barra de abajo blanca (ver styles.scss)
  template: `<router-outlet /><div class="tinte-safari" aria-hidden="true"></div>`
})
export class App {}
