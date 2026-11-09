import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';
import { AgendaMedicoComponent } from './agenda-medico.component';
import { UserChangesService } from '../../../../services/users/user-changes.service';
import { ClinicDatePickerModule } from '../../forms/clinic-date-picker/clinic-date-picker.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Interactive weekly agenda', () => {
  let fixture: ComponentFixture<AgendaMedicoComponent>;
  let component: AgendaMedicoComponent;
  let http: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  const doctor = { idPersona: 2, idRolNativo: 2, nombre: 'Doctora', apellidos: 'Ejemplo' };
  const appointment = { idCita: 9, idCliente: 4, idServicio: 1, idMedico: 2, fecha: '2031-02-03',
    fechaInicio: '2031-02-03T16:30:00', duracion: 30, nombre: 'Ana', apellidos: 'Pérez', servicio: 'Consulta' };
  const response = {
    citas: [appointment], vacaciones: [{ fechaInicio: '2031-02-04', fechaFin: '2031-02-04' }], sinFecha: 0,
    huecos: { '2031-02-03': ['16:00', '17:00'], '2031-02-04': [], '2031-02-05': [],
      '2031-02-06': [], '2031-02-07': [], '2031-02-08': [], '2031-02-09': [] }
  };

  beforeEach(async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2031-02-03T12:00:00Z'));
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [AgendaMedicoComponent],
      imports: [HttpClientTestingModule, FormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AgendaMedicoComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); http.verify(); jasmine.clock().uninstall(); });

  function agenda(start = '2031-02-03', id = 2) {
    return http.expectOne(req => req.url === 'http://localhost:3000/citas/agenda' &&
      req.params.get('inicio') === start && req.params.get('idMedico') === String(id));
  }

  function loadDoctor() {
    http.expectOne('http://localhost:3000/auth/me').flush(doctor);
    http.expectNone('http://localhost:3000/persona');
    agenda().flush(response);
    fixture.detectChanges();
  }

  it('shows only the authenticated doctor, five weekdays, holidays and appointments', () => {
    loadDoctor();
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
    expect(component.days.length).toBe(5);
    expect(component.days[1].holiday).toBeTrue();
    expect(component.days[0].hours[14][0].appointment.idCita).toBe(9);
    expect(fixture.nativeElement.querySelectorAll('.agenda__free').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Ana');
  });

  it('opens a free time with the doctor fixed and refreshes after saving', () => {
    loadDoctor();
    const closed = new Subject<boolean>();
    const ref = jasmine.createSpyObj<MatDialogRef<AdminCitasComponent>>('MatDialogRef', ['afterClosed']);
    ref.afterClosed.and.returnValue(closed.asObservable());
    dialog.open.and.returnValue(ref);
    fixture.nativeElement.querySelector('.agenda__free').click();
    expect(dialog.open).toHaveBeenCalledWith(AdminCitasComponent, jasmine.objectContaining({
      data: { initialSlot: { fechaInicio: '2031-02-03T16:00', idMedico: 2 }, fixedDoctor: doctor }
    }));
    closed.next(true);
    agenda().flush(response);
  });

  it('opens an existing appointment for its patient', () => {
    loadDoctor();
    dialog.open.and.returnValue({ afterClosed: () => of(false) } as MatDialogRef<AdminCitasComponent>);
    fixture.nativeElement.querySelector('.agenda__appointment').click();
    expect(dialog.open).toHaveBeenCalledWith(AdminCitasComponent, jasmine.objectContaining({
      data: { selectedUser: { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez' }, appointment, fixedDoctor: doctor }
    }));
    http.expectNone(req => req.url.endsWith('/citas/agenda'));
  });

  [1, 3].forEach(role => {
    it(`lets role ${role} choose a clinic doctor and cancels outdated requests`, () => {
      http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: role });
      http.expectOne('http://localhost:3000/persona').flush([doctor, { ...doctor, idPersona: 3 }, { ...doctor, idPersona: 4, idRolNativo: 4 }]);
      const previous = agenda();
      component.selectedDoctor = 3;
      component.changeDoctor();
      expect(previous.cancelled).toBeTrue();
      agenda('2031-02-03', 3).flush(response);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('select option').length).toBe(2);
      component.changeWeek(1);
      const next = agenda('2031-02-10', 3);
      component.today();
      expect(next.cancelled).toBeTrue();
      agenda('2031-02-03', 3).flush(response);
    });
  });

  it('displays errors and retries initialization', () => {
    http.expectOne('http://localhost:3000/auth/me').flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    component.jumpToWeek('2031-04-19');
    expect(component.error).toBeTrue();
    component.retry();
    http.expectOne('http://localhost:3000/auth/me').flush(doctor);
    agenda().flush(response);
    expect(component.error).toBeFalse();
  });

  it('updates professionals on user changes and keeps the selected doctor', () => {
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor]);
    agenda().flush(response);
    TestBed.inject(UserChangesService).notify();
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor, { ...doctor, idPersona: 5, nombre: 'Nuevo' }]);
    http.expectNone(req => req.url.endsWith('/citas/agenda'));
    fixture.detectChanges();
    expect(component.selectedDoctor).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('select option').length).toBe(2);
  });

  it('refreshes automatically and selects another doctor when the previous one is removed', () => {
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor]);
    agenda().flush(response);
    fixture.detectChanges();
    jasmine.clock().tick(30000);
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([{ ...doctor, idPersona: 5 }]);
    agenda('2031-02-03', 5).flush(response);
    expect(component.selectedDoctor).toBe(5);
  });

  it('reports professional refresh errors and retries', () => {
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor]);
    agenda().flush(response);
    jasmine.clock().tick(30000);
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush('Error', { status: 500, statusText: 'Error' });
    expect(component.error).toBeTrue();
    component.retry();
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor]);
    agenda().flush(response);
    expect(component.error).toBeFalse();
  });

  it('polls for new professionals without interrupting the current agenda', () => {
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor]);
    agenda().flush(response);
    const currentDays = component.days;
    jasmine.clock().tick(30000);
    expect(component.loading).toBeFalse();
    expect(component.days).toBe(currentDays);
    http.expectOne('http://localhost:3000/auth/me').flush({ ...doctor, idRolNativo: 3 });
    http.expectOne('http://localhost:3000/persona').flush([doctor, { ...doctor, idPersona: 5 }]);
    http.expectNone(req => req.url.endsWith('/citas/agenda'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('select option').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.agenda__refresh')).toBeNull();
    expect(component.days).toBe(currentDays);
  });

  it('jumps to the week containing the chosen date, including weekends', () => {
    loadDoctor();
    component.jumpToWeek('2031-04-19');
    agenda('2031-04-14').flush({ ...response, citas: [], vacaciones: [], huecos: {} });
    expect(component.selectedWeekDate).toBe('2031-04-14');
    component.today();
    agenda().flush(response);
    expect(component.selectedWeekDate).toBe('2031-02-03');
  });

  it('does not offer or create appointments before today but keeps existing appointments visible', () => {
    loadDoctor();
    jasmine.clock().mockDate(new Date('2031-02-04T12:00:00Z'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.agenda__free').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.agenda__appointment')).not.toBeNull();
    component.createAppointment(component.days[0], '16:00');
    expect(dialog.open).not.toHaveBeenCalled();
  });
});
