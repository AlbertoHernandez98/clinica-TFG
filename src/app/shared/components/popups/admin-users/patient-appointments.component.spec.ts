import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AdminUsersComponent } from './admin-users.component';
import { CitasComponent } from '../citas/citas.component';

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
    expect(fixture.nativeElement.querySelector('.admin-users__create')).toBeNull();
    fixture.nativeElement.querySelector('.admin-users__user').click();
    expect(dialog.open).toHaveBeenCalledWith(CitasComponent, jasmine.objectContaining({
      data: { selectedUser: patient }
    }));
  });

  [1, 2, 3].forEach(role => {
    it(`does not offer patient creation to role ${role}`, () => {
      load(role);
      expect(fixture.nativeElement.querySelector('.admin-users__create')).toBeNull();
    });
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
