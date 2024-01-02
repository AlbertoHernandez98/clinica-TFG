import { HistorialModule } from './pages/historial/historial.module';
import { HttpClient } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AccessMenuModule } from './pages/access-menu/access-menu.module';
import { ReservaCitaModule } from './pages/reserva-cita/reserva-cita.module';
import { ServiciosModule } from './pages/reserva-cita/servicios/servicios.module';
import { ServiciosMenuModule } from './pages/servicios-menu/servicios-menu.module';
import { PersonalModule } from './pages/personal/personal.module';
import { ContactoModule } from './pages/contacto/contacto.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClinicaModule } from './pages/clinica/clinica.module';
import { FormsModule } from '@angular/forms';
import { PerfilUsuarioModule } from './pages/perfil-usuario/perfil-usuario.module';

export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    FormsModule,
    BrowserModule,
    IonicModule,
    ReservaCitaModule,
    ServiciosModule,
    AccessMenuModule,
    MatSnackBarModule,
    AppRoutingModule,
    ServiciosMenuModule,
    PersonalModule,
    ContactoModule,
    PerfilUsuarioModule,
    ClinicaModule,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
