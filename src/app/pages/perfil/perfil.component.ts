import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { perfilUsuario } from 'src/app/JSON-Model/perfilesUsuario';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form = this.formBuilder.group({
    usuario: new FormControl(''),
    contraseña: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    domicilio: new FormControl(''),
    img: new FormControl(null)
  })
  constructor(
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private json: perfilUsuario

  ) { }

  ngOnInit(): void {
    this.rellenarFormulario();
    console.log(this.json);

  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }

  rellenarFormulario() {
    this.form.get('usuario')?.setValue(this.json.jsonUsuarios.usuario);
    this.form.get('contraseña')?.setValue(this.json.jsonUsuarios.contraseña);
    this.form.get('telefono')?.setValue(this.json.jsonUsuarios.telefono);
  }

  modificarUsuario() {
    if (this.form.valid) {
      this.json.jsonUsuarios.usuario = this.form.get('usuario')?.value;
      this.json.jsonUsuarios.contraseña = this.form.get('contraseña')?.value;
      this.json.jsonUsuarios.email = this.form.get('email')?.value;
      this.json.jsonUsuarios.telefono = this.form.get('telefono')?.value;
      this.json.jsonUsuarios.domicilio = this.form.get('domicilio')?.value;
      console.log(this.json);
      this.matDialog.open(ErrorSuccessComponent, {
        data: {
          icon: '../../../../assets/icons/svg/icon-save.svg',
          text: 'Formulario enviado con éxito',
          buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL')
        }
      });
    }

    // this.json.jsonUsuarios.img = this.form.get('img')?.value;

  }

  modificarPerfil(): void {
    //NOTA:
    //implementar la reccuperacion de datos y mostrarlos (BBDD)
    //implementar validacion?? (mostrar en un pop up los cambios tal vez y que confirme el usuario)

    // CONTRASEÑA POR SEPARADO: CONTRASEÑA ACTUAL(VERIFICAR), NUEVA, REPITE NUEVA

    const json = new perfilUsuario().jsonUsuarios;
    json.usuario = this.form.get('usuario')?.value;
    json.contraseña = this.form.get('contraseña')?.value;
    json.email = this.form.get('email')?.value;
    json.domicilio = this.form.get('domicilio')?.value;
    json.telefono = this.form.get('telefono')?.value;
    json.imagen = this.form.get('img')?.value;

    console.log(json);

    this.matDialog.open(ErrorSuccessComponent, {
      data: {
        icon: '../../../../assets/icons/svg/icon-save.svg',
        text: 'Formulario enviado con éxito',
        buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL')
      }
    });

  }

  historial(): void { }

}
