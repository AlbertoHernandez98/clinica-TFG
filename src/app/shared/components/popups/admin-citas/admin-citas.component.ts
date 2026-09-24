import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../../services/config/config.service';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { ErrorSuccessComponent } from '../error-success/error-success.component';

@Component({
  selector: 'app-admin-citas',
  templateUrl: './admin-citas.component.html',
  styleUrls: ['./admin-citas.component.scss'],
})
export class AdminCitasComponent implements OnInit {
  userList: any[] = [];
  servicios: any;
  listaMedicos: any[] = [];
  listaFiltrada: any[] = [];

  duraciones: number[] = [15, 30, 45, 60, 75, 90];

  form = this.formBuilder.group({
    idServicio: new FormControl(null),
    idMedico: new FormControl(null),
    fechaInicio: new FormControl(null),
    fechaFin: new FormControl(null),
    duracion: new FormControl(null),
  });

  constructor(
    public dialogRef: MatDialogRef<AdminUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    private configService: ConfigService
  ) {}

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';
  user: any;

  ngOnInit(): void {
    this.chargeUser();
    this.loadServices();
    this.loadMedicos();
  }

  // private chargeAdminCita() {
  //   this.user = this.data.selectedUser;

  //   if(this.user) {
  //     this.form = this.formBuilder.group({
  //       usuario: [this.user.username, Validators.required],
  //       newUsuario: [this.user.username, Validators.required],
  //       password: [this.user.password, Validators.required],
  //       idRolNativo: [this.user.idRolNativo, Validators.required],
  //       dni:[this.user.dni, Validators.required],
  //       telefono:[this.user.telefono, Validators.required],
  //       domicilio:[this.user.domicilio, Validators.required],
  //       email:[this.user.email, Validators.required]
  //     });
  //   } else {
  //     this.modifyUser = false;
  //     this.form = this.formBuilder.group({
  //       usuario: [''],
  //       newUsuario: ['', Validators.required],
  //       password: ['', Validators.required],
  //       idRolNativo: [null, Validators.required],
  //       dni:['', Validators.required],
  //       telefono:['', Validators.required],
  //       domicilio:['', Validators.required],
  //       email:['', Validators.required]
  //     });
  //   }
  // }

  private chargeUser() {
    this.user = this.data.selectedUser;

    if (this.user) {
      this.form = this.formBuilder.group({
        idServicio: new FormControl(this.user.idServicio, Validators.required),
        idMedico: new FormControl(this.user.idMedico, Validators.required),
        fechaInicio: new FormControl(
          this.user.fechaInicio,
          Validators.required
        ),
        duracion: new FormControl(this.user.duracion, Validators.required),
      });
    }
  }

  public loadServices() {
    const url = this.configService.getClinicalApiUrl('/servicio');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        this.servicios = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private loadMedicos() {
    const url = this.configService.getClinicalApiUrl('/persona');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        this.loadMedicoHasServicio();
        this.listaMedicos = data.filter(
          (elemento: { idRolNativo: any }) => elemento.idRolNativo === 2
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private loadMedicoHasServicio() {
    const url = this.configService.getClinicalApiUrl('/medico_has_servicio');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        this.form.get('idServicio')?.valueChanges.subscribe((value) => {
          const listaMedicoHasServ = data;
          listaMedicoHasServ.filter((medico: { idServicio: string }) => {
            const ids = medico.idServicio.split(',');
            ids.filter((lista: string | any[]) => {
              if (lista.includes(value)) {
                this.listaFiltrada.push(medico);
              }
            });
          });
          console.log(this.listaFiltrada);
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  public onDelete() {
    const url = this.configService.getClinicalApiUrl(`/citas/${this.user.idPersona}`);
    console.log(url);

    this.http.delete<any>(url).subscribe(
      (data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant(
                'SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'
              ),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al procesar respuesta:', error);
        }
        this.close();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  public onChange() {
    const credentials = {
      idServicio: this.form.controls.idServicio.value,
      idMedico: this.form.controls.idMedico.value,
      idCliente: this.user.idPersona,
      fechaInicio: this.form.controls.fechaInicio.value,
      duracion: this.form.controls.duracion.value,
    };

    const url = this.configService.getClinicalApiUrl('/citas/changeCita');

    this.http.put<any>(url, credentials).subscribe(
      (data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant(
                'SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'
              ),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al procesar respuesta:', error);
        }
        this.close();
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

  public onSubmit() {
    const credentials = {
      idServicio: this.form.controls.idServicio.value,
      idMedico: this.form.controls.idMedico.value,
      idCliente: this.user.idPersona,
      fechaInicio: this.form.controls.fechaInicio.value,
      duracion: this.form.controls.duracion.value,
    };

    console.log(credentials);

    const url = this.configService.getClinicalApiUrl('/citas');

    this.http.post<any>(url, credentials).subscribe(
      (data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant(
                'SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'
              ),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
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
    this.close();
  }

  close(user?: any) {
    if (user) {
      this.dialogRef.close(user);
    } else {
      this.dialogRef.close();
    }
  }
}
