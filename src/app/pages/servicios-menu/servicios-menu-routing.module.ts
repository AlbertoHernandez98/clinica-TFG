import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspolonComponent } from './components/biomecanica/espolon/espolon.component';
import { FascitisComponent } from './components/biomecanica/fascitis/fascitis.component';
import { InfiltracionComponent } from './components/biomecanica/infiltracion/infiltracion.component';
import { MarchaComponent } from './components/biomecanica/marcha/marcha.component';
import { PlantillasComponent } from './components/biomecanica/plantillas/plantillas.component';
import { VendajeComponent } from './components/biomecanica/vendaje/vendaje.component';
import { CirugiaOseaComponent } from './components/cirugia-osea/cirugia-osea.component';
import { CirugiaUngealComponent } from './components/cirugia-ungeal/cirugia-ungeal.component';
import { PieDiabeticoComponent } from './components/pie-diabetico/pie-diabetico.component';
import { PodologiaGeriatricaComponent } from './components/podologia-geriatrica/podologia-geriatrica.component';
import { PodologiaInfantilComponent } from './components/podologia-infantil/podologia-infantil.component';
import { CorteComponent } from './components/quiropodia/corte/corte.component';
import { DurezaComponent } from './components/quiropodia/dureza/dureza.component';
import { HelomaComponent } from './components/quiropodia/heloma/heloma.component';
import { HongosComponent } from './components/quiropodia/hongos/hongos.component';
import { OrtesisComponent } from './components/quiropodia/ortesis/ortesis.component';
import { UnyaComponent } from './components/quiropodia/unya/unya.component';
import { VerrugaComponent } from './components/quiropodia/verruga/verruga.component';
import { ServicioDomicilioComponent } from './components/servicio-domicilio/servicio-domicilio.component';
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
  { path: 'pie-diabetico', component: PieDiabeticoComponent },
  { path: 'cirugia-osea', component: CirugiaOseaComponent },
  { path: 'podologia-infantil', component: PodologiaInfantilComponent },
  { path: 'podologia-geriatrica', component: PodologiaGeriatricaComponent },
  { path: 'servicio-domicilio', component: ServicioDomicilioComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosMenuRoutingModule {}
