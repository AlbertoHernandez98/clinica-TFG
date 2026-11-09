import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config/config.service';

interface PatientAppointment {
  idCita: number;
  fecha: string | null;
  hora: string | null;
  duracion: number | null;
  medicoNombre: string | null;
  medicoApellidos: string | null;
  servicio: string | null;
}

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.scss']
})
export class MisCitasComponent implements OnInit, OnDestroy {
  appointments: PatientAppointment[] = [];
  loading = true;
  error = false;
  private readonly destroyed = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<MisCitasComponent>,
    private http: HttpClient,
    private config: ConfigService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!this.loading) this.loading = true;
    this.error = false;
    this.http.get<PatientAppointment[]>(this.config.getApiUrl('/citas/mis-citas'))
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: appointments => { this.appointments = appointments; this.loading = false; },
        error: error => {
          console.error('Error al cargar mis citas:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
