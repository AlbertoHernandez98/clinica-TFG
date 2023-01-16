import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspolonComponent } from './components/biomecanica/espolon/espolon.component';
import { FascitisComponent } from './components/biomecanica/fascitis/fascitis.component';
import { InfiltracionComponent } from './components/biomecanica/infiltracion/infiltracion.component';
import { MarchaComponent } from './components/biomecanica/marcha/marcha.component';
import { PlantillasComponent } from './components/biomecanica/plantillas/plantillas.component';
import { VendajeComponent } from './components/biomecanica/vendaje/vendaje.component';
import { CirugiaUngealComponent } from './components/cirugia-ungeal/cirugia-ungeal.component';
import { CorteComponent } from './components/quiropodia/corte/corte.component';
import { DurezaComponent } from './components/quiropodia/dureza/dureza.component';
import { HelomaComponent } from './components/quiropodia/heloma/heloma.component';
import { HongosComponent } from './components/quiropodia/hongos/hongos.component';
import { OrtesisComponent } from './components/quiropodia/ortesis/ortesis.component';
import { UnyaComponent } from './components/quiropodia/unya/unya.component';
import { VerrugaComponent } from './components/quiropodia/verruga/verruga.component';
import { ServiciosMenuComponent } from './servicios-menu.component';


const routes: Routes = [
  { path: '', component: ServiciosMenuComponent },
  { path: 'corte', component: CorteComponent },
  { path: 'dureza', component: DurezaComponent },
  { path: 'heloma', component: HelomaComponent },
  { path: 'hongos', component: HongosComponent },
  { path: 'ortesis', component: OrtesisComponent },
  { path: 'unya', component: UnyaComponent },
  { path: 'verruga', component: VerrugaComponent },

  { path: 'espolon', component: EspolonComponent },
  { path: 'fascitis', component: FascitisComponent },
  { path: 'infiltracion', component:  InfiltracionComponent},
  { path: 'marcha', component:  MarchaComponent},
  { path: 'plantillas', component: PlantillasComponent },
  { path: 'vendaje', component: VendajeComponent },

  { path: 'cirugia-ungeal', component: CirugiaUngealComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosMenuRoutingModule {}
