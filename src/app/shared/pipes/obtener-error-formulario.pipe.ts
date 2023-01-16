import { ValidationErrors } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { MAPA_ERRORES_VALIDACION } from '../constants/mapa-errores-validacion';

@Pipe({
  name: 'obtenerErrorFormulario'
})
export class ObtenerErrorFormularioPipe implements PipeTransform {

  transform(errores: ValidationErrors | undefined | null): string {
    let errorCode = '';

    if (errores) {
      const arrayErrores = Object.keys(errores);
      errorCode = MAPA_ERRORES_VALIDACION[arrayErrores[0]];// Devuelve el código del primer error encontrado
    }
    return errorCode;
  }

}
