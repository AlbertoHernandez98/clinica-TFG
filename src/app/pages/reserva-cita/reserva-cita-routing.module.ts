import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';
import { ReservaCitaComponent } from './reserva-cita.component';
import { ServiciosComponent } from './servicios/servicios.component';


const routes: Routes = [
  { path: '', component: ReservaCitaComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'disponibilidad', component: DisponibilidadComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaCitaRoutingModule {}
