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
  }

  private loginFailed() {
    this.loginError = true;
    return this.loginError;
  }

  private loadUserRol(userLogged: any) {
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
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:3000/persona';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        console.log('Data:', parsedData);
        console.log('DNI:', dni);
        console.log(typeof dni);
        
        // Maneja tanto arrays como objetos únicos
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        this.usuarioEncontrado = dataArray.find((user: { dni: string; }) => user.dni === dni);
        
        if (this.usuarioEncontrado) {
          document.cookie = `user=${this.usuarioEncontrado.dni}`;
          document.cookie = `nombre=${this.usuarioEncontrado.nombre}`;

          console.log('Usuario encontrado:', this.usuarioEncontrado);
          console.log('Contraseña:', this.usuarioEncontrado.password);

          // Verificar contraseña y proceder con login
          this.loadUserRol(this.usuarioEncontrado);
        } else {
          this.loginFailed();
          console.error('Usuario no encontrado con DNI:', dni);
        }

      }).catch((error) => {
        console.error('Error:', error);
        this.loginFailed();
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
