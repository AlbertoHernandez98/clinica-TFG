import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiponibilidadRoutingModule } from './disponibilidad-routing.module';
import { DisponibilidadComponent } from './disponibilidad.component';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [DisponibilidadComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    DiponibilidadRoutingModule,
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
export class DisponibilidadModule {}