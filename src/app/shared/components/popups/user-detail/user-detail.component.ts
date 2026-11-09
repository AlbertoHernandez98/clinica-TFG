import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { UserChangesService } from '../../../../services/users/user-changes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';

interface UserDetailData {
  selectedUser?: Persona;
  staff: { idPersona: number; idRolNativo: number };
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
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
  private readonly destroyed = new Subject<void>();

  get availableRoles(): typeof this.roles {
    if (this.data.staff.idRolNativo === 2) return this.roles.filter(role => role.idRol === 4);
    if (this.data.staff.idRolNativo === 3) return this.roles.filter(role => [2, 4].includes(role.idRol));
    return this.roles;
  }

  get ownUser(): boolean {
    return !!this.user && this.data.staff.idPersona === this.user.idPersona;
  }

  get canDelete(): boolean {
    return this.data.staff.idRolNativo === 1 ||
      (this.data.staff.idRolNativo === 3 && !!this.user && [2, 4].includes(this.user.idRolNativo));
  }

  constructor(
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailData,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    public router: Router,
    private configService: ConfigService,
    private userChanges: UserChangesService,
    private confirmAction: ConfirmActionService
  ) {}

  ngOnInit(): void {
    this.user = this.data.selectedUser;
    this.modifyUser = !!this.user;
    const validateDocument = documentValidator();
    this.form = this.formBuilder.group({
      password: ['', this.modifyUser ? [passwordValidator(), Validators.maxLength(45)] : [Validators.required, passwordValidator(), Validators.maxLength(45)]],
      idRolNativo: [!this.user && this.data.staff.idRolNativo === 2 ? 4 : this.user?.idRolNativo ?? null, Validators.required],
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
      ...(values.password && (!this.ownUser || this.data.staff.idRolNativo === 1) ? { password: values.password } : {})
    };
    this.saving = true;
    const save = () => this.http.put(this.configService.getApiUrl('/persona/changeUser'), payload).subscribe({
      next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.GUARDADO'),
      error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_GUARDAR', error)
    });
    if (payload.password) {
      this.confirmAction.confirm({
        title: 'CONFIRM_ACTION.CHANGE_PASSWORD_TITLE',
        message: 'CONFIRM_ACTION.CHANGE_USER_PASSWORD',
        params: { user: `${this.user.nombre} ${this.user.apellidos}` }
      }).pipe(takeUntil(this.destroyed)).subscribe(confirmed => {
        if (confirmed) save();
        else this.saving = false;
      });
    } else save();
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
      idRolNativo: this.data.staff.idRolNativo === 2 ? 4 : Number(values.idRolNativo)
    }).subscribe({
      next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.GUARDADO'),
      error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_GUARDAR', error)
    });
  }

  onDelete(): void {
    if (!this.user || this.saving || !this.canDelete) {
      return;
    }
    this.saving = true;
    const user = this.user;
    this.confirmAction.confirm({
      title: 'CONFIRM_ACTION.DELETE_USER_TITLE',
      message: 'CONFIRM_ACTION.DELETE_USER',
      params: { user: `${user.nombre} ${user.apellidos}` }
    }).pipe(takeUntil(this.destroyed)).subscribe(confirmed => {
      if (!confirmed) { this.saving = false; return; }
      this.http.delete(this.configService.getApiUrl(`/persona/${user.idPersona}`)).subscribe({
        next: () => this.finish('SHARED.POPUPS.ADMIN_USERS.ELIMINADO'),
        error: error => this.fail('SHARED.POPUPS.ADMIN_USERS.ERROR_ELIMINAR', error)
      });
    });
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }

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
    this.userChanges.notify();
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
