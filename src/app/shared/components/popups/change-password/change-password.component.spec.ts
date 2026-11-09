import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    spyOnProperty(document, 'cookie', 'get').and.returnValue('user=TEST123');
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        ChangePasswordComponent,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
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
    http.expectNone('http://localhost:3000/persona/changePassword');
    expect(component.equalPasswords()).toBeTrue();
  });

  it('sends the signed-in DNI and the matching new password', () => {
    component.form.setValue({ password: 'old', newPassword: 'new', newPasswordSecure: 'new' });
    component.onSubmit();
    const request = http.expectOne('http://localhost:3000/persona/changePassword');
    expect(request.request.body).toEqual({ dni: 'TEST123', password: 'old', newPassword: 'new' });
    request.flush({});
  });
});
