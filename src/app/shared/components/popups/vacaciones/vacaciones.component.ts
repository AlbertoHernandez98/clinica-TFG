import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/config/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';

interface Holiday {
  idVacacion: number;
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss']
})
export class VacacionesComponent implements OnInit, OnDestroy {
  holidays: Holiday[] = [];
  loading = true;
  saving = false;
  errorKey = '';
  warningCount = 0;
  private readonly destroyed = new Subject<void>();
  form = this.fb.group({ fechaInicio: ['', Validators.required], fechaFin: ['', Validators.required] });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idMedico: number; nombre: string },
    public dialogRef: MatDialogRef<VacacionesComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private config: ConfigService,
    private confirmAction: ConfirmActionService
  ) {}

  get url(): string { return this.config.getApiUrl(`/medicos/${this.data.idMedico}/vacaciones`); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.errorKey = '';
    this.http.get<Holiday[]>(this.url).subscribe({
      next: items => { this.holidays = items; this.loading = false; },
      error: error => { console.error('Error al cargar vacaciones:', error); this.loading = false; this.errorKey = 'VACACIONES.ERROR_CARGA'; }
    });
  }

  add(): void {
    if (this.saving) return;
    if (this.form.invalid || this.form.value.fechaFin < this.form.value.fechaInicio) {
      this.form.markAllAsTouched();
      this.errorKey = 'VACACIONES.FECHAS_INVALIDAS';
      return;
    }
    this.saving = true;
    this.errorKey = '';
    this.warningCount = 0;
    this.http.post<{ citasExistentes: number }>(this.url, this.form.value).subscribe({
      next: result => {
        this.saving = false;
        this.form.reset();
        this.warningCount = result.citasExistentes;
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar vacaciones:', error);
        this.saving = false;
        this.errorKey = error.status === 409 ? 'VACACIONES.SOLAPADAS' :
          error.status === 400 ? 'VACACIONES.FECHAS_INVALIDAS' : 'VACACIONES.ERROR_GUARDAR';
      }
    });
  }

  remove(holiday: Holiday): void {
    if (this.saving) return;
    this.saving = true;
    this.confirmAction.confirm({
      title: 'CONFIRM_ACTION.DELETE_HOLIDAY_TITLE',
      message: 'CONFIRM_ACTION.DELETE_HOLIDAY',
      params: { start: holiday.fechaInicio.split('-').reverse().join('/'), end: holiday.fechaFin.split('-').reverse().join('/') }
    }).pipe(takeUntil(this.destroyed)).subscribe(confirmed => {
      if (!confirmed) { this.saving = false; return; }
      this.errorKey = '';
      this.http.delete(`${this.url}/${holiday.idVacacion}`).subscribe({
        next: () => { this.saving = false; this.load(); },
        error: error => { console.error('Error al eliminar vacaciones:', error); this.saving = false; this.errorKey = 'VACACIONES.ERROR_ELIMINAR'; }
      });
    });
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}
