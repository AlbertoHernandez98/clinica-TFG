import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiciosMenuRoutingModule } from './servicios-menu-routing.module';
import { ServiciosMenuComponent } from './servicios-menu.component';
import { CorteComponent } from './components/quiropodia/corte/corte.component';
import { DurezaComponent } from './components/quiropodia/dureza/dureza.component';
import { HelomaComponent } from './components/quiropodia/heloma/heloma.component';
import { UnyaComponent } from './components/quiropodia/unya/unya.component';
import { HongosComponent } from './components/quiropodia/hongos/hongos.component';
import { VerrugaComponent } from './components/quiropodia/verruga/verruga.component';
import { OrtesisComponent } from './components/quiropodia/ortesis/ortesis.component';
import { MarchaComponent } from './components/biomecanica/marcha/marcha.component';
import { PlantillasComponent } from './components/biomecanica/plantillas/plantillas.component';
import { VendajeComponent } from './components/biomecanica/vendaje/vendaje.component';
import { FascitisComponent } from './components/biomecanica/fascitis/fascitis.component';
import { EspolonComponent } from './components/biomecanica/espolon/espolon.component';
import { InfiltracionComponent } from './components/biomecanica/infiltracion/infiltracion.component';
import { CirugiaUngealComponent } from './components/cirugia-ungeal/cirugia-ungeal.component';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    ServiciosMenuComponent,
    CorteComponent,
    DurezaComponent,
    HelomaComponent,
    UnyaComponent,
    HongosComponent,
    VerrugaComponent,
    OrtesisComponent,
    MarchaComponent,
    PlantillasComponent,
    VendajeComponent,
    FascitisComponent,
    EspolonComponent,
    InfiltracionComponent,
    CirugiaUngealComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    ServiciosMenuRoutingModule,
    TranslateModule.forChild({
      extend: true,
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ServiciosMenuModule { }
