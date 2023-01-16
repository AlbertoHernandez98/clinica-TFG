import { expressionType } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';
import { Usuario } from 'src/app/providers/usuario';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {


  emailRexp = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/i;
  error = '../../../../assets/icons/svg/report_problem.svg';
  success = '../../../../assets/icons/svg/green_check.svg';

  form = this.formBuilder.group({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    msj: new FormControl('', Validators.required)
  })


  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public usuario: Usuario,
    private translate: TranslateService,
    private appService: AppStateService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.changesForm();
    this.getTranslate();
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }

  changesForm() {
    this.form.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.RESERVA_CITA')
      .subscribe((res) => {
        this.initRoutes();
      });
  }

  emailValida() {
    const email = this.form.controls.email.value;
    console.log(email);
    

    if (this.emailRexp.test(email)) {
      var link = "mailto:ahernandez.98.3@gmail.com"
        + "?cc=" + email
        + "&body=" + this.form.controls.msj.value;
      ;

      window.location.href = link;
    } else {
      this.openDialog(
        this.error,
        this.translate.instant('LOGIN.POPUP_ERROR_TEXT'),
        this.translate.instant('LOGIN.POPUP_BUTTON_LABEL')
      );
    }
  }


  initRoutes() {
    const appInfo: AppInfo = {
      breadcum: [
        {
          active: true,
          name: this.translate.instant('BREADCUMTEXT.MENU'),
          route: '/access-menu'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.CONTACTO'),
          route: '/contacto'
        },
      ],
      isLogged: true,
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

  openDialog(icon: string, text: string, buttonLabel: string) {
    this.matDialog.open(ErrorSuccessComponent, {
      data: {
        icon,
        text,
        buttonLabel
      }
    });
  }
}
