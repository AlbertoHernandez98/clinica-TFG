import { OnInit, Directive, Input, OnDestroy, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ObtenerErrorFormularioPipe } from '../../pipes/obtener-error-formulario.pipe';

@Directive()
export abstract class AbstractFormCommon implements ControlValueAccessor, OnInit, OnDestroy {
  // Inputs básicos comunes
  @Input() label = '';
  @Input() placeholder = '';
  @Input()
    control!: AbstractControl; // Se pasa así -> [control]="form.get('nombreControl')"

  // Flags básicos que indican al componente cual es su estado
  disabled = false;
  required!: boolean;
  error: string | null | undefined = '';

  value: any; // El valor del formulario
  statusChangesSubs!: Subscription;
  obtenerErrorFormularioPipe = new ObtenerErrorFormularioPipe();

  constructor(protected translateService: TranslateService) { }

  ngOnInit(): void {
    this.escucharControl();
  }

  ngOnDestroy(): void {
    this.dejarEscucharControl();
  }

  escucharControl(): void {
    this.comprobarRequerido();

    this.statusChangesSubs = this.control.statusChanges.subscribe(res => {
      this.comprobarRequerido();
      this.comprobarErrores();
    });
  }

  dejarEscucharControl(): void {
    this.statusChangesSubs?.unsubscribe();
  }

  // Comprueba si el control tiene error, lo obtiene, lo traduce y se lo indica al componente
  comprobarErrores(): void {
    let msgError = '';
    if (this.control.errors && this.control.touched) {
      const msgErrorCode = this.obtenerErrorFormularioPipe.transform(this.control.errors); // Obtener el error del listado de errores
      msgError = this.translateService.instant(`ERRORS_MENSAJE.${msgErrorCode}`); // Traducir el error
    }
    this.error = msgError;
  }

  // Comprueba si el control está configurado como requerido, y se lo indica al componente
  comprobarRequerido(): void {
    this.required = this.control.hasValidator(Validators.required);
  }

  // Funciones para la comunicación con el control ControlValueAccessor
  writeValue(value: any): void { this.value = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean) { this.disabled = disabled; }
  onChange = (v: any) => { };
  onTouched = () => { };
}

// Para ahorrar un poco de código creamos el método que genera el provedor para el valueAccesor
export const generarProviderFormulario = (componente: any) => ({
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => componente),
  multi: true
});
