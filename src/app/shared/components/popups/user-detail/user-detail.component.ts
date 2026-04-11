import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { Route, Router } from '@angular/router';
import { CitasComponent } from '../citas/citas.component';
import { log } from 'console';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  emailValidator,
  documentValidator,
  phoneValidator,
  passwordValidator,
} from '../../../validators/custom.validators';
import { NominatimPlacesService, AddressPrediction } from '../../../../services/nominatim-places.service';

// Interfaz para los roles
export interface Rol {
  idRol: number;
  descripcion: string;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

  roles: Rol[] = []; // Lista de roles con descripción
  idRolInicial: number | undefined;

  user: any;
  form!: FormGroup;

  isHidden!: boolean;
  modifyUser = true;
  
  // Mapeo de descripción de documentos
  documentTypes = [
    { label: 'DNI', type: 'DNI' },
    { label: 'NIE', type: 'NIE' },
    { label: 'Pasaporte', type: 'Pasaporte' }
  ];

  // Google Places Autocomplete
  domicilioControl = new FormControl('');
  predictions: AddressPrediction[] = [];
  filteredPredictions: AddressPrediction[] = [];
  selectedPrediction: AddressPrediction | null = null;
  showPredictions = false;
  isLoadingPredictions = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService,
    public router: Router,
    private nominatimService: NominatimPlacesService
  ) { }

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';

  ngOnInit(): void {
    this.loadRoles();
    this.chargeUser();
    this.setupAddressAutocomplete();
    this.syncDomicilioWithForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Sincroniza domicilioControl con el form.domicilio
   */
  private syncDomicilioWithForm(): void {
    this.domicilioControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (typeof value === 'string') {
          this.form.get('domicilio')?.setValue(value, { emitEvent: false });
        }
      });
  }

  /**
   * Configura el autocomplete de direcciones con Nominatim
   */
  private setupAddressAutocomplete(): void {
    this.domicilioControl.valueChanges
      .pipe(
        debounceTime(400),
        takeUntil(this.destroy$)
      )
      .subscribe((value: any) => {
        if (typeof value === 'string') {
          if (value.length > 2) {
            this.isLoadingPredictions = true;
            this.showPredictions = true;
            this.nominatimService.getPredictions(value)
              .pipe(takeUntil(this.destroy$))
              .subscribe((predictions: AddressPrediction[]) => {
                this.predictions = predictions;
                this.filteredPredictions = predictions;
                this.showPredictions = predictions.length > 0;
                this.isLoadingPredictions = false;
              });
          } else {
            this.filteredPredictions = [];
            this.showPredictions = false;
            this.nominatimService.clearPredictions();
          }
        }
      });
  }

  /**
   * Maneja la selección de una predicción de dirección
   */
  public onSelectPrediction(prediction: AddressPrediction): void {
    this.selectedPrediction = prediction;
    const formattedAddress = this.nominatimService.formatAddress(prediction);
    
    // Actualizar ambos: el control y el formulario
    this.domicilioControl.setValue(formattedAddress, { emitEvent: false });
    this.form.get('domicilio')?.setValue(formattedAddress, { emitEvent: false });
    
    // Marcar como touched para validación
    this.form.get('domicilio')?.markAsTouched();
    
    // Cerrar predicciones
    this.showPredictions = false;
    this.filteredPredictions = [];
  }

  /**
   * Cierra el panel de predicciones
   */
  public closePredictions(): void {
    // Usar setTimeout para permitir que se procese el mousedown del item
    setTimeout(() => {
      this.showPredictions = false;
    }, 100);
  }

  /**
   * Carga los roles desde el backend
   */
  private loadRoles(): void {
    // Cargamos los roles directamente (estos están en la BD)
    this.roles = [
      { idRol: 1, descripcion: 'Admin' },
      { idRol: 2, descripcion: 'Médico' },
      { idRol: 3, descripcion: 'Recepcionista' },
      { idRol: 4, descripcion: 'Cliente' }
    ];
    
    // Alternativa: Si tienes un endpoint para roles, descomenta:
    // this.getDatosService.getRoles().subscribe(
    //   (roles) => {
    //     this.roles = roles;
    //   },
    //   (error) => {
    //     console.error('Error al cargar roles:', error);
    //   }
    // );
  }

  /**
   * Obtiene la descripción del rol
   */
  public getRoleDescription(idRol: number): string {
    const role = this.roles.find(r => r.idRol === idRol);
    return role ? `${role.idRol} - ${role.descripcion}` : `${idRol}`;
  }

  private chargeUser() {
    this.user = this.data.selectedUser;

    if (this.user) {
      // Inicializar domicilioControl con el valor actual
      this.domicilioControl.setValue(this.user.domicilio || '');

      this.form = this.formBuilder.group({
        password: [this.user.contraseña || '', [Validators.required, passwordValidator()]],
        idRolNativo: [this.user.idRolNativo, Validators.required],
        dni: [this.user.dni, [Validators.required, documentValidator()]],
        telefono: [this.user.telefono, [Validators.required, phoneValidator()]],
        domicilio: [this.user.domicilio || '', Validators.required],
        email: [this.user.email || '', [Validators.required, emailValidator()]],
        nombre: [this.user.nombre || '', Validators.required],
        apellidos: [this.user.apellidos || '', Validators.required]
      });
    } else {
      this.modifyUser = false;
      this.domicilioControl.setValue('');

      this.form = this.formBuilder.group({
        password: ['', [Validators.required, passwordValidator()]],
        idRolNativo: [null, Validators.required],
        dni: ['', [Validators.required, documentValidator()]],
        telefono: ['', [Validators.required, phoneValidator()]],
        domicilio: ['', Validators.required],
        email: ['', [Validators.required, emailValidator()]],
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required]
      });
    }
  }

  public getTouchedAndError(key: string): boolean {
    const control = this.form?.get(key);
    return !!(control?.touched && control?.invalid);
  }

  /**
   * Filtra solo números en el input de teléfono
   */
  public onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.form.get('telefono')?.setValue(input.value, { emitEvent: false });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  public getErrorMessage(key: string): string {
    const control = this.form?.get(key);
    if (!control || !control.errors) {
      return '';
    }

    // Errores específicos por campo
    switch(key) {
      case 'nombre':
        return 'El nombre es requerido';
      
      case 'apellidos':
        return 'Los apellidos son requeridos';
      
      case 'dni':
        if (control.errors['required']) {
          return 'El documento es requerido';
        }
        if (control.errors['invalidDocument']) {
          return 'Formato inválido: DNI (12345678A), NIE (X1234567A) o Pasaporte (ABC123456)';
        }
        break;
      
      case 'password':
        if (control.errors['required']) {
          return 'La contraseña es requerida';
        }
        if (control.errors['invalidPassword']) {
          return 'Mínimo 6 caracteres: 1 mayúscula, 1 minúscula, 1 número';
        }
        break;
      
      case 'email':
        if (control.errors['required']) {
          return 'El email es requerido';
        }
        if (control.errors['invalidEmail']) {
          return 'Email inválido: usuario@dominio.ext';
        }
        break;
      
      case 'telefono':
        if (control.errors['required']) {
          return 'El teléfono es requerido';
        }
        if (control.errors['invalidPhone']) {
          return 'Teléfono inválido: solo números (9-15 dígitos)';
        }
        break;
      
      case 'domicilio':
        return 'La dirección es requerida';
      
      case 'idRolNativo':
        return 'Debe seleccionar un rol';
      
      default:
        return 'Campo inválido';
    }

    return 'Hay un error en este campo';
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const credentials = {
      dni: this.form.controls.dni.value,
      contraseña: this.form.controls.password.value,
      idRolNativo: this.form.controls.idRolNativo.value,
      nombre: this.form.controls.nombre.value,
      apellidos: this.form.controls.apellidos.value,
      telefono: this.form.controls.telefono.value,
      domicilio: this.form.controls.domicilio.value,
      email: this.form.controls.email.value
    };

    const url = 'http://localhost:3000/persona/changeUser';

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
      .catch((error) => {
        const dialog = this.matDialog.open(ErrorSuccessComponent, {
          data: {
            text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
            buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
          },
        });
        console.error('Error:', error);
      });
    this.close();
  }

  public onDelete() {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = `http://localhost:3000/persona/${this.user.idPersona}`;
    console.log(url);

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      });
    this.close();
  }

  public onCreate() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const credentials = {
      dni: this.form.controls.dni.value,
      contraseña: this.form.controls.password.value,
      idRolNativo: this.form.controls.idRolNativo.value,
      nombre: this.form.controls.nombre.value,
      apellidos: this.form.controls.apellidos.value,
      telefono: this.form.controls.telefono.value,
      domicilio: this.form.controls.domicilio.value,
      email: this.form.controls.email.value
    };

    const url = 'http://localhost:3000/persona';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          const dialog = this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
      .catch((error) => {
        const dialog = this.matDialog.open(ErrorSuccessComponent, {
          data: {
            text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
            buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
          },
        });
        console.error('Error:', error);
      });
    this.close();
  }

  public close() {
    this.dialogRef.close();
  }

  public openHistorial(user: any) {
    this.router.navigate(['/historial', { dato: user.idPersona }]).then(() => {
      window.location.reload();
    });;
    this.dialogRef.close();
  }

  public openCita(user: any) {
    const dialog = this.matDialog.open(CitasComponent, {
      data: { selectedUser: user },
      width: '500px'
    });
  }

  /**
   * Marca todos los elementos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
