import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, of, Subject } from 'rxjs';
import { catchError, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config/config.service';

interface Session { idRolNativo: number; }
interface Patient { idPersona: number; nombre: string; apellidos: string; }
interface Service { idServicio: number; servicio: string; }
interface Appointment { idCita: number; idCliente: number; idServicio: number; }
interface Entry {
  idHistorialClinico: number; comentarios: string; fecha: string; hora: string;
  autorNombre: string | null; autorApellidos: string | null; servicio: string | null; idCita: number | null;
  idServicio: number; idMedico: number;
}
interface History { paciente: Patient; entradas: Entry[]; }

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit, OnDestroy {
  patient?: Patient;
  entries: Entry[] = [];
  services: Service[] = [];
  appointment: Appointment | null = null;
  role = 0;
  loading = true;
  loadError = false;
  saving = false;
  saveError = false;
  saved = false;
  private readonly destroyed = new Subject<void>();
  private readonly reload = new Subject<void>();
  form = this.formBuilder.group({
    idServicio: [null, Validators.required],
    comentarios: ['', [Validators.required, Validators.maxLength(10000)]]
  });
  filters = this.formBuilder.group({ servicio: [''], medico: [''] });
  newestFirst = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap, this.reload.pipe(startWith(undefined))]).pipe(
      switchMap(([params, query]) => {
        this.loading = true;
        this.loadError = false;
        this.patient = undefined;
        this.entries = [];
        this.appointment = null;
        const patientId = params.get('dato');
        const appointmentId = query.get('cita');
        if (!patientId || !/^[1-9]\d*$/.test(patientId) || (appointmentId !== null && !/^[1-9]\d*$/.test(appointmentId))) {
          this.loading = false;
          this.loadError = true;
          return of(null);
        }
        return forkJoin({
          session: this.http.get<Session>(this.config.getApiUrl('/auth/me')),
          history: this.http.get<History>(this.config.getApiUrl(`/historialclinico/paciente/${patientId}`)),
          services: this.http.get<Service[]>(this.config.getApiUrl('/servicio')),
          appointment: appointmentId
            ? this.http.get<Appointment>(this.config.getApiUrl(`/historialclinico/cita/${appointmentId}`))
            : of(null)
        }).pipe(catchError(error => {
          console.error('Error al cargar el historial:', error.status);
          this.loadError = true;
          this.loading = false;
          return of(null);
        }));
      }),
      takeUntil(this.destroyed)
    ).subscribe(result => {
      if (!result) return;
      if (result.appointment && result.appointment.idCliente !== result.history.paciente.idPersona) {
        this.loadError = true;
        this.loading = false;
        return;
      }
      this.role = result.session.idRolNativo;
      this.patient = result.history.paciente;
      this.entries = result.history.entradas;
      this.services = result.services;
      this.appointment = result.appointment;
      this.form.controls.idServicio.setValue(this.appointment ? this.appointment.idServicio : null);
      this.loading = false;
    });
  }

  retry(): void { this.reload.next(); }

  get doctors(): { id: number; name: string }[] {
    const seen = new Map<number, string>();
    this.entries.forEach(entry => {
      if (entry.autorNombre) seen.set(entry.idMedico, `${entry.autorNombre} ${entry.autorApellidos || ''}`.trim());
    });
    return Array.from(seen, ([id, name]) => ({ id, name }));
  }

  get filteredEntries(): Entry[] {
    const { servicio, medico } = this.filters.value;
    return this.entries.filter(entry =>
      (!servicio || String(entry.idServicio) === servicio) && (!medico || String(entry.idMedico) === medico)
    ).slice().sort((a, b) => {
      const order = `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`) || a.idHistorialClinico - b.idHistorialClinico;
      return this.newestFirst ? -order : order;
    });
  }

  save(): void {
    if (this.saving || !this.patient || ![1, 2].includes(this.role)) return;
    const comments = (this.form.controls.comentarios.value || '').trim();
    if (this.form.invalid || !comments) { this.form.markAllAsTouched(); this.saveError = true; return; }
    this.saving = true;
    this.saveError = false;
    this.saved = false;
    this.http.post(this.config.getApiUrl('/historialclinico'), {
      idCliente: this.patient.idPersona,
      idServicio: this.form.controls.idServicio.value,
      comentarios: comments,
      ...(this.appointment ? { idCita: this.appointment.idCita } : {})
    }).pipe(takeUntil(this.destroyed)).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        this.form.controls.comentarios.reset('');
        this.reload.next();
      },
      error: error => {
        console.error('Error al guardar la anotación:', error.status);
        this.saving = false;
        this.saveError = true;
      }
    });
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}
