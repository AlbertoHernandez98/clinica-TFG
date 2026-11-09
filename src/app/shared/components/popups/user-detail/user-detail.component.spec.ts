import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailComponent } from './user-detail.component';
import { UserChangesService } from '../../../../services/users/user-changes.service';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';
import { Subject } from 'rxjs';

describe('UserDetailComponent', () => {
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserDetailComponent>>;
  let confirmation: Subject<boolean>;
  let confirm: jasmine.Spy;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    confirmation = new Subject<boolean>();
    confirm = jasmine.createSpy('confirm').and.returnValue(confirmation.asObservable());
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ConfirmActionService, useValue: { confirm } },
        { provide: MAT_DIALOG_DATA, useValue: { staff: { idPersona: 10, idRolNativo: 1 } } },
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

  it('fixes the patient role when a doctor creates a user', () => {
    TestBed.inject(MAT_DIALOG_DATA).staff = { idPersona: 2, idRolNativo: 2 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    expect(component.form.controls.idRolNativo.value).toBe(4);
    component.form.patchValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: 1 });
    component.onCreate();
    const request = http.expectOne('http://localhost:3000/persona');
    expect(request.request.body.idRolNativo).toBe(4);
    request.flush({ idPersona: 1 });
  });

  it('restricts doctors to patients and does not allow deleting them', () => {
    TestBed.inject(MAT_DIALOG_DATA).staff = { idPersona: 2, idRolNativo: 2 };
    TestBed.inject(MAT_DIALOG_DATA).selectedUser = { idPersona: 4, idRolNativo: 4 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    expect(component.availableRoles.map(role => role.idRol)).toEqual([4]);
    expect(component.canDelete).toBeFalse();
    component.onDelete();
    http.expectNone('http://localhost:3000/persona/4');
  });

  it('allows receptionists to manage only doctor and patient roles', () => {
    TestBed.inject(MAT_DIALOG_DATA).staff = { idPersona: 3, idRolNativo: 3 };
    TestBed.inject(MAT_DIALOG_DATA).selectedUser = { idPersona: 2, idRolNativo: 2 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    expect(component.availableRoles.map(role => role.idRol)).toEqual([2, 4]);
    expect(component.canDelete).toBeTrue();
  });

  it('notifies open views after reception creates a doctor', () => {
    TestBed.inject(MAT_DIALOG_DATA).staff = { idPersona: 3, idRolNativo: 3 };
    const component = TestBed.inject(UserDetailComponent);
    const notify = spyOn(TestBed.inject(UserChangesService), 'notify');
    component.ngOnInit();
    component.form.setValue({ nombre: 'Ana', apellidos: 'Pérez', dni: '12345678A', telefono: '612345678', email: 'ana@example.com', password: 'pass', idRolNativo: '2' });
    component.onCreate();
    const request = http.expectOne('http://localhost:3000/persona');
    expect(request.request.body.idRolNativo).toBe(2);
    expect(notify).not.toHaveBeenCalled();
    request.flush({ idPersona: 5 });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('requires confirmation before deleting the selected user', () => {
    TestBed.inject(MAT_DIALOG_DATA).selectedUser = { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez', idRolNativo: 4 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.onDelete();
    component.onDelete();
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm.calls.mostRecent().args[0].params.user).toBe('Ana Pérez');
    http.expectNone('http://localhost:3000/persona/4');
    confirmation.next(false);
    confirmation.complete();
    expect(component.saving).toBeFalse();
    confirmation = new Subject<boolean>();
    confirm.and.returnValue(confirmation.asObservable());
    component.onDelete();
    confirmation.next(true);
    const request = http.expectOne('http://localhost:3000/persona/4');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('confirms password changes in the user editor but not ordinary edits', () => {
    TestBed.inject(MAT_DIALOG_DATA).selectedUser = { idPersona: 4, dni: '12345678', nombre: 'Ana', apellidos: 'Pérez', telefono: 612345678, email: 'ana@example.com', idRolNativo: 4 };
    const component = TestBed.inject(UserDetailComponent);
    component.ngOnInit();
    component.form.patchValue({ password: 'newpass' });
    component.onSubmit();
    http.expectNone('http://localhost:3000/persona/changeUser');
    confirmation.next(false);
    confirmation.complete();
    expect(component.saving).toBeFalse();
    confirmation = new Subject<boolean>();
    confirm.and.returnValue(confirmation.asObservable());
    component.onSubmit();
    confirmation.next(true);
    const request = http.expectOne('http://localhost:3000/persona/changeUser');
    expect(request.request.body.password).toBe('newpass');
    request.flush(null);
  });
});
