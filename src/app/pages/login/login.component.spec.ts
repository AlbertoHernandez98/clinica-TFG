import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Backend } from 'src/app/JSON-Model/backend';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LoginComponent],
      providers: [Backend]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('does not request authentication for an incomplete form', () => {
    component.login();
    http.expectNone('http://localhost:3000/auth/login');
    expect(component.form.controls.dni.touched).toBeTrue();
  });

  it('submits credentials to the server and distinguishes invalid credentials', () => {
    component.form.setValue({ dni: 'TEST', password: 'bad' });
    component.login();
    const request = http.expectOne('http://localhost:3000/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'TEST', password: 'bad' });
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(component.loginError).toBeTrue();
    expect(component.apiError).toBeFalse();
  });

  it('shows a server error separately', () => {
    component.form.setValue({ dni: 'TEST', password: 'bad' });
    component.login();
    http.expectOne('http://localhost:3000/auth/login').flush({}, { status: 500, statusText: 'Error' });
    expect(component.apiError).toBeTrue();
    expect(component.loginError).toBeFalse();
  });
});
