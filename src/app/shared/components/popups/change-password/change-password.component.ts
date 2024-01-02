import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSuccessComponent } from '../error-success/error-success.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public static readonly id = 'change-password';
  buttonDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService
  ) {}

  form = this.formBuilder.group({
    password: new FormControl(''),
    newPassword: new FormControl(''),
    newPasswordSecure: new FormControl(''),
  });

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';


  ngOnInit(): void {
    this.subscribeForm();
  }

  subscribeForm(){
    this.form.valueChanges.subscribe(valid => {
      const validator = this.form.valid ? this.buttonDisabled = false : this.buttonDisabled = true;
    });
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }


  comparePasswords() {
    const actual = this.form.controls.password.value;
    const nueva = this.form.controls.newPassword.value;
    if (actual !== '' && nueva !== '') {
      const notEqual =
        this.form.controls.password.value ===
        this.form.controls.newPassword.value;

      return notEqual;
    }
    return;
  }

  equalPasswords() {
    const nueva = this.form.controls.newPassword.value;
    const repite = this.form.controls.newPasswordSecure.value;
    if (nueva !== '' && repite !== '') {
      const notEqual =
        this.form.controls.newPassword.value !==
        this.form.controls.newPasswordSecure.value;
      return notEqual;
    }
    return;
  }

  onSubmit() {
    const inputString = document.cookie;

    // Buscamos el índice del '=' en la cadena
    const indexOfEqualSign = inputString.indexOf('user=');

    // Extraemos el substring que sigue después del '=' y el espacio
    const userSubstring = inputString.substring(indexOfEqualSign + 5);

    const credentials = {
      username: userSubstring,
      password: this.form.controls.password.value,
      newPassword: this.form.controls.newPassword.value,
    };

    if(credentials.newPassword === '' && credentials.password === ''
    && this.form.controls.newPasswordSecure.value === '') {
      const dialog = this.matDialog.open(ErrorSuccessComponent, {
        data: {
          text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
          buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
        },
      });
    } else {

    const url = 'http://localhost:8080/persona/changePassword';

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          // Hacer algo con jsonData
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
      .catch((error) => {
        const dialog = this.matDialog.open(ErrorSuccessComponent, {
          data: {
            text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
            buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
          },
        });
        console.error('Error:', error);
      });
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
