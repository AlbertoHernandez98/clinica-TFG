import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AdminCitasComponent } from './admin-citas.component';

describe('AdminCitasComponent', () => {
  let fixture: ComponentFixture<AdminCitasComponent>;
  let component: AdminCitasComponent;
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AdminCitasComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
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
    expect(slots.request.body).toEqual({ fecha: '2031-02-04', idMedico: 2, duracion: 60 });
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
    component.form.patchValue({ idMedico: 3, duracion: 45 });
    tick(300);
    const current = http.expectOne('http://localhost:3000/citas/huecos');
    expect(current.request.body).toEqual({ fecha: '2031-02-05', idMedico: 3, duracion: 45 });
    current.flush({ huecos: ['16:00'] });
    expect(component.slots).toEqual(['16:00']);
  }));
});

describe('AdminCitasComponent editing an appointment', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
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
});

describe('AdminCitasComponent from a free agenda slot', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
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
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminCitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
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
