import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailComponent } from './user-detail.component';

describe('UserDetailComponent', () => {
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserDetailComponent>>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        UserDetailComponent
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a user using the backend field names and no client-generated ID', () => {
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.form.setValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: '4' });
    component.onCreate();
    const request = http.expectOne('http://localhost:3000/persona');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: 4 });
    request.flush({ idPersona: 1 });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('keeps the form open when creating a user fails', () => {
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.form.setValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: 4 });
    component.onCreate();
    http.expectOne('http://localhost:3000/persona').flush('Error', { status: 409, statusText: 'Conflict' });
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.saving).toBeFalse();
  });

  it('updates with the original DNI and leaves the password unchanged when blank', () => {
    const data = TestBed.inject(MAT_DIALOG_DATA);
    data.selectedUser = { idPersona: 1, dni: '12345678', nombre: 'Ana', apellidos: 'Pérez', telefono: 612345678, email: 'ana@example.com', idRolNativo: 4 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.form.patchValue({ nombre: 'María' });
    component.onSubmit();
    const request = http.expectOne('http://localhost:3000/persona/changeUser');
    expect(request.request.body).toEqual({ oldDni: '12345678', dni: '12345678', nombre: 'María', apellidos: 'Pérez', telefono: '612345678', email: 'ana@example.com', idRolNativo: 4 });
    expect(dialogRef.close).not.toHaveBeenCalled();
    request.flush(null);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('requires a valid email address for new users', () => {
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.form.setValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: '', password: 'pass', idRolNativo: 4 });
    expect(component.form.invalid).toBeTrue();
    component.form.patchValue({ email: 'invalid' });
    component.onCreate();
    expect(component.form.controls.email.invalid).toBeTrue();
    http.expectNone('http://localhost:3000/persona');
  });

  it('fixes the patient role when creating from patient appointments', () => {
    TestBed.inject(MAT_DIALOG_DATA).patientOnly = true;
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    expect(component.form.controls.idRolNativo.value).toBe(4);
    component.form.patchValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: 1 });
    component.onCreate();
    const request = http.expectOne('http://localhost:3000/persona');
    expect(request.request.body.idRolNativo).toBe(4);
    request.flush({ idPersona: 1 });
  });
});
