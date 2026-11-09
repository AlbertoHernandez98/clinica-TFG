export interface Persona {
  idPersona: number;
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: number | null;
  email: string | null;
  idRolNativo: number;
  fotoPerfil: string | null;
}
