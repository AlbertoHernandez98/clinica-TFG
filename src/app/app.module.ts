import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ApiInterceptor } from './services/api/api.interceptor';
import { LangService } from './services/lang/lang';
import { take } from 'rxjs/operators';

export function httpLoaderFactory(httpClient: HttpClient) {
  // Use absolute path to i18n files
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json');
}

export function initializeApp(translate: TranslateService, langService: LangService) {
  return () => {
    const currentLanguage = langService.getCurrentLanguage();
    translate.setDefaultLang(currentLanguage);
    // Use take(1) to complete the observable and return as promise
    return translate.use(currentLanguage).pipe(take(1)).toPromise();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule,
    MatSnackBarModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      extend: true,
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslateService, LangService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
