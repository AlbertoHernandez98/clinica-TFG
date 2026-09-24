import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database/database';
import { ConfigService } from 'src/app/services/config/config.service';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  historialClinico: any;
  servicios: any;
  clienteSeleccionado: any;

  error = '../../../../assets/icons/svg/report_problem.svg';
  success = '../../../../assets/icons/svg/green_check.svg';

  form = this.formBuilder.group({
    comentarios: new FormControl('', Validators.required),
    fecha: new FormControl(new Date()),
    idCliente: new FormControl(),
    idMedico: new FormControl(),
    idServicio: new FormControl(Validators.required),
  });

  filtros = this.formBuilder.group({
    medico: new FormControl(),
    servicio: new FormControl(),
  });
  listaFiltrada!: any[];
  listaMedicos!: any[];

  idPersona!: number;
  rol!: number;
  listaLength!: boolean;
  fechaFormateada: any;

  constructor(
    public formBuilder: FormBuilder,
    public database: DatabaseService,
    private http: HttpClient,
    private translate: TranslateService,
    public matDialog: MatDialog,
    public route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.loadUser();
    this.getHistorial();
    this.loadServices();


    this.route.params.subscribe((params) => {
      this.clienteSeleccionado = params['dato'];
    });
  }

  currentPage = 1;
  pageSize = 5;
  totalItems!: number;

  loadItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.listaFiltrada = this.getPaginatedData(startIndex, this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  private getPaginatedData(startIndex: number, pageSize: number): string[] {
    return this.listaFiltrada.slice(startIndex, startIndex + pageSize);
  }

  hasNextPage(): boolean {
    const lastItemIndexOnPage = this.currentPage * this.pageSize;
    return lastItemIndexOnPage < this.totalItems;
  }

  private loadUser() {
    const str = document.cookie;
    const match: any = str.match(/user=([^;]*)/);
    const userLogged = match ? match[1].trim() : '';
    const url = this.configService.getClinicalApiUrl('/persona');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        const usuarioEncontrado = data.find(
          (user: { username: any }) => user.username === userLogged
        );

        if (usuarioEncontrado) {
          this.idPersona = usuarioEncontrado.idPersona;
          this.form.get('idCliente')?.setValue(this.clienteSeleccionado);
          this.form.get('idMedico')?.setValue(usuarioEncontrado.idPersona);
          this.rol = usuarioEncontrado.idRolNativo;
        }

        const clienteEncontrado = data.find(
          (cliente: { idPersona: any }) =>
            cliente.idPersona == this.clienteSeleccionado
        );

        this.clienteSeleccionado = clienteEncontrado;

        this.listaMedicos = data.filter(
          (elemento: { idRolNativo: any }) => elemento.idRolNativo === 2
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  private getHistorial() {
    const url = this.configService.getClinicalApiUrl('/historialclinico');

    this.http.get<any[]>(url).subscribe(
      (data: any[]) => {
        try {
          this.historialClinico = data.filter(
            (historial: { idCliente: number }) =>
              historial.idCliente === this.clienteSeleccionado.idPersona
          );

          this.dateConverter(this.historialClinico);
          this.listaLength = this.historialClinico.length === 0;
          this.listaFiltrada = this.historialClinico;
          this.totalItems = this.listaFiltrada.length;
        } catch (error) {
          console.error('Error al procesar respuesta:', error);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
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

  public postHistorial() {
    const url = this.configService.getClinicalApiUrl('/historialclinico');

    const servicioEncontrado = this.servicios.find(
      (servicio: { servicio: any }) =>
        servicio.servicio === this.form.controls.idServicio.value
    );

    if (this.form.valid) {
      const credentials = {
        comentarios: this.form.controls.comentarios.value,
        fecha: this.form.controls.fecha.value,
        idCliente: this.form.controls.idCliente.value,
        idMedico: this.form.controls.idMedico.value,
        idServicio: servicioEncontrado.idServicio,
      };

      this.http.post<any>(url, credentials).subscribe(
        (data) => {
          try {
            const dialog = this.matDialog.open(ErrorSuccessComponent, {
              data: {
                icon: this.success,
                text: this.translate.instant('HISTORIAL.SUCCESS'),
                buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
              },
            });

            this.form.get('comentarios')?.patchValue('');
            this.form.get('idServicio')?.patchValue(null);
            this.getHistorial();
          } catch (error) {
            console.error('Error al procesar respuesta:', error);
          }
        },
        (error) => {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              text: this.translate.instant('HISTORIAL.ERROR'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
          console.error('Error:', error);
        }
      );
    } else {
      const dialog = this.matDialog.open(ErrorSuccessComponent, {
        data: {
          text: this.translate.instant('HISTORIAL.ERROR'),
          buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
        },
      });
    }
  }

  public sortByDate() {
    this.historialClinico.sort(
      (
        a: { fecha: { getTime: () => number } },
        b: { fecha: { getTime: () => number } }
      ) => a.fecha.getTime() - b.fecha.getTime()
    );
  }

  public sortByServicio() {
    const servicioEncontrado = this.servicios.find(
      (servicio: { servicio: any }) =>
        servicio.servicio === this.filtros.controls.servicio.value
    );

    this.listaFiltrada = this.historialClinico.filter(
      (elemento: { idServicio: any }) =>
        elemento.idServicio == servicioEncontrado.idServicio
    );

    if (this.filtros.controls.medico.value != undefined) {
      this.listaFiltrada = this.listaFiltrada.filter(
        (elemento: any) => elemento == this.filtros.controls.medico.value
      );
    }
  }

  public sortByMedico() {
    this.listaFiltrada = this.historialClinico.filter(
      (elemento: any) => elemento == this.filtros.controls.medico.value
    );

    if (this.filtros.controls.servicio.value != undefined) {
      this.listaFiltrada = this.listaFiltrada.filter(
        (elemento: any) => elemento == this.filtros.controls.servicio.value
      );
    }
  }

  public borrarFiltros() {
    this.listaFiltrada = this.historialClinico;
    this.filtros.get('servicio')?.setValue('');
    this.filtros.get('medico')?.setValue('');
  }
}
