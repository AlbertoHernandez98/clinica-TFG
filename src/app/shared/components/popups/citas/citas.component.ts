import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/config/config.service';

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

  close(): void { this.dialogRef.close(); }
}
