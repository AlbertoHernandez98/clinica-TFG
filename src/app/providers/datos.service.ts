import { Usuario } from "../providers/usuario";
import { Injectable } from "@angular/core";

@Injectable()
export class DatosProvider {
  personalizacion: any;
  emailRexp = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/i;

  digitalData = {
    screenName: "",
    section: "",
    subsection: "",
    section1: "",
    section2: "",
    section3: "",
    language: "",
    environment: "",
    userStatus: "",
    userDevice: "",
    screenSize: "",
    deviceOSVersion: "",
    deviceOS: "",
    appVersion: "",
    tipoApp: "PWA",
    pais: "",
    entidad: "",
  };

  private storage = window.localStorage;

  constructor(
    private usuario: Usuario
  ) {
  }

  setUsuario(usuario: any) {
    if (usuario.controls) {
      this.usuario.nombre = usuario.controls.nombre.value;
      this.usuario.apellidos = usuario.controls.apellidos.value;
      this.usuario.telefono = usuario.controls.telefono.value;
      if (usuario.controls.email.value) {
        if (this.emailValida(usuario.controls.email.value))
          this.usuario.email = usuario.controls.email.value;
        else this.usuario.email = "";
      }
      this.storage.setItem("user", JSON.stringify(this.usuario));
    } else this.storage.setItem("user", JSON.stringify(usuario));
  }

  /*Validacion mail */
  emailValida(email: any) {
    let expReg = this.emailRexp;

    if (expReg.test(email)) {
      return { emailValida: true };
    } else {
      return null;
    }
  }

  getUsuario() {
    if (this.storage.getItem("user") != undefined) {
    //   this.usuario = JSON.parse(this.storage.getItem("user"));
      return this.usuario;
    } else return this.usuario;
  }


  removeData() {
    this.usuario = new Usuario();
  }
}
