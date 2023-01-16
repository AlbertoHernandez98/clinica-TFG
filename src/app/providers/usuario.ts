import { Injectable } from '@angular/core';


@Injectable()
export class Usuario {

    nombre: string | undefined;
    apellidos: string | undefined;
    telefono: string | undefined;
    email: string | undefined;
    direccion: string | undefined;
    ciudad: string | undefined;
    pais: string | undefined;
    clientCode: string | undefined;

    constructor() {
    }

}