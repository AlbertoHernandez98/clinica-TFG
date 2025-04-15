import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Backend } from 'src/app/JSON-Model/backend';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { log } from 'console';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private urls: Backend,
    public formBuilder: FormBuilder
  ) { }


  loginError: boolean = false;

  isHidden!: boolean;

  usuarioEncontrado!: any;

  form = this.formBuilder.group({
    dni: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginBool = false;

  ngOnInit() {
    this.changesForm();
  }

  login(): void {
    this.loadUsername(this.form.controls.dni.value);

    if (this.usuarioEncontrado) {


      const credentials = {
        username: this.usuarioEncontrado.username,
        password: this.form.controls.password.value,
      };
      const url =
        this.urls.backend.url +
        this.urls.backend.port +
        this.urls.backend.rutas.login;

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer miToken');
      headers.append('sec-fetch-mode', 'no-cors'); // Elimina las cabeceras experimentales
      headers.append('sec-fetch-dest', 'empty');
      headers.append('sec-fetch-site', 'same-origin');

      const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(credentials),
      };

      // fetch(url, options)
      //   .then((response: any) => {
      //     if (response.ok) {
      //       // El inicio de sesión fue exitoso, procesa la respuesta o redirige a otra página
      //       const sessionToken = response.token;

      //       // Set sessionToken cookie
      //       document.cookie = `sessionToken=${sessionToken}`;

      //       // Redirect to intranet page
      //       window.location.href = '/access-menu';
      //     } else {
      //       // El inicio de sesión falló, maneja el error
      //       this.loginFailed();
      //       console.log('Ha fallado el login (response):', response);
      //     }
      //   })
      //   .catch((error) => {
      //     // Maneja errores de conexión u otros errores
      //     console.error('Login failed:', error);
      //   });
    }
  }

  private loginFailed() {
    this.loginError = true;
    return this.loginError;
  }

  private loadUserRol(userLogged: any) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/persona';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        const usuarioEncontrado = JSON.parse(data).find((user: { dni: any; }) => user.dni === userLogged.dni);

        console.log('Usuario encontrado:', usuarioEncontrado);
        if (usuarioEncontrado.password === this.form.controls.password.value) {

          this.loginBool = true;
          document.cookie = `idRol=${usuarioEncontrado.idRolNativo}`;
          document.cookie = `sessionToken=${Math.random()}`;

          window.location.href = '/access-menu';
        }


      }).catch((error) => {
        console.error('Error:', error);
      });
  }

  private loadUsername(dni: string) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/persona';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        console.log('Data:', JSON.parse(data));
        console.log('DNI:', dni);
        console.log(typeof dni);
        

        this.usuarioEncontrado = JSON.parse(data).find((user: { dni: string; }) => user.dni === dni);
        document.cookie = `user=${this.usuarioEncontrado.username}`;

        console.log('Usuario encontrado:', this.usuarioEncontrado);
        console.log('Contraseña:', this.usuarioEncontrado.password);

        this.loadUserRol(this.usuarioEncontrado);

      }).catch((error) => {
        console.error('Error:', error);
      });
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
