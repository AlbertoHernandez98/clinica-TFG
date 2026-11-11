import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmActionService } from 'src/app/shared/components/popups/confirm-action/confirm-action.service';
import { ConfigService } from 'src/app/services/config/config.service';

interface Session { idPersona: number; idRolNativo: number; }
interface Patient { idPersona: number; nombre: string; apellidos: string; }
interface Service { idServicio: number; servicio: string; }
interface Appointment { idCita: number; idCliente: number; idServicio: number; }
interface Entry {
  idHistorialClinico: number; comentarios: string; fecha: string | null; hora: string | null;
  autorNombre: string | null; autorApellidos: string | null; servicio: string | null; idCita: number | null;
  idServicio: number; idMedico: number | null; anulada: boolean; versiones: EntryVersion[];
}
interface EntryVersion {
  comentarios: string; fecha: string | null; hora: string | null; idMedico: number | null;
  tipoOperacion: 'EDICION' | 'ANULACION';
  motivo: string; fechaOperacion: string; usuarioNombre: string | null; usuarioApellidos: string | null;
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
  editingEntryId: number | null = null;
  annullingEntryId: number | null = null;
  operatingEntryId: number | null = null;
  operationError = false;
  operationSuccess: 'edit' | 'annul' | null = null;
  private currentUserId = 0;
  private readonly destroyed = new Subject<void>();
  private readonly reload = new Subject<void>();
  form = this.formBuilder.group({
    idServicio: [null, Validators.required],
    comentarios: ['', [Validators.required, Validators.maxLength(10000)]]
  });
  filters = this.formBuilder.group({ servicio: [''], medico: [''] });
  editForm = this.formBuilder.group({
    comentarios: ['', [Validators.required, Validators.maxLength(10000)]],
    motivo: ['', [Validators.required, Validators.maxLength(1000)]]
  });
  annulForm = this.formBuilder.group({
    motivo: ['', [Validators.required, Validators.maxLength(1000)]]
  });
  newestFirst = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private config: ConfigService,
    private confirmAction: ConfirmActionService
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
      this.currentUserId = result.session.idPersona;
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
      if (entry.autorNombre && entry.idMedico !== null) {
        seen.set(entry.idMedico, `${entry.autorNombre} ${entry.autorApellidos || ''}`.trim());
      }
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

  canManageEntry(entry: Entry): boolean {
    return !entry.anulada && (this.role === 1 || (this.role === 2 && entry.idMedico === this.currentUserId));
  }

  startEdit(entry: Entry): void {
    if (!this.canManageEntry(entry)) return;
    this.editingEntryId = entry.idHistorialClinico;
    this.annullingEntryId = null;
    this.editForm.setValue({ comentarios: entry.comentarios, motivo: '' });
    this.operationError = false;
  }

  cancelEdit(): void {
    this.editingEntryId = null;
    this.editForm.reset({ comentarios: '', motivo: '' });
  }

  saveEdit(entry: Entry): void {
    if (!this.canManageEntry(entry) || this.operatingEntryId !== null) return;
    const comentarios = (this.editForm.controls.comentarios.value || '').trim();
    const motivo = (this.editForm.controls.motivo.value || '').trim();
    if (this.editForm.invalid || !comentarios || !motivo) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.confirmAndRun(entry, 'edit', {
      title: 'HISTORIAL.CONFIRMAR_EDICION_TITULO',
      message: 'HISTORIAL.CONFIRMAR_EDICION'
    }, () => this.http.patch(this.config.getApiUrl(`/historialclinico/${entry.idHistorialClinico}`), {
      comentarios, motivo
    }));
  }

  startAnnul(entry: Entry): void {
    if (!this.canManageEntry(entry)) return;
    this.editingEntryId = null;
    this.annullingEntryId = entry.idHistorialClinico;
    this.annulForm.reset({ motivo: '' });
    this.operationError = false;
  }

  cancelAnnul(): void {
    this.annullingEntryId = null;
    this.annulForm.reset({ motivo: '' });
  }

  annulEntry(entry: Entry): void {
    if (!this.canManageEntry(entry) || this.operatingEntryId !== null) return;
    const motivo = (this.annulForm.controls.motivo.value || '').trim();
    if (this.annulForm.invalid || !motivo) {
      this.annulForm.markAllAsTouched();
      return;
    }
    this.confirmAndRun(entry, 'annul', {
      title: 'HISTORIAL.CONFIRMAR_ANULACION_TITULO',
      message: 'HISTORIAL.CONFIRMAR_ANULACION'
    }, () => this.http.post(this.config.getApiUrl(`/historialclinico/${entry.idHistorialClinico}/anular`), {
      motivo
    }));
  }

  private confirmAndRun(
    entry: Entry,
    operation: 'edit' | 'annul',
    confirmation: { title: string; message: string },
    request: () => Observable<unknown>
  ): void {
    if (!this.canManageEntry(entry) || this.operatingEntryId !== null) return;
    this.operatingEntryId = entry.idHistorialClinico;
    this.operationError = false;
    this.operationSuccess = null;
    let confirmationFinished = false;
    let requestStarted = false;

    this.confirmAction.confirm(confirmation).pipe(takeUntil(this.destroyed)).subscribe({
      next: confirmed => {
        if (confirmationFinished) return;
        confirmationFinished = true;
        if (!confirmed) {
          this.releaseOperation(entry.idHistorialClinico);
          return;
        }
        requestStarted = true;
        try {
          request().pipe(takeUntil(this.destroyed)).subscribe({
            next: () => this.operationComplete(operation),
            error: error => this.operationFailed(error)
          });
        } catch (error) {
          this.operationFailed(error as { status?: number });
        }
      },
      error: error => {
        if (requestStarted) return;
        confirmationFinished = true;
        this.operationFailed(error);
      },
      complete: () => {
        if (!requestStarted) this.releaseOperation(entry.idHistorialClinico);
      }
    });
  }

  private releaseOperation(entryId: number): void {
    if (this.operatingEntryId === entryId) this.operatingEntryId = null;
  }

  private operationComplete(operation: 'edit' | 'annul'): void {
    this.operatingEntryId = null;
    this.operationSuccess = operation;
    this.editingEntryId = null;
    this.annullingEntryId = null;
    this.editForm.reset({ comentarios: '', motivo: '' });
    this.annulForm.reset({ motivo: '' });
    this.reload.next();
  }

  private operationFailed(error: { status?: number }): void {
    console.error('Error al modificar el historial:', error.status);
    this.operatingEntryId = null;
    this.operationError = true;
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
