import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit {
  citasList: any[] = [];
  servicios: any;
  listaMedicos: any[] = [];

  listaLength!: boolean;
  fechaFormateada: any;



  duraciones: number[] = [15,30,45,60,75,90];


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
    private translate: TranslateService
  ) {}

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';
  user: any;

  ngOnInit(): void {
    this.chargeList();
  }

 

  private chargeList() {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/citas';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          this.citasList = JSON.parse(data).filter(
            (cita: { idCliente: number }) =>
              cita.idCliente === this.data.selectedUser.idPersona
          );

          console.log(data);
          


          this.dateConverter(this.citasList);

          
          this.listaLength = this.citasList.length === 0;


        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
  }

  private dateConverter(historial: any) {
    historial.forEach((item: { fecha: string | number | Date }) => {
      item.fecha = new Date(item.fecha);
      var dia: any = item.fecha.getDate();
      var mes: any = item.fecha.getMonth() + 1; // Nota: los meses en JavaScript van de 0 a 11
      var año = item.fecha.getFullYear();

      // Asegurarse de que el día y el mes tengan dos dígitos
      dia = dia < 10 ? '0' + dia : dia;
      mes = mes < 10 ? '0' + mes : mes;

      this.fechaFormateada = dia + '/' + mes + '/' + año;
    });
  }


  public async administrarCita(user?: any) {   

    const dialog = this.matDialog.open(AdminCitasComponent, {
      data: { selectedUser: this.data.selectedUser
      },
      width: '500px'
    });

    dialog.afterClosed().subscribe(() => {
      this.chargeList();
    });
  }


  close(user?: any) {
    if (user) {
      this.dialogRef.close(user);
    } else {
      this.dialogRef.close();
    }
  }
}
