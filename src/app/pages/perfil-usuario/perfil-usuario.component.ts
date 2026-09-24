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
import { ConfigService } from 'src/app/services/config/config.service';
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
    private http: HttpClient,
    private configService: ConfigService,
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

    const indexOfEqualSign = inputString.indexOf('user=');

    const userToDepure = inputString.substring(indexOfEqualSign + 5);
    var newUsuario = userToDepure.split(';')[0];


    const url = this.configService.getClinicalApiUrl('/persona');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        this.usuarioEncontrado = data.find((user: { username: any; }) => user.username === newUsuario);

        this.form.controls.usuario.patchValue(newUsuario);
        this.form.controls.newUsuario.patchValue(this.usuarioEncontrado.username);
        this.form.controls.email.patchValue(this.usuarioEncontrado.email);
        this.form.controls.telefono.patchValue(this.usuarioEncontrado.telefono);
        this.form.controls.domicilio.patchValue(this.usuarioEncontrado.domicilio);
        this.form.controls.dni.patchValue(this.usuarioEncontrado.dni);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

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
    const url = this.configService.getClinicalApiUrl('/upload');

    this.http.post<any>(url, formData).subscribe(
      (data) => {
        console.log('Respuesta del servidor:', data);
      },
      (error) => {
        console.error('Error al subir la foto:', error);
      }
    );
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

    const url = this.configService.getClinicalApiUrl('/persona/changeUser');

    this.http.put<any>(url, credentials).subscribe(
      (data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error:', error);
        }
      },
      (error) => {
        const dialog = this.matDialog.open(ErrorSuccessComponent, {
          data: {
            text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
            buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
          },
        });
        console.error('Error:', error);
      }
    );
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
