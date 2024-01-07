import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database/database';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  historialClinico: any;
  servicios: any;

  error = '../../../../assets/icons/svg/report_problem.svg';
  success = '../../../../assets/icons/svg/green_check.svg';

  form = this.formBuilder.group({
    comentarios: new FormControl('', Validators.required),
    fecha: new FormControl(new Date()),
    idCliente: new FormControl(),
    idMedico: new FormControl(),
    idServicio: new FormControl(Validators.required),
  });

  idPersona!: number;
  rol!: number;
  listaLength!: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public database: DatabaseService,
    private translate: TranslateService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUser();
    this.getHistorial();
    this.loadServices();
  }

  private loadUser() {
    const str = document.cookie;

    const match: any = str.match(/user=([^;]*)/);

    const userLogged = match[1].trim();

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
        const usuarioEncontrado = JSON.parse(data).find(
          (user: { username: any }) => user.username === userLogged
        );

        if (usuarioEncontrado) {
          this.idPersona = usuarioEncontrado.idPersona;
          this.form.get('idCliente')?.setValue(usuarioEncontrado.idPersona);
          this.form.get('idMedico')?.setValue(usuarioEncontrado.idPersona);
          this.rol = usuarioEncontrado.idRolNativo;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  private getHistorial() {
    const url = `http://localhost:8080/historialclinico`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          this.historialClinico = JSON.parse(data).filter(
            (historial: { idCliente: number }) =>
              historial.idCliente === this.idPersona
          );

          this.listaLength = this.historialClinico === undefined;
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  public loadServices() {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/servicio';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        this.servicios = JSON.parse(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  public postHistorial() {
    const url = `http://localhost:8080/historialclinico`;


    if (this.form.valid) {
      const credentials = {
        comentarios: this.form.controls.comentarios.value,
        fecha: this.form.controls.fecha.value,
        idCliente: this.form.controls.idCliente.value,
        idMedico: this.form.controls.idMedico.value,
        idServicio: this.form.controls.idServicio.value,
      };

      const optionsPOST = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      };

      fetch(url, optionsPOST)
        .then((response) => response.text())
        .then((data) => {
          try {
            // Hacer algo con jsonData

            const dialog = this.matDialog.open(ErrorSuccessComponent, {
              data: {
                icon: this.success,
                text: this.translate.instant('HISTORIAL.SUCCESS'),
                buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
              },
            });

            this.getHistorial();
          } catch (error) {
            console.error('Error al analizar la respuesta JSON:', error);
          }
        })
        .catch((error) => {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              text: this.translate.instant('HISTORIAL.ERROR'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
          console.error('Error:', error);
        });
    } else {
      const dialog = this.matDialog.open(ErrorSuccessComponent, {
        data: {
          text: this.translate.instant('HISTORIAL.ERROR'),
          buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
        },
      });
    }
  }
}
