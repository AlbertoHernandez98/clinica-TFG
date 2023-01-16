import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ContactoComponent } from './contacto.component';
import { ContactoRoutingModule } from './contacto-routing.module';

export function httpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [ContactoComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ContactoRoutingModule,
        SharedModule,
        MatDialogModule,
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
export class ContactoModule {}

