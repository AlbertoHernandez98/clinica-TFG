import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { CitasComponent } from './citas.component';
import { AdminCitasComponent } from '../admin-citas/admin-citas.component';

describe('CitasComponent', () => {
  let component: CitasComponent;
  let fixture: ComponentFixture<CitasComponent>;
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CitasComponent>>;
  let dialog: jasmine.SpyObj<MatDialog>;
  const patient = { idPersona: 5 };
  const staff = { idPersona: 10, idRolNativo: 1, nombre: 'Admin', apellidos: 'Test' };
  const url = 'http://localhost:3000/citas';

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: dialog },
        { provide: MAT_DIALOG_DATA, useValue: { selectedUser: patient } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CitasComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); http.verify(); });

  it('shows loading and empty states', () => {
    expect(fixture.nativeElement.querySelector('.appointments__state')).toBeTruthy();
    http.expectOne(url).flush([]);
    http.expectOne('http://localhost:3000/auth/me').flush(staff);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.appointments__empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('shows a loading error rather than an empty list', () => {
    http.expectOne('http://localhost:3000/auth/me');
    http.expectOne(url).flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.appointments__empty')).toBeFalsy();
  });

  it('opens an existing appointment for modification or deletion and refreshes after a change', () => {
    const appointment = { idCita: 9, idCliente: 5, idMedico: 2, idServicio: 2, fechaInicio: '2026-01-15T10:00:00', duracion: 30 };
    const closed = new Subject<boolean>();
    dialog.open.and.returnValue({ afterClosed: () => closed.asObservable() } as MatDialogRef<AdminCitasComponent>);
    http.expectOne(url).flush([appointment]);
    http.expectOne('http://localhost:3000/auth/me').flush(staff);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.appointments__item').textContent).toContain('2');
    fixture.nativeElement.querySelector('button.appointments__manage').click();
    expect(dialog.open).toHaveBeenCalledWith(AdminCitasComponent, jasmine.objectContaining({
      data: { selectedUser: patient, appointment }
    }));
    expect(fixture.nativeElement.querySelector('.appointments__create')).toBeNull();
    closed.next(true);
    http.expectOne(url).flush([]);
    http.expectOne('http://localhost:3000/auth/me').flush(staff);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.appointments__empty')).not.toBeNull();
  });

  it('does not refresh the list when the appointment dialog is cancelled', () => {
    const closed = new Subject<boolean>();
    dialog.open.and.returnValue({ afterClosed: () => closed.asObservable() } as MatDialogRef<AdminCitasComponent>);
    http.expectOne(url).flush([{ idCita: 9, idCliente: 5, idServicio: 2 }]);
    http.expectOne('http://localhost:3000/auth/me').flush(staff);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button.appointments__manage').click();
    closed.next(false);
    http.expectNone(url);
  });

  it('closes the list', () => {
    http.expectOne(url).flush([]);
    http.expectOne('http://localhost:3000/auth/me').flush(staff);
    fixture.nativeElement.querySelector('.appointments__close').click();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('only lets a doctor manage their own appointments', () => {
    const doctor = { idPersona: 2, idRolNativo: 2, nombre: 'Ana', apellidos: 'Test' };
    const own = { idCita: 9, idCliente: 5, idMedico: 2, idServicio: 2, fechaInicio: null, duracion: null };
    const other = { ...own, idCita: 10, idMedico: 3 };
    http.expectOne(url).flush([own, other]);
    http.expectOne('http://localhost:3000/auth/me').flush(doctor);
    dialog.open.and.returnValue({ afterClosed: () => new Subject<boolean>().asObservable() } as MatDialogRef<AdminCitasComponent>);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button.appointments__manage').length).toBe(1);
    component.editAppointment(other);
    expect(dialog.open).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('button.appointments__manage').click();
    expect(dialog.open).toHaveBeenCalledWith(AdminCitasComponent, jasmine.objectContaining({
      data: { selectedUser: patient, appointment: own, fixedDoctor: doctor }
    }));
  });

  it('allows reception to manage appointments for other doctors', () => {
    http.expectOne(url).flush([{ idCita: 9, idCliente: 5, idMedico: 2, idServicio: 2 }]);
    http.expectOne('http://localhost:3000/auth/me').flush({ ...staff, idRolNativo: 3 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button.appointments__manage')).not.toBeNull();
  });
});
