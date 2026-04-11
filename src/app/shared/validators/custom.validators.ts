import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para Email con formato XXX@XXX.XXX
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  };
}

/**
 * Validador para DNI/NIE/Pasaporte
 * DNI: 8 dígitos + 1 letra (12345678A)
 * NIE: X/Y/Z + 7 dígitos + 1 letra (X1234567A)
 * Pasaporte: 3 caracteres + 6 dígitos (ABC123456)
 */
export function documentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const value = control.value.toUpperCase().trim();
    
    // Patrón DNI: 8 dígitos + 1 letra
    const dniPattern = /^\d{8}[A-Z]$/;
    // Patrón NIE: X/Y/Z + 7 dígitos + 1 letra
    const niePattern = /^[XYZ]\d{7}[A-Z]$/;
    // Patrón Pasaporte: 3 letras + 6 dígitos
    const passportPattern = /^[A-Z]{3}\d{6}$/;
    
    if (dniPattern.test(value) || niePattern.test(value) || passportPattern.test(value)) {
      return null;
    }
    
    return { invalidDocument: true };
  };
}

/**
 * Validador para teléfono (solo números, 9 dígitos)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const phonePattern = /^\d{9,15}$/;
    
    return phonePattern.test(control.value) ? null : { invalidPhone: true };
  };
}

/**
 * Validador para contraseña (mínimo 6 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número)
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLengthValid = value.length >= 6;
    
    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && isLengthValid;
    
    return passwordValid ? null : { invalidPassword: true };
  };
}
