import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AdminCitasComponent } from './admin-citas.component';
import { ClinicDatePickerModule } from '../../forms/clinic-date-picker/clinic-date-picker.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';
import { Subject, of } from 'rxjs';

describe('AdminCitasComponent', () => {
  let fixture: ComponentFixture<AdminCitasComponent>;
  let component: AdminCitasComponent;
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AdminCitasComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ConfirmActionService, useValue: { confirm: () => of(false) } },
        { provide: MAT_DIALOG_DATA, useValue: { selectedUser: { idPersona: 4 } } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminCitasComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/servicio').flush([{ idServicio: 1, servicio: 'Servicio' }]);
    http.expectOne('http://localhost:3000/persona').flush([{ idPersona: 2, idRolNativo: 2, nombre: 'A', apellidos: 'B' }]);
  });

  afterEach(() => { fixture.destroy(); http.verify(); });

  it('checks availability and prevents an unavailable appointment', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-01T10:00', duracion: 30 });
    expect(component.availability).toBe('checking');
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: false });
    expect(component.availability).toBe('unavailable');
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas');
  }));

  it('explains a patient conflict and blocks saving', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-03T16:00', duracion: 30 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: false, motivo: 'paciente_ocupado' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ADMIN_CITA.PACIENTE_OCUPADO');
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas');
  }));

  it('surfaces a conflict that happens after a successful availability check', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-01T10:00', duracion: 30 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: true });
    component.onSubmit();
    http.expectOne('http://localhost:3000/citas').flush('conflict', { status: 409, statusText: 'Conflict' });
    expect(component.errorKey).toBe('ADMIN_CITA.NO_DISPONIBLE');
    expect(component.availability).toBe('unavailable');
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: ['10:30'] });
    component.selectSlot('10:30');
    expect(component.errorKey).toBe('');
    tick(300);
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: true });
    expect(dialogRef.close).not.toHaveBeenCalled();
  }));

  it('explains a patient conflict detected while saving', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-03T16:00', duracion: 30 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: true });
    component.onSubmit();
    http.expectOne('http://localhost:3000/citas').flush(
      { code: 'PATIENT_CONFLICT' }, { status: 409, statusText: 'Conflict' });
    expect(component.errorKey).toBe('ADMIN_CITA.PACIENTE_OCUPADO');
    expect(component.availability).toBe('patient');
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    expect(dialogRef.close).not.toHaveBeenCalled();
  }));

  it('combines the selected date and time into the existing API format', fakeAsync(() => {
    component.dateControl.setValue('2031-02-04');
    component.timeControl.setValue('10:30');
    expect(component.form.controls.fechaInicio.value).toBe('2031-02-04T10:30');
    component.timeControl.setValue('11:00');
    expect(component.form.controls.fechaInicio.value).toBe('2031-02-04T11:00');
    tick(300);
    http.expectNone('http://localhost:3000/citas/disponibilidad');
  }));

  it('explains and prevents booking outside clinic hours', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-01T10:00', duracion: 30 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: false, motivo: 'fuera_horario' });
    fixture.detectChanges();
    expect(component.availability).toBe('outside');
    expect(fixture.nativeElement.textContent).toContain('ADMIN_CITA.FUERA_HORARIO');
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas');
  }));

  it('shows and selects available slots without refetching for a time change', fakeAsync(() => {
    component.form.patchValue({ idMedico: 2, duracion: 60, idServicio: 1 });
    component.dateControl.setValue('2031-02-04');
    tick(300);
    const slots = http.expectOne('http://localhost:3000/citas/huecos');
    expect(slots.request.body).toEqual({ fecha: '2031-02-04', idMedico: 2, duracion: 60, idCliente: 4 });
    slots.flush({ huecos: ['09:30', '10:30'] });
    http.expectNone('http://localhost:3000/citas/disponibilidad');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.slots__list button');
    expect(button.textContent).toContain('09:30');
    button.click();
    expect(component.form.controls.fechaInicio.value).toBe('2031-02-04T09:30');
    tick(300);
    http.expectNone('http://localhost:3000/citas/huecos');
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: true });
    expect(component.availability).toBe('available');
  }));

  it('shows an explicit slots error and retries', fakeAsync(() => {
    component.form.patchValue({ idMedico: 2, duracion: 30 });
    component.dateControl.setValue('2031-02-04');
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush('Error', { status: 500, statusText: 'Error' });
    expect(component.slotsState).toBe('error');
    component.refreshSlots();
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    expect(component.slotsState).toBe('ready');
  }));

  it('cancels outdated requests when the day, doctor or duration changes', fakeAsync(() => {
    component.form.patchValue({ idMedico: 2, duracion: 30 });
    component.dateControl.setValue('2031-02-04');
    tick(300);
    const previous = http.expectOne('http://localhost:3000/citas/huecos');
    component.dateControl.setValue('2031-02-05');
    expect(previous.cancelled).toBeTrue();
    component.form.patchValue({ idMedico: 3, duracion: 90 });
    tick(300);
    const current = http.expectOne('http://localhost:3000/citas/huecos');
    expect(current.request.body).toEqual({ fecha: '2031-02-05', idMedico: 3, duracion: 90, idCliente: 4 });
    current.flush({ huecos: ['16:00'] });
    expect(component.slots).toEqual(['16:00']);
  }));
  it('offers only the allowed durations and refuses other values', fakeAsync(() => {
    fixture.detectChanges();
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('select[formControlName="duracion"] option'));
    expect(options.slice(1).map(option => option.textContent?.trim())).toEqual(['30', '60', '90']);
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2031-02-04T10:00', duracion: 45 });
    tick(300);
    fixture.detectChanges();
    expect(component.form.controls.duracion.hasError('duracionInvalida')).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('ADMIN_CITA.DURACION_INVALIDA');
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas/huecos');
    http.expectNone('http://localhost:3000/citas/disponibilidad');
    http.expectNone('http://localhost:3000/citas');
  }));

  it('rejects a new appointment before today without calling the API', fakeAsync(() => {
    component.form.patchValue({ idServicio: 1, idMedico: 2, fechaInicio: '2000-01-03T16:00', duracion: 30 });
    tick(300);
    expect(component.form.controls.fechaInicio.hasError('fechaPasada')).toBeTrue();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ADMIN_CITA.FECHA_PASADA');
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas/huecos');
    http.expectNone('http://localhost:3000/citas/disponibilidad');
    http.expectNone('http://localhost:3000/citas');
  }));
});

describe('AdminCitasComponent editing an appointment', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: ConfirmActionService, useValue: jasmine.createSpyObj('ConfirmActionService', ['confirm']) },
        { provide: MAT_DIALOG_DATA, useValue: {
          selectedUser: { idPersona: 4 },
          appointment: { idCita: 9, idCliente: 4, idMedico: 2, idServicio: 1, fechaInicio: '2031-02-04T10:00:00', duracion: 30 }
        } }
      ]
    }).compileComponents();
  });

  it('requests slots excluding the appointment being edited', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminCitasComponent);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.history-link');
    expect(link.getAttribute('href')).toBe('/historial;dato=4?cita=9');
    http.expectOne('http://localhost:3000/servicio').flush([]);
    http.expectOne('http://localhost:3000/persona').flush([]);
    tick(300);
    const slots = http.expectOne('http://localhost:3000/citas/huecos');
    expect(slots.request.body.idCita).toBe(9);
    expect(slots.request.body.fecha).toBe('2031-02-04');
    slots.flush({ huecos: ['10:00'] });
    http.expectOne('http://localhost:3000/citas/disponibilidad').flush({ disponible: true });
    fixture.destroy();
    http.verify();
  }));

  it('deletes an existing appointment and reports the change to the list', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminCitasComponent);
    const http = TestBed.inject(HttpTestingController);
    const dialogRef = TestBed.inject(MatDialogRef);
    const confirmation = new Subject<boolean>();
    const confirm = TestBed.inject(ConfirmActionService).confirm as jasmine.Spy;
    confirm.and.returnValue(confirmation.asObservable());
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/servicio').flush([]);
    http.expectOne('http://localhost:3000/persona').flush([]);
    fixture.nativeElement.querySelector('button.delete').click();
    fixture.componentInstance.onDelete();
    expect(confirm).toHaveBeenCalledTimes(1);
    http.expectNone('http://localhost:3000/citas/9');
    confirmation.next(true);
    confirmation.complete();
    const request = http.expectOne('http://localhost:3000/citas/9');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    fixture.destroy();
    tick(300);
    http.verify();
  }));

  it('does not delete an appointment when confirmation is cancelled', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminCitasComponent);
    const http = TestBed.inject(HttpTestingController);
    const confirm = TestBed.inject(ConfirmActionService).confirm as jasmine.Spy;
    confirm.and.returnValue(of(false));
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/servicio').flush([]);
    http.expectOne('http://localhost:3000/persona').flush([]);
    fixture.componentInstance.onDelete();
    http.expectNone('http://localhost:3000/citas/9');
    expect(fixture.componentInstance.saving).toBeFalse();
    fixture.destroy();
    tick(300);
    http.verify();
  }));
});

describe('AdminCitasComponent from a free agenda slot', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: ConfirmActionService, useValue: { confirm: () => of(false) } },
        { provide: MAT_DIALOG_DATA, useValue: {
          initialSlot: { idMedico: 2, fechaInicio: '2031-02-04T10:00' },
          fixedDoctor: { idPersona: 2, nombre: 'Doctora', apellidos: 'Ejemplo' }
        } }
      ]
    }).compileComponents();
  });

  it('requires a patient and checks the chosen slot for that patient', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminCitasComponent);
    const component = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/servicio').flush([{ idServicio: 1, servicio: 'Consulta' }]);
    http.expectOne('http://localhost:3000/persona').flush([
      { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez', idRolNativo: 4 },
      { idPersona: 3, nombre: 'Otro', apellidos: 'Médico', idRolNativo: 2 }
    ]);
    component.form.patchValue({ idServicio: 1 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: ['10:00'] });
    component.onSubmit();
    http.expectNone('http://localhost:3000/citas');
    expect(component.pacientes.length).toBe(1);
    component.patientControl.setValue(4);
    tick(300);
    const updatedSlots = http.expectOne('http://localhost:3000/citas/huecos');
    expect(updatedSlots.request.body.idCliente).toBe(4);
    updatedSlots.flush({ huecos: ['10:00'] });
    const check = http.expectOne('http://localhost:3000/citas/disponibilidad');
    expect(check.request.body.idCliente).toBe(4);
    expect(check.request.body.fechaInicio).toBe('2031-02-04T10:00');
    check.flush({ disponible: true });
    component.onSubmit();
    const save = http.expectOne('http://localhost:3000/citas');
    expect(save.request.body.idCliente).toBe(4);
    save.flush({ idCita: 10 });
    fixture.destroy();
    http.verify();
  }));
});

describe('AdminCitasComponent for a doctor', () => {
  let fixture: ComponentFixture<AdminCitasComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: ConfirmActionService, useValue: { confirm: () => of(false) } },
        { provide: MAT_DIALOG_DATA, useValue: {
          selectedUser: { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez' },
          fixedDoctor: { idPersona: 2, nombre: 'Doctor', apellidos: 'Ejemplo' }
        } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminCitasComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('http://localhost:3000/servicio').flush([{ idServicio: 1, servicio: 'Servicio' }]);
  });

  afterEach(() => { fixture.destroy(); http.verify(); });

  it('uses the logged-in doctor without offering a doctor selector', fakeAsync(() => {
    expect(fixture.componentInstance.form.controls.idMedico.value).toBe(2);
    expect(fixture.nativeElement.querySelector('select[formControlName="idMedico"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('input[readonly]').value).toBe('Doctor Ejemplo');
    fixture.componentInstance.form.patchValue({ idServicio: 1, fechaInicio: '2031-02-01T10:00', duracion: 30 });
    tick(300);
    http.expectOne('http://localhost:3000/citas/huecos').flush({ huecos: [] });
    const request = http.expectOne('http://localhost:3000/citas/disponibilidad');
    expect(request.request.body.idMedico).toBe(2);
    expect(request.request.body.idCliente).toBe(4);
    request.flush({ disponible: true });
    fixture.componentInstance.onSubmit();
    const save = http.expectOne('http://localhost:3000/citas');
    expect(save.request.body.idMedico).toBe(2);
    save.flush({ idCita: 7 });
  }));
});
