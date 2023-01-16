import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AccessMenuComponent } from './access-menu.component';
import { AccessMenuRoutingModule } from './access-menu-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [AccessMenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AccessMenuRoutingModule,
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
export class AccessMenuModule {}
