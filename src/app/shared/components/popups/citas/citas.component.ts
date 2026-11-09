import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config/config.service';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';

interface Appointment {
  idCita: number;
  idServicio: number;
  idCliente: number;
  idMedico: number;
  fechaInicio: string | null;
  duracion: number | null;
}
interface Staff { idPersona: number; idRolNativo: number; nombre: string; apellidos: string; }

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit, OnDestroy {
  citasList: Appointment[] = [];
  listaLength = false;
  loading = false;
  loadError = false;
  staff?: Staff;
  private readonly destroyed = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<CitasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedUser: { idPersona: number } },
    private dialog: MatDialog,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  ngOnInit(): void { this.chargeList(); }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private chargeList(): void {
    this.loading = true;
    this.loadError = false;
    forkJoin({
      items: this.http.get<Appointment[]>(this.configService.getApiUrl('/citas')),
      staff: this.http.get<Staff>(this.configService.getApiUrl('/auth/me'))
    }).pipe(takeUntil(this.destroyed)).subscribe({
      next: ({ items, staff }) => {
        if (![1, 2, 3].includes(staff.idRolNativo)) {
          this.loading = false;
          this.loadError = true;
          console.error('La sesión no puede administrar citas');
          return;
        }
        this.staff = staff;
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

  canManage(appointment: Appointment): boolean {
    return !!this.staff && ([1, 3].includes(this.staff.idRolNativo) ||
      (this.staff.idRolNativo === 2 && this.staff.idPersona === appointment.idMedico));
  }

  editAppointment(appointment: Appointment): void {
    if (!this.canManage(appointment)) return;
    const ref = this.dialog.open(AdminCitasComponent, {
      data: {
        selectedUser: this.data.selectedUser,
        appointment,
        ...(this.staff?.idRolNativo === 2 ? { fixedDoctor: this.staff } : {})
      },
      width: '500px', maxWidth: '95vw'
    });
    ref.afterClosed().pipe(takeUntil(this.destroyed)).subscribe(changed => {
      if (changed) this.chargeList();
    });
  }

  close(): void { this.dialogRef.close(); }
}
