// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'regalos',
    loadComponent: () => import('./components/regalos/regalos.component').then(m => m.RegalosComponent)
  },
  {
    path: 'formulario',
    loadComponent: () => import('./components/form-wizard/form-wizard.component').then(m => m.FormWizardComponent)
  },
  {
    path: 'no-asiste',
    loadComponent: () => import('./components/no-asiste/no-asiste.component').then(m => m.NoAsisteComponent)
  },
  {
    path: 'si-asiste',
    loadComponent: () => import('./components/si-asiste/si-asiste.component').then(m => m.SiAsisteComponent)
  },
  {
    path: 'formulario-transporte',
    loadComponent: () => import('./components/form-transporte/form-transporte.component').then(m => m.FormTransporteComponent)
  },
  {
    path: 'formulario-alojamiento',
    loadComponent: () => import('./components/form-alojamiento/form-alojamiento.component').then(m => m.FormAlojamientoComponent)
  },
  {
    path: 'formulario-alojamiento-fuera',
    loadComponent: () => import('./components/form-alojamiento-fuera/form-alojamiento-fuera.component').then(m => m.FormAlojamientoFueraComponent)
  },
  {
    path: 'confirmacion',
    loadComponent: () => import('./components/confirmacion/confirmacion.component').then(m => m.ConfirmacionComponent)
  },
  {
    path: 'desscode',
    loadComponent: () => import('./components/desscode/desscode.component').then(m => m.DessCodeComponent)
  },
  {
    path: 'alojamiento-info',
    loadComponent: () => import('./components/alojamiento-info/alojamiento-info.component').then(m => m.AlojamientoInfoComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: '' }
];
