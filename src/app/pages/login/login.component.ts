import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Backend } from 'src/app/JSON-Model/backend';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/services/config/config.service';

interface User {
  dni: string;
  nombre: string;
  password: string;
  idRolNativo: number;
  [key: string]: any;
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
    private configService: ConfigService
  ) { }

  loginError: boolean = false;
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
    this.loadUsername(this.form.controls.dni.value || '');
  }

  private loginFailed() {
    this.loginError = true;
  }

  private loadUserRol(userLogged: User) {
    console.log('Usuario a verificar:', userLogged);
    console.log('Contraseña ingresada:', this.form.controls.password.value);
    console.log('Contraseña en BD:', userLogged.password);
    
    if (userLogged.password === this.form.controls.password.value) {
      this.loginBool = true;
      document.cookie = `idRol=${userLogged.idRolNativo}`;
      document.cookie = `sessionToken=${Math.random()}`;
      window.location.href = '/access-menu';
    } else {
      this.loginFailed();
      console.error('Contraseñas no coinciden');
    }
  }

  private loadUsername(dni: string) {
    const url = this.configService.getApiUrl('/persona');

    this.http.get<User[]>(url).subscribe(
      (parsedData: User[]) => {
        console.log('Data:', parsedData);
        console.log('DNI:', dni);
        
        // Handle both arrays and single objects
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        this.usuarioEncontrado = dataArray.find((user: User) => user.dni === dni);
        
        if (this.usuarioEncontrado) {
          document.cookie = `user=${this.usuarioEncontrado.dni}`;
          document.cookie = `nombre=${this.usuarioEncontrado.nombre}`;

          console.log('Usuario encontrado:', this.usuarioEncontrado);
          console.log('Contraseña:', this.usuarioEncontrado.password);

          this.loadUserRol(this.usuarioEncontrado);
        } else {
          this.loginFailed();
          console.error('Usuario no encontrado con DNI:', dni);
        }
      },
      (error) => {
        console.error('Error:', error);
        this.loginFailed();
      }
    );
  }

  changesForm() {
    this.form.valueChanges.subscribe((res) => {
      this.loginError = false;
    });
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }
}
