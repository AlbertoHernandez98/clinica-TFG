import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password.component';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';
import { Subject } from 'rxjs';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let http: HttpTestingController;
  let confirmation: Subject<boolean>;
  let confirm: jasmine.Spy;

  beforeEach(async () => {
    spyOnProperty(document, 'cookie', 'get').and.returnValue('user=TEST123');
    confirmation = new Subject<boolean>();
    confirm = jasmine.createSpy('confirm').and.returnValue(confirmation.asObservable());
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        ChangePasswordComponent,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: ConfirmActionService, useValue: { confirm } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
    component = TestBed.inject(ChangePasswordComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('does not send an invalid or mismatched password', () => {
    component.onSubmit();
    component.form.setValue({ password: 'old', newPassword: 'new', newPasswordSecure: 'different' });
    component.onSubmit();
    expect(confirm).not.toHaveBeenCalled();
    http.expectNone('http://localhost:3000/persona/changePassword');
    expect(component.equalPasswords()).toBeTrue();
  });

  it('sends the signed-in DNI and the matching new password', () => {
    component.form.setValue({ password: 'old', newPassword: 'new', newPasswordSecure: 'new' });
    component.onSubmit();
    component.onSubmit();
    expect(confirm).toHaveBeenCalledTimes(1);
    http.expectNone('http://localhost:3000/persona/changePassword');
    confirmation.next(true);
    const request = http.expectOne('http://localhost:3000/persona/changePassword');
    expect(request.request.body).toEqual({ dni: 'TEST123', password: 'old', newPassword: 'new' });
    request.flush({});
  });

  it('does not send a request when confirmation is cancelled', () => {
    component.form.setValue({ password: 'old', newPassword: 'new', newPasswordSecure: 'new' });
    component.onSubmit();
    confirmation.next(false);
    expect(component.submitting).toBeFalse();
    http.expectNone('http://localhost:3000/persona/changePassword');
  });

  it('does not send a request if the form is destroyed before confirmation', () => {
    component.form.setValue({ password: 'old', newPassword: 'new', newPasswordSecure: 'new' });
    component.onSubmit();
    component.ngOnDestroy();
    confirmation.next(true);
    http.expectNone('http://localhost:3000/persona/changePassword');
  });
});
