import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/config/config.service';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';
import { AgendaMedicoComponent } from '../agenda-medico/agenda-medico.component';

interface Appointment {
  idCita: number;
  idServicio: number;
  idCliente: number;
  idMedico: number;
  fechaInicio: string | null;
  duracion: number | null;
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit {
  citasList: Appointment[] = [];
  listaLength = false;
  loading = false;
  loadError = false;

  constructor(
    public dialogRef: MatDialogRef<CitasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUser: { idPersona: number } },
    public matDialog: MatDialog,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  ngOnInit(): void { this.chargeList(); }

  private chargeList(): void {
    this.loading = true;
    this.loadError = false;
    this.http.get<Appointment[]>(this.configService.getApiUrl('/citas')).subscribe({
      next: items => {
        this.citasList = items.filter(item => item.idCliente === this.data.selectedUser.idPersona);
        this.listaLength = this.citasList.length === 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
        console.error('Error al cargar las citas:', error);
      }
    });
  }

  administrarCita(appointment?: Appointment): void {
    if (!appointment) {
      const dialog = this.matDialog.open(AgendaMedicoComponent, {
        data: { selectedUser: this.data.selectedUser }, width: '1200px', maxWidth: '98vw', maxHeight: '95vh'
      });
      dialog.afterClosed().subscribe(() => this.chargeList());
      return;
    }
    const dialog = this.matDialog.open(AdminCitasComponent, {
      data: { selectedUser: this.data.selectedUser, appointment },
      width: '500px', maxWidth: '95vw'
    });
    dialog.afterClosed().subscribe(() => this.chargeList());
  }

  close(): void { this.dialogRef.close(); }
}
