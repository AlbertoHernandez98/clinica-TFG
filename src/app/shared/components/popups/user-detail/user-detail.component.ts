import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config/config.service';
import { Persona } from '../../../models/persona.interface';
import { documentValidator, emailValidator, phoneValidator, passwordValidator } from '../../../validators/custom.validators';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { CitasComponent } from '../citas/citas.component';

interface UserDetailData {
  selectedUser?: Persona;
  patientOnly?: boolean;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  readonly roles = [
    { idRol: 1, descripcion: 'Admin' },
    { idRol: 2, descripcion: 'Médico' },
    { idRol: 3, descripcion: 'Recepcionista' },
    { idRol: 4, descripcion: 'Cliente' }
  ];
  user?: Persona;
  form!: FormGroup;
  isHidden = false;
  modifyUser = false;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailData,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    public router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.user = this.data.selectedUser;
    this.modifyUser = !!this.user;
    const validateDocument = documentValidator();
    this.form = this.formBuilder.group({
      password: ['', this.modifyUser ? [passwordValidator(), Validators.maxLength(45)] : [Validators.required, passwordValidator(), Validators.maxLength(45)]],
      idRolNativo: [this.data.patientOnly ? 4 : this.user?.idRolNativo ?? null, Validators.required],
      dni: [this.user?.dni || '', [Validators.required, (control: AbstractControl) =>
        control.value === this.user?.dni ? null : validateDocument(control)]],
      telefono: [this.user?.telefono === null || this.user?.telefono === undefined ? '' : String(this.user.telefono),
        [Validators.required, phoneValidator()]],
      email: [this.user?.email || '', this.modifyUser ?
        [emailValidator(), Validators.maxLength(254)] :
        [Validators.required, emailValidator(), Validators.maxLength(254)]],
      nombre: [this.user?.nombre || '', [Validators.required, Validators.maxLength(32)]],
      apellidos: [this.user?.apellidos || '', [Validators.required, Validators.maxLength(45)]]
    });
  }

  getTouchedAndError(key: string): boolean {
    const control = this.form.get(key);
    return !!(control?.touched && control.invalid);
  }

  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.form.get('telefono')?.setValue(input.value, { emitEvent: false });
  }

  getErrorMessage(key: string): string {
    const control = this.form.get(key);
    if (!control?.errors) {
      return '';
    }
    if (control.errors.required) {
      return 'Campo obligatorio';
    }
    if (control.errors.maxlength) {
      return `Máximo ${control.errors.maxlength.requiredLength} caracteres`;
    }
    if (control.errors.invalidDocument) {
      return 'Formato inválido: DNI, NIE o pasaporte';
    }
    if (control.errors.invalidPhone) {
      return 'Teléfono inválido: solo números (9-15 dígitos)';
    }
    if (control.errors.invalidPassword) {
      return 'Mínimo 4 caracteres';
    }
    if (control.errors.invalidEmail) {
      return 'Introduce un correo electrónico válido';
    }
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (!this.user || this.saving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.value;
    const payload = {
      oldDni: this.user.dni,
      dni: values.dni,
      nombre: values.nombre,
      apellidos: values.apellidos,
      telefono: values.telefono,
      email: values.email.trim() || null,
      idRolNativo: Number(values.idRolNativo),
      ...(values.password ? { password: values.password } : {})
    };
    this.saving = true;
    this.http.put(this.configService.getApiUrl('/persona/changeUser'), payload).subscribe({
      next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.GUARDADO'),
      error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_GUARDAR', error)
    });
  }

  onCreate(): void {
    if (this.saving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.value;
    this.saving = true;
    this.http.post(this.configService.getApiUrl('/persona'), {
      dni: values.dni,
      password: values.password,
      nombre: values.nombre,
      apellidos: values.apellidos,
      telefono: values.telefono,
      email: values.email.trim(),
      idRolNativo: this.data.patientOnly ? 4 : Number(values.idRolNativo)
    }).subscribe({
      next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.GUARDADO'),
      error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_GUARDAR', error)
    });
  }

  onDelete(): void {
    if (!this.user || this.saving) {
      return;
    }
    this.saving = true;
    this.http.delete(this.configService.getApiUrl(`/persona/${this.user.idPersona}`)).subscribe({
      next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.ELIMINADO'),
      error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_ELIMINAR', error)
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openHistorial(user: Persona): void {
    this.router.navigate(['/historial', { dato: user.idPersona }]).then(() => window.location.reload());
    this.dialogRef.close();
  }

  openCita(user: Persona): void {
    this.matDialog.open(CitasComponent, { data: { selectedUser: user }, width: '500px' });
  }

  private finish(message: string): void {
    this.saving = false;
    this.showMessage(message);
    this.dialogRef.close(true);
  }

  private fail(message: string, error: unknown): void {
    this.saving = false;
    console.error('Error al administrar el usuario:', error);
    this.showMessage(message);
  }

  private showMessage(key: string): void {
    this.matDialog.open(ErrorSuccessComponent, {
      data: {
        text: this.translate.instant(key),
        buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL')
      }
    });
  }
}
