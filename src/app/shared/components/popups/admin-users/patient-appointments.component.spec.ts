import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AdminUsersComponent } from './admin-users.component';
import { CitasComponent } from '../citas/citas.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { of } from 'rxjs';

describe('Patient appointment selection', () => {
  let fixture: ComponentFixture<AdminUsersComponent>;
  let http: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  const patient = { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez', idRolNativo: 4 };

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminUsersComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: { patientAppointments: true } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminUsersComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); http.verify(); });

  function load(role: number) {
    http.expectOne('http://localhost:3000/persona').flush([
      patient, { idPersona: 2, nombre: 'Otro', apellidos: 'Médico', idRolNativo: 2 }
    ]);
    http.expectOne('http://localhost:3000/auth/me').flush({
      idPersona: 2, nombre: 'Doctor', apellidos: 'Ejemplo', idRolNativo: role
    });
    fixture.detectChanges();
  }

  it('only lists patients and opens the read-only appointment list for the doctor', () => {
    load(2);
    expect(fixture.nativeElement.querySelectorAll('.admin-users__user').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.admin-users__create')).not.toBeNull();
    fixture.nativeElement.querySelector('.admin-users__user').click();
    expect(dialog.open).toHaveBeenCalledWith(CitasComponent, jasmine.objectContaining({
      data: { selectedUser: patient }
    }));
  });

  [1, 2, 3].forEach(role => {
    it(`allows role ${role} to add a patient and refreshes the list on success`, () => {
      load(role);
      dialog.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<UserDetailComponent>);
      fixture.nativeElement.querySelector('.admin-users__create').click();
      expect(dialog.open).toHaveBeenCalledWith(UserDetailComponent, jasmine.objectContaining({
        data: { patientOnly: true }
      }));
      http.expectOne('http://localhost:3000/persona').flush([patient]);
      http.expectOne('http://localhost:3000/auth/me').flush({
        idPersona: 2, nombre: 'Doctor', apellidos: 'Ejemplo', idRolNativo: role
      });
    });
  });

  it('does not reload when patient creation is cancelled', () => {
    load(2);
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<UserDetailComponent>);
    fixture.nativeElement.querySelector('.admin-users__create').click();
    expect(dialog.open).toHaveBeenCalledWith(UserDetailComponent, jasmine.objectContaining({ data: { patientOnly: true } }));
    http.expectNone('http://localhost:3000/persona');
  });

  [1, 3].forEach(role => {
    it(`opens the appointment list for role ${role}`, () => {
      load(role);
      fixture.nativeElement.querySelector('.admin-users__user').click();
      expect(dialog.open).toHaveBeenCalledWith(CitasComponent, jasmine.objectContaining({
        data: { selectedUser: patient }
      }));
    });
  });

  it('does not expose the list if the session has no scheduling permission', () => {
    load(4);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.admin-users__user').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.admin-users__create')).toBeNull();
  });
});
