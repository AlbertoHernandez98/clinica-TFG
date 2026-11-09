import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, interval, merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config/config.service';
import { UserChangesService } from '../../../../services/users/user-changes.service';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';
import { clinicToday } from '../../../classes/clinic-date';

interface Appointment {
  idCita: number;
  idCliente: number | null;
  idMedico: number;
  idServicio: number | null;
  fecha: string;
  fechaInicio: string | null;
  duracion: number | null;
  nombre: string | null;
  apellidos: string | null;
  servicio: string | null;
}
interface Holiday { fechaInicio: string; fechaFin: string; }
interface AgendaResponse { citas: Appointment[]; vacaciones: Holiday[]; sinFecha: number; huecos: Record<string, string[]>; }
interface EventView { appointment: Appointment; time: string; continued: boolean; }
interface DayView { date: string; label: string; holiday: boolean; closed: boolean; hours: EventView[][]; noTime: Appointment[]; outside: Appointment[]; slots: string[]; }
interface Staff { idPersona: number; idRolNativo: number; nombre: string; apellidos: string; }

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.scss']
})
export class AgendaMedicoComponent implements OnInit, OnDestroy {
  readonly hours = Array.from({ length: 21 }, (_, index) => {
    const minutes = 570 + index * 30;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });
  days: DayView[] = [];
  loading = true;
  error = false;
  withoutDate = 0;
  staff?: Staff;
  doctors: Staff[] = [];
  selectedDoctor: number | null = null;
  weekStart = this.monday(clinicToday());
  private readonly changes = new Subject<void>();
  private readonly staffRefresh = new Subject<void>();
  private readonly destroyed = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<AgendaMedicoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { selectedUser?: { idPersona: number; nombre?: string; apellidos?: string } } | null,
    private dialog: MatDialog,
    private http: HttpClient,
    private config: ConfigService,
    private translate: TranslateService,
    private userChanges: UserChangesService
  ) {}

  ngOnInit(): void {
    this.changes.pipe(
      switchMap(() => {
        if (!this.staff) return of(null);
        this.loading = true;
        this.error = false;
        this.days = [];
        if (this.selectedDoctor === null) { this.loading = false; return of(null); }
        return this.http.get<AgendaResponse>(this.config.getApiUrl('/citas/agenda'), {
          params: new HttpParams().set('inicio', this.dateKey(this.weekStart)).set('idMedico', String(this.selectedDoctor))
        }).pipe(catchError(error => {
          console.error('Error al cargar la agenda:', error);
          this.error = true;
          this.loading = false;
          return of(null);
        }));
      }),
      takeUntil(this.destroyed)
    ).subscribe(result => {
      if (!result) return;
      this.withoutDate = result.sinFecha;
      this.days = this.buildDays(result);
      this.loading = false;
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.days.forEach(day => day.label = this.dayLabel(day.date));
    });
    merge(this.staffRefresh, this.userChanges.changes$, interval(30000)).pipe(
      startWith(undefined),
      switchMap(() => {
        if (!this.staff) {
          this.loading = true;
          this.error = false;
        }
        return this.http.get<Staff>(this.config.getApiUrl('/auth/me')).pipe(
          switchMap(staff => {
            if (![1, 2, 3].includes(staff.idRolNativo)) throw new Error('La sesión no puede administrar citas');
            if (staff.idRolNativo === 2) return of({ staff, users: [staff] });
            return this.http.get<Staff[]>(this.config.getApiUrl('/persona')).pipe(map(users => ({ staff, users })));
          }),
          catchError(error => {
            console.error('Error al cargar profesionales:', error);
            this.staff = undefined;
            this.loading = false;
            this.error = true;
            return of(null);
          })
        );
      }),
      takeUntil(this.destroyed)
    ).subscribe(result => {
      if (!result) return;
      const needsReload = !this.staff;
      this.staff = result.staff;
      this.doctors = result.users.filter(user => user.idRolNativo === 2);
      const previousDoctor = this.selectedDoctor;
      if (this.selectedDoctor === null || !this.doctors.some(doctor => doctor.idPersona === Number(this.selectedDoctor))) {
        this.selectedDoctor = this.doctors.length ? this.doctors[0].idPersona : null;
      }
      if (needsReload || previousDoctor !== this.selectedDoctor) this.changes.next();
    });
  }

  retry(): void {
    if (!this.staff) this.staffRefresh.next();
    else this.changes.next();
  }

  changeDoctor(): void { this.changes.next(); }

  createAppointment(day: DayView, hour: string): void {
    if (this.selectedDoctor === null || !this.canCreateOn(day.date) || !day.slots.includes(hour) || day.holiday) return;
    const ref = this.dialog.open(AdminCitasComponent, {
      data: {
        initialSlot: { fechaInicio: `${day.date}T${hour}`, idMedico: Number(this.selectedDoctor) },
        ...(this.data?.selectedUser ? { selectedUser: this.data.selectedUser } : {}),
        ...(this.staff?.idRolNativo === 2 ? { fixedDoctor: this.staff } : {})
      },
      width: '500px', maxWidth: '95vw'
    });
    ref.afterClosed().pipe(takeUntil(this.destroyed)).subscribe(saved => { if (saved) this.changes.next(); });
  }

  editAppointment(appointment: Appointment): void {
    if (appointment.idCliente === null || appointment.idServicio === null) return;
    const ref = this.dialog.open(AdminCitasComponent, {
      data: {
        selectedUser: { idPersona: appointment.idCliente, nombre: appointment.nombre, apellidos: appointment.apellidos },
        appointment,
        ...(this.staff?.idRolNativo === 2 ? { fixedDoctor: this.staff } : {})
      },
      width: '500px', maxWidth: '95vw'
    });
    ref.afterClosed().pipe(takeUntil(this.destroyed)).subscribe(saved => { if (saved) this.changes.next(); });
  }

  changeWeek(offset: number): void {
    this.weekStart = this.addDays(this.weekStart, offset * 7);
    this.changes.next();
  }

  today(): void {
    this.weekStart = this.monday(clinicToday());
    this.changes.next();
  }

  get selectedWeekDate(): string { return this.dateKey(this.weekStart); }

  jumpToWeek(value: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return;
    this.weekStart = this.monday(value);
    this.changes.next();
  }

  canCreateOn(date: string): boolean { return date >= clinicToday(); }

  get weekLabel(): string {
    const format = new Intl.DateTimeFormat(this.translate.currentLang || 'es', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
    });
    return `${format.format(this.weekStart)} – ${format.format(this.addDays(this.weekStart, 4))}`;
  }

  private monday(date: string): Date {
    const utc = new Date(`${date}T00:00:00Z`);
    return this.addDays(utc, -((utc.getUTCDay() + 6) % 7));
  }

  private addDays(date: Date, count: number): Date {
    return new Date(date.getTime() + count * 86400000);
  }

  private dateKey(date: Date): string { return date.toISOString().slice(0, 10); }

  private dayLabel(date: string): string {
    const language = this.translate.currentLang || 'es';
    return new Intl.DateTimeFormat(language, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
      .format(new Date(`${date}T00:00:00Z`));
  }

  isOpen(day: DayView, index: number): boolean {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    const minute = 570 + index * 30;
    return weekday === 2 || weekday === 4 ? minute >= 570 && minute < 810 :
      [1, 3, 5].includes(weekday) && minute >= 960 && minute < 1200;
  }

  private buildDays(response: AgendaResponse): DayView[] {
    return Array.from({ length: 5 }, (_, index) => {
      const start = this.addDays(this.weekStart, index);
      const date = this.dateKey(start);
      const end = this.addDays(start, 1);
      const hours: EventView[][] = Array.from({ length: this.hours.length }, () => []);
      const noTime: Appointment[] = [];
      const outside: Appointment[] = [];
      const closed = start.getUTCDay() === 0 || start.getUTCDay() === 6;
      const day: DayView = {
        date, label: this.dayLabel(date), closed,
        holiday: !closed && response.vacaciones.some(period => period.fechaInicio <= date && period.fechaFin >= date),
        hours, noTime, outside, slots: response.huecos[date]
      };
      response.citas.forEach(appointment => {
        if (!appointment.fechaInicio) {
          if (appointment.fecha === date) noTime.push(appointment);
          return;
        }
        const begins = new Date(`${appointment.fechaInicio}Z`);
        const ends = new Date(begins.getTime() + (appointment.duracion || 0) * 60000);
        const continues = begins < start && ends > start;
        if (!continues && (begins < start || begins >= end)) return;
        const time = appointment.fechaInicio.slice(11, 16);
        let placed = false;
        this.hours.forEach((_, index) => {
          if (!this.isOpen(day, index)) return;
          const slotStart = start.getTime() + (570 + index * 30) * 60000;
          const slotEnd = slotStart + 1800000;
          if (begins.getTime() < slotEnd && Math.max(ends.getTime(), begins.getTime() + 1) > slotStart) {
            hours[index].push({ appointment, time, continued: continues || placed });
            placed = true;
          }
        });
        if (!placed && appointment.fecha === date) outside.push(appointment);
      });
      return day;
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
