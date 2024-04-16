import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { Route, Router } from '@angular/router';
import { CitasComponent } from '../citas/citas.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {

  numbers: number[] = [1, 2, 3, 4, 5]; // Lista de números del 1 al 5
  idRolInicial: number | undefined;

  user: any;

  form!: FormGroup;

  isHidden!: boolean;
  modifyUser = true;

  constructor(
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService,
    public router: Router
  ) {}


  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';


  ngOnInit(): void {
    this.chargeUser();
  }

  private chargeUser() {
    this.user = this.data.selectedUser;

    if(this.user) {
      this.form = this.formBuilder.group({
        usuario: [this.user.username, Validators.required],
        newUsuario: [this.user.username, Validators.required],
        password: [this.user.password, Validators.required],
        idRolNativo: [this.user.idRolNativo, Validators.required],
        dni:[this.user.dni, Validators.required],
        telefono:[this.user.telefono, Validators.required],
        domicilio:[this.user.domicilio, Validators.required],
        email:[this.user.email, Validators.required]
      });
    } else {
      this.modifyUser = false;
      this.form = this.formBuilder.group({
        usuario: [''],
        newUsuario: ['', Validators.required],
        password: ['', Validators.required],
        idRolNativo: [null, Validators.required],
        dni:['', Validators.required],
        telefono:['', Validators.required],
        domicilio:['', Validators.required],
        email:['', Validators.required]
      });
    }
  }

  public getTouchedAndError(key: string) {
    return this.form?.get(key)?.touched && this.form?.get(key)?.errors?.required;
  }

  public onSubmit(){
    const credentials = {
      oldUsername: this.form.controls.usuario.value,
      username: this.form.controls.newUsuario.value,
      password: this.form.controls.password.value,
      idRolNativo: this.form.controls.idRolNativo.value,
      dni: this.form.controls.dni.value,
      telefono: this.form.controls.telefono.value,
      domicilio: this.form.controls.domicilio.value,
      email: this.form.controls.email.value
    };

    const url = 'http://localhost:8080/persona/changeUser';

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
      this.close();
  }

  public onDelete() {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = `http://localhost:8080/persona/${this.user.idPersona}`;
    console.log(url);
    

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
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
      });
      this.close();

  }

  public onCreate() {
    const credentials = {
      oldUsername: this.form.controls.usuario.value,
      username: this.form.controls.newUsuario.value,
      password: this.form.controls.password.value,
      idRolNativo: this.form.controls.idRolNativo.value,
      dni: this.form.controls.dni.value,
      telefono: this.form.controls.telefono.value,
      domicilio: this.form.controls.domicilio.value,
      email: this.form.controls.email.value
    };

    const url = 'http://localhost:8080/persona';

    const options = {
      method: 'POST',
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
      this.close();
  }

  public close() {
    this.dialogRef.close();
  }

  public openHistorial(user: any) {
    this.router.navigate(['/historial', { dato: user.idPersona }]).then(() => {
      window.location.reload();
    });;
    this.dialogRef.close();
  }

  public openCita(user: any){
    const dialog = this.matDialog.open(CitasComponent, {
      data: { selectedUser: user },
      width: '500px'
    });
  }
}
