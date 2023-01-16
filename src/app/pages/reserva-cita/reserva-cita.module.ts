import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservaCitaComponent } from './reserva-cita.component';
import { ReservaCitaRoutingModule } from './reserva-cita-routing.module';
import { ReservaCitaChildComponent } from './components/reserva-cita-child/reserva-cita-child.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    ReservaCitaComponent,
    ReservaCitaChildComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    ReservaCitaRoutingModule,
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
export class ReservaCitaModule {}
