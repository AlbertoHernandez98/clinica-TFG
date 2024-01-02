import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessMenuComponent } from './pages/access-menu/access-menu.component';


const routes: Routes = [

  {
    path: '',
    component: AccessMenuComponent
  },
  
  {
    path: 'access-menu',
    loadChildren: () =>
    import('./pages/access-menu/access-menu.module').then((m) => m.AccessMenuModule)
  },
  {
    path: 'servicios',
    loadChildren: () =>
    import('./pages/reserva-cita/servicios/servicios.module').then((m) => m.ServiciosModule)
  },
  {
    path: 'reserva-cita',
    loadChildren: () =>
      import('./pages/reserva-cita/reserva-cita.module').then((m) => m.ReservaCitaModule)
  },
  {
    path: 'serviciosMenu',
    loadChildren: () =>
      import('./pages/servicios-menu/servicios-menu.module').then((m) => m.ServiciosMenuModule)
  },
  {
    path: 'personal',
    loadChildren: () =>
      import('./pages/personal/personal.module').then((m) => m.PersonalModule)
  },
  {
    path: 'disponibilidad',
    loadChildren: () =>
      import('./pages/reserva-cita/disponibilidad/disponibilidad.module').then((m) => m.DisponibilidadModule)
  },
  {
    path: 'contacto',
    loadChildren: () =>
      import('./pages/contacto/contacto.module').then((m) => m.ContactoModule)
  },
  {
    path: 'clinica',
    loadChildren: () =>
      import('./pages/clinica/clinica.module').then((m) => m.ClinicaModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'historial',
    loadChildren: () =>
      import('./pages/historial/historial.module').then((m) => m.HistorialModule)
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./pages/perfil-usuario/perfil-usuario.module').then((m) => m.PerfilUsuarioModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
