import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';
import { Backend } from 'src/app/JSON-Model/backend';
import { ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from 'src/app/shared/components/popups/change-password/change-password.component';
import { LangService } from 'src/app/services/lang/lang';
import { AdminUsersComponent } from 'src/app/shared/components/popups/admin-users/admin-users.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {
  selectedFile!: File;
  imageUrl!: string;
  form!: FormGroup;

  usuarioEncontrado!: any;

  user: string = '';

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';

  
  constructor(
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private urls: Backend,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usuario: new FormControl(''),
      newUsuario: new FormControl(''),
      email: new FormControl(''),
      telefono: new FormControl(''),
      domicilio: new FormControl(''),
      img: new FormControl(null),
      dni: new FormControl(''),
    });
    this.loadForm();
  }

  private loadForm() {
    const inputString = document.cookie;

    // Buscamos el índice del '=' en la cadena
    const indexOfEqualSign = inputString.indexOf('user=');

    // Extraemos el substring que sigue después del '=' y el espacio
    const userToDepure = inputString.substring(indexOfEqualSign + 5);
    var newUsuario = userToDepure.split(';')[0];


    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/persona';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
          this.usuarioEncontrado = JSON.parse(data).find((user: { username: any; }) => user.username === newUsuario);

          this.form.controls.usuario.patchValue(newUsuario)
          this.form.controls.newUsuario.patchValue(this.usuarioEncontrado.username)
          this.form.controls.email.patchValue(this.usuarioEncontrado.email)
          this.form.controls.telefono.patchValue(this.usuarioEncontrado.telefono)
          this.form.controls.domicilio.patchValue(this.usuarioEncontrado.domicilio)
          this.form.controls.dni.patchValue(this.usuarioEncontrado.dni)
      }).catch((error) => {
        console.error('Error:', error);
      });

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
    console.log(this.selectedFile);
  }

  uploadPhoto() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.selectedFile);
    const url = this.urls.backend.url + this.urls.backend.port + '/upload';

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer miToken');
    headers.append('sec-fetch-mode', 'no-cors'); // Elimina las cabeceras experimentales
    headers.append('sec-fetch-dest', 'empty');
    headers.append('sec-fetch-site', 'same-origin');

    const options = {
      method: 'POST',
      // headers: headers,
      body: formData,
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta del servidor:', data);
        // Realiza acciones adicionales si es necesario
      })
      .catch((error) => {
        console.error('Error al subir la foto:', error);
      });
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }

  historial(): void {
    
  }

  public async changePassword() {
     const dialog = this.matDialog.open(ChangePasswordComponent, {
      data: {
        title: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.TITLE'),
        buttonLabel: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.TITLE'),
        edit: true,
      },
      width: '940px'
    });
  }

  pruebas(){
    const credentials = {
      oldUsername: this.form.controls.usuario.value,
      username: this.form.controls.newUsuario.value,
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
  }

  admin(){
    const dialog = this.matDialog.open(AdminUsersComponent, {
      data: {
        title: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.TITLE'),
        buttonLabel: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.TITLE'),
        edit: true
      }
    });
  }

  redirectToHistorial(){
    this.router.navigate(['/historial', { dato: this.usuarioEncontrado.idPersona }]).then(() => {
      window.location.reload();
    });;
  }
}
