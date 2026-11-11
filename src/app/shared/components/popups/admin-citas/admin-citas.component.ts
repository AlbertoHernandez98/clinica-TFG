import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/config/config.service';
import { merge, of, Subject, timer } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { clinicToday } from '../../../classes/clinic-date';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';

interface Appointment {
  idCita: number;
  idServicio: number;
  idCliente: number;
  idMedico: number;
  fechaInicio: string | null;
  duracion: number | null;
}

const DURACIONES = [30, 60, 90];
function duracionValida(control: AbstractControl): { duracionInvalida: true } | null {
  const value = control.value;
  if (value === null || value === '') return null;
  return (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) &&
    DURACIONES.includes(Number(value)) ? null : { duracionInvalida: true };
}

@Component({
  selector: 'app-admin-citas',
  templateUrl: './admin-citas.component.html',
  styleUrls: ['./admin-citas.component.scss'],
})
export class AdminCitasComponent implements OnInit, OnDestroy {
  servicios: { idServicio: number; servicio: string }[] = [];
  asignaciones: { idPersona: number; idServicio: number }[] = [];
  listaMedicos: { idPersona: number; nombre: string; apellidos: string; idRolNativo: number }[] = [];
  pacientes: { idPersona: number; nombre: string; apellidos: string; idRolNativo: number }[] = [];
  readonly duraciones = DURACIONES;
  saving = false;
  loadError = false;
  errorKey = '';
  availability: 'idle' | 'checking' | 'available' | 'unavailable' | 'patient' | 'outside' | 'error' = 'idle';
  slotsState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  slots: string[] = [];
  dateControl = new FormControl('');
  timeControl = new FormControl('');
  patientControl = new FormControl(null, Validators.required);
  private destroyed$ = new Subject<void>();
  private refreshSlots$ = new Subject<void>();
  form = this.formBuilder.group({
    idServicio: [null, Validators.required],
    idMedico: [null, Validators.required],
    fechaInicio: ['', [Validators.required, (control: AbstractControl) =>
      !this.data.appointment && control.value && control.value.slice(0, 10) < clinicToday()
        ? { fechaPasada: true } : null]],
    duracion: [null, [Validators.required, duracionValida]],
  });

  constructor(
    public dialogRef: MatDialogRef<AdminCitasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      selectedUser?: { idPersona: number; nombre?: string; apellidos?: string };
      appointment?: Appointment;
      fixedDoctor?: { idPersona: number; nombre: string; apellidos: string };
      initialSlot?: { fechaInicio: string; idMedico: number };
    },
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private configService: ConfigService,
    private confirmAction: ConfirmActionService
  ) {}

  ngOnInit(): void {
    if (this.data.selectedUser) this.patientControl.setValue(this.data.selectedUser.idPersona);
    this.patientControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (this.errorKey === 'ADMIN_CITA.PACIENTE_OCUPADO') this.errorKey = '';
    });
    merge(this.dateControl.valueChanges, this.timeControl.valueChanges).pipe(takeUntil(this.destroyed$)).subscribe(() => {
      const date = this.dateControl.value;
      const time = this.timeControl.value;
      this.form.controls.fechaInicio.setValue(date && time ? `${date}T${time}` : '');
    });
    this.form.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      if (value.fechaInicio) this.dateControl.setValue(value.fechaInicio.slice(0, 10), { emitEvent: false });
      if (value.fechaInicio) this.timeControl.setValue(value.fechaInicio.slice(11, 16), { emitEvent: false });
      if (['ADMIN_CITA.NO_DISPONIBLE', 'ADMIN_CITA.PACIENTE_OCUPADO', 'ADMIN_CITA.REQUERIDOS', 'SPECIALTIES.SERVICE_REQUIRED'].includes(this.errorKey)) this.errorKey = '';
    });
    const slotKey = () => {
      const value = this.form.value;
      return { fecha: this.dateControl.value || '', idMedico: value.idMedico, duracion: value.duracion, idCliente: this.patientControl.value };
    };
    merge(
      merge(this.form.valueChanges, this.patientControl.valueChanges).pipe(startWith(null), map(slotKey), distinctUntilChanged((a, b) =>
        a.fecha === b.fecha && a.idMedico === b.idMedico && a.duracion === b.duracion && a.idCliente === b.idCliente)),
      this.refreshSlots$.pipe(map(slotKey))
    ).pipe(
      switchMap(key => {
        this.slots = [];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key.fecha) || (!this.data.appointment && key.fecha < clinicToday()) ||
            key.idMedico === null || key.idMedico === '' || this.form.controls.duracion.invalid) {
          this.slotsState = 'idle';
          return of(null);
        }
        this.slotsState = 'loading';
        return timer(300).pipe(
          switchMap(() => this.http.post<{ huecos: string[] }>(this.configService.getApiUrl('/citas/huecos'), {
            fecha: key.fecha, idMedico: key.idMedico, duracion: key.duracion,
            ...(key.idCliente !== null && key.idCliente !== '' ? { idCliente: key.idCliente } : {}),
            ...(this.data.appointment ? { idCita: this.data.appointment.idCita } : {})
          })),
          catchError(error => {
            console.error('Error al cargar los huecos:', error);
            this.slotsState = 'error';
            return of(null);
          })
        );
      }),
      takeUntil(this.destroyed$)
    ).subscribe(result => {
      if (result) { this.slots = result.huecos; this.slotsState = 'ready'; }
    });
    merge(this.form.valueChanges, this.patientControl.valueChanges).pipe(
      switchMap(() => {
        if (this.form.invalid || this.patientControl.invalid) { this.availability = 'idle'; return of(null); }
        this.availability = 'checking';
        return timer(300).pipe(
          switchMap(() => this.http.post<{ disponible: boolean; motivo?: string }>(this.configService.getApiUrl('/citas/disponibilidad'), {
            ...this.form.value, idCliente: this.patientControl.value,
            ...(this.data.appointment ? { idCita: this.data.appointment.idCita } : {})
          })),
          catchError(error => {
            console.error('Error al comprobar disponibilidad:', error);
            this.availability = 'error';
            return of(null);
          })
        );
      }),
      takeUntil(this.destroyed$)
    ).subscribe(result => {
      if (result) this.availability = result.disponible ? 'available' :
        result.motivo === 'fuera_horario' ? 'outside' : result.motivo === 'paciente_ocupado' ? 'patient' : 'unavailable';
    });
    if (this.data.appointment) {
      const cita = this.data.appointment;
      this.form.patchValue({ idServicio: cita.idServicio, idMedico: cita.idMedico, fechaInicio: cita.fechaInicio ? cita.fechaInicio.slice(0, 16) : '', duracion: cita.duracion });
    }
    if (this.data.initialSlot) {
      this.form.patchValue({ idMedico: this.data.initialSlot.idMedico, fechaInicio: this.data.initialSlot.fechaInicio, duracion: 30 });
    }
    if (this.data.fixedDoctor) this.form.patchValue({ idMedico: this.data.fixedDoctor.idPersona });
    this.http.get<typeof this.servicios>(this.configService.getApiUrl('/servicio')).subscribe({
      next: items => this.servicios = items,
      error: error => { console.error('Error al cargar servicios:', error); this.loadError = true; }
    });
    this.http.get<typeof this.asignaciones>(this.configService.getApiUrl('/medico_has_servicio')).subscribe({
      next: items => this.asignaciones = items,
      error: error => { console.error('Error al cargar asignaciones:', error); this.loadError = true; }
    });
    if (!this.data.fixedDoctor || !this.data.selectedUser) {
      this.http.get<typeof this.listaMedicos>(this.configService.getApiUrl('/persona')).subscribe({
        next: users => {
          if (!this.data.fixedDoctor) this.listaMedicos = users.filter(user => user.idRolNativo === 2);
          if (!this.data.selectedUser) this.pacientes = users.filter(user => user.idRolNativo === 4);
        },
        error: error => { console.error('Error al cargar personas:', error); this.loadError = true; }
      });
    }
  }

  selectSlot(time: string): void {
    const date = this.dateControl.value;
    if (this.slotsState !== 'ready' || !this.slots.includes(time) || !date) return;
    this.form.controls.fechaInicio.setValue(`${date}T${time}`);
  }

  refreshSlots(): void { this.refreshSlots$.next(); }

  get today(): string { return clinicToday(); }

  get serviciosDisponibles(): typeof this.servicios {
    const value = this.form.controls.idMedico.value;
    if (value === null || value === '') return [];
    const doctor = Number(value);
    const ids = new Set(this.asignaciones.filter(item => Number(item.idPersona) === doctor).map(item => Number(item.idServicio)));
    return this.servicios.filter(item => ids.has(Number(item.idServicio)));
  }

  get servicioAsignado(): boolean {
    return this.serviciosDisponibles.some(item => Number(item.idServicio) === Number(this.form.controls.idServicio.value));
  }

  onSubmit(): void {
    this.form.controls.fechaInicio.updateValueAndValidity({ emitEvent: false });
    if (this.saving || this.loadError || this.availability === 'checking' || this.availability === 'unavailable' || this.availability === 'patient' || this.availability === 'outside' || this.availability === 'error') return;
    if (this.form.invalid || this.patientControl.invalid) { this.form.markAllAsTouched(); this.patientControl.markAsTouched(); this.errorKey = 'ADMIN_CITA.REQUERIDOS'; return; }
    if (!this.servicioAsignado) { this.errorKey = 'SPECIALTIES.SERVICE_REQUIRED'; return; }
    const body = { ...this.form.value, idCliente: this.patientControl.value };
    const id = this.data.appointment?.idCita;
    const url = this.configService.getApiUrl(id === undefined ? '/citas' : `/citas/${id}`);
    this.saving = true;
    this.errorKey = '';
    const request = id === undefined ? this.http.post(url, body) : this.http.put(url, body);
    request.subscribe({
      next: () => { this.saving = false; this.dialogRef.close(true); },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar la cita:', error);
        this.saving = false;
        const patientConflict = error.status === 409 && error.error?.code === 'PATIENT_CONFLICT';
        const serviceConflict = error.status === 409 && error.error?.code === 'SERVICE_NOT_ASSIGNED';
        this.errorKey = serviceConflict ? 'SPECIALTIES.SERVICE_REQUIRED' : patientConflict ? 'ADMIN_CITA.PACIENTE_OCUPADO' : error.status === 409 ? 'ADMIN_CITA.NO_DISPONIBLE' : 'ADMIN_CITA.ERROR';
        if (error.status === 409 && !serviceConflict) { this.availability = patientConflict ? 'patient' : 'unavailable'; this.refreshSlots(); }
      }
    });
  }

  onDelete(): void {
    if (!this.data.appointment || this.saving) return;
    this.saving = true;
    const appointment = this.data.appointment;
    this.confirmAction.confirm({
      title: 'CONFIRM_ACTION.DELETE_APPOINTMENT_TITLE',
      message: 'CONFIRM_ACTION.DELETE_APPOINTMENT',
      params: { id: String(appointment.idCita) }
    }).pipe(takeUntil(this.destroyed$)).subscribe(confirmed => {
      if (!confirmed) { this.saving = false; return; }
      this.http.delete(this.configService.getApiUrl(`/citas/${appointment.idCita}`)).subscribe({
        next: () => { this.saving = false; this.dialogRef.close(true); },
        error: error => { console.error('Error al eliminar la cita:', error); this.saving = false; this.errorKey = 'ADMIN_CITA.ERROR'; }
      });
    });
  }

  close(): void { this.dialogRef.close(); }

  ngOnDestroy(): void { this.destroyed$.next(); this.destroyed$.complete(); }
}
