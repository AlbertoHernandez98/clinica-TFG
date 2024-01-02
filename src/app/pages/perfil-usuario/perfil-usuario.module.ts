import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { PerfilUsuarioRoutingModule } from './perfil-usuario-routing-module';
import { Backend } from 'src/app/JSON-Model/backend';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [PerfilUsuarioComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PerfilUsuarioRoutingModule,
    TranslateModule.forChild({
      extend: true,
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ], providers: [Backend]
})
export class PerfilUsuarioModule {}
