import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  spinner = false;
  clinicaLogo = '../../../assets/icons/logo_clinica.png';
  error = '../../../../assets/icons/svg/report_problem.svg';
  success = '../../../../assets/icons/svg/green_check.svg';

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppStateService,
    private router: Router,
    private matDialog: MatDialog,
    private translation: TranslateService
  ) {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
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

  submitLogin() {
    if (
      this.loginForm.controls.username.value === 'testusername' &&
      this.loginForm.controls.password.value === 'testpassword'
    ) {
      this.spinner = true;
      setTimeout(() => {
        const obj: AppInfo = {
          breadcum: [
            {
              active: false,
              name: '',
              route: ''
            }
          ],
          isLogged: true
        };
        this.appService.setBreadcumInfo(obj, 'appInfo');
        this.router.navigateByUrl('access-menu');
      }, 1500);
    } else {
      this.openDialog(
        this.error,
        this.translation.instant('LOGIN.POPUP_ERROR_TEXT'),
        this.translation.instant('LOGIN.POPUP_BUTTON_LABEL')
      );
    }
  }
}
