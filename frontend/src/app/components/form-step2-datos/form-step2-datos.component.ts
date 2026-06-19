// frontend/src/app/components/form-step2-datos/form-step2-datos.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvitadoService } from '../../services/invitado.service';

@Component({
  selector: 'app-form-step2-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-step2-datos.component.html',
  styleUrl: './form-step2-datos.component.scss'
})
export class FormStep2DatosComponent {
  readonly svc = inject(InvitadoService);

  nombre   = this.svc.formState().nombre;
  alergias = this.svc.formState().alergias;
  nuevoNombre = '';
  tieneAcomp = signal<boolean | null>(
    this.svc.formState().acompanantes.length > 0 ? true : null
  );
  errMsg = signal('');

  get acompanantes() { return this.svc.formState().acompanantes; }

  agregarAcomp() {
    if (!this.nuevoNombre.trim()) return;
    this.svc.agregarAcompanante({ nombre: this.nuevoNombre.trim(), tipo: 'Adulto', alergias: '' });
    this.nuevoNombre = '';
  }

  continuar() {
    if (!this.nombre.trim()) { this.errMsg.set('El nombre es obligatorio.'); return; }
    this.errMsg.set('');
    this.svc.actualizarDatos({ nombre: this.nombre.trim(), alergias: this.alergias.trim() });
    this.svc.siguientePaso();
  }
}
