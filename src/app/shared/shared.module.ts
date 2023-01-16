import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputTextComponent } from './components/forms/input-text/input-text.component';
import { InputPasswordComponent } from './components/forms/input-password/input-password.component';
import { ButtonBaseComponent } from './components/forms/button-base/button-base.component';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MainMenuApplicationsComponent } from './components/main-menu-applications/main-menu-applications.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ErrorSuccessComponent } from './components/popups/error-success/error-success.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormCardComponent } from './components/forms/form-card/form-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardImgComponent } from './components/card-img/card-img.component';
import { DragAndDropComponent } from './components/popups/drag-and-drop/drag-and-drop.component';
import { InputTextV2Component } from './components/forms/input-text-v2/input-text-v2.component';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [
        InputTextComponent,
        InputPasswordComponent,
        ButtonBaseComponent,
        HeaderComponent,
        BreadcrumbComponent,
        MainMenuApplicationsComponent,
        MainMenuComponent,
        ErrorSuccessComponent,
        SpinnerComponent,
        FormCardComponent,
        FooterComponent,
        CardImgComponent,
        DragAndDropComponent,
        InputTextV2Component
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        TranslateModule.forChild({
            extend: true,
            defaultLanguage: 'es',
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    exports: [
        InputTextComponent,
        InputPasswordComponent,
        ButtonBaseComponent,
        HeaderComponent,
        BreadcrumbComponent,
        MainMenuApplicationsComponent,
        MainMenuComponent,
        ErrorSuccessComponent,
        SpinnerComponent,
        FormCardComponent,
        SpinnerComponent,
        FormCardComponent,
        FooterComponent,
        CardImgComponent,
        DragAndDropComponent,
        InputTextV2Component
    ]
})
export class SharedModule { }
