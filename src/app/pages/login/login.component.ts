import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Backend } from 'src/app/JSON-Model/backend';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config/config.service';
import { AuthService } from 'src/app/services/auth/auth.service';

interface User {
  dni: string;
  nombre: string;
  idRolNativo: number;
}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private urls: Backend,
    public formBuilder: FormBuilder,
    private configService: ConfigService,
    private auth: AuthService
  ) { }

  loginError: boolean = false;
  apiError = false;
  rateLimited = false;
  isHidden!: boolean;
  usuarioEncontrado: User | undefined;
  loginBool = false;

  form = this.formBuilder.group({
    dni: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.changesForm();
  }

  login(): void {
    this.loginError = false;
    this.apiError = false;
    this.rateLimited = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadUsername(this.form.controls.dni.value || '');
  }

  private loginFailed() {
    this.loginError = true;
  }

  private loadUsername(dni: string) {
    this.http.post<{ access_token: string; user: User }>(this.configService.getApiUrl('/auth/login'), {
      username: dni, password: this.form.controls.password.value
    }, { withCredentials: true }).subscribe(
      result => {
        this.auth.setSession(result);
        this.loginBool = true;
        window.location.href = '/access-menu';
      },
      error => {
        if (error.status === 401) this.loginFailed();
        else if (error.status === 429) this.rateLimited = true;
        else this.apiError = true;
      }
    );
  }

  changesForm() {
    this.form.valueChanges.subscribe((res) => {
      this.loginError = false;
      this.apiError = false;
      this.rateLimited = false;
    });
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }
}
