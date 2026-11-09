import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config/config.service';
import { getSessionUser } from 'src/app/shared/classes/session-user';
import { ChangePasswordComponent } from 'src/app/shared/components/popups/change-password/change-password.component';
import { ErrorSuccessComponent } from 'src/app/shared/components/popups/error-success/error-success.component';
import { emailValidator } from 'src/app/shared/validators/custom.validators';
import { VacacionesComponent } from 'src/app/shared/components/popups/vacaciones/vacaciones.component';
import { MisCitasComponent } from 'src/app/shared/components/popups/mis-citas/mis-citas.component';

interface PerfilUsuario {
  idPersona: number;
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: number | null;
  email: string | null;
  idRolNativo: number;
}

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {
  usuarioEncontrado?: PerfilUsuario;
  loading = true;
  loadError = false;
  saving = false;

  form = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    telefono: ['', Validators.pattern(/^\d{1,15}$/)],
    email: ['', [emailValidator(), Validators.maxLength(254)]],
  });

  constructor(
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService,
    private http: HttpClient,
    private configService: ConfigService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const dni = getSessionUser();
    if (!dni) {
      this.loading = false;
      this.loadError = true;
      return;
    }

    this.http.get<PerfilUsuario[]>(this.configService.getApiUrl('/persona')).subscribe({
      next: users => {
        const user = users.find(item => item.dni === dni);
        this.loading = false;
        if (!user) {
          this.loadError = true;
          return;
        }
        this.usuarioEncontrado = user;
        this.form.patchValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          dni: user.dni,
          telefono: user.telefono === null ? '' : String(user.telefono),
          email: user.email || '',
        });
      },
      error: error => {
        console.error('Error al cargar el perfil:', error);
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  changePassword(): void {
    this.matDialog.open(ChangePasswordComponent, {
      data: { title: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.TITLE') },
      width: '560px',
      maxWidth: '95vw'
    });
  }

  openVacaciones(): void {
    if (!this.usuarioEncontrado || this.usuarioEncontrado.idRolNativo !== 2) return;
    this.matDialog.open(VacacionesComponent, {
      data: { idMedico: this.usuarioEncontrado.idPersona, nombre: `${this.usuarioEncontrado.nombre} ${this.usuarioEncontrado.apellidos}` },
      width: '560px', maxWidth: '95vw'
    });
  }

  openMisCitas(): void {
    if (this.usuarioEncontrado?.idRolNativo !== 4) return;
    this.matDialog.open(MisCitasComponent, { width: '600px', maxWidth: '95vw' });
  }

  guardarPerfil(): void {
    if (!this.usuarioEncontrado || this.saving) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const oldDni = this.usuarioEncontrado.dni;
    const payload = {
      oldDni,
      dni: values.dni,
      nombre: values.nombre,
      apellidos: values.apellidos,
      telefono: values.telefono === '' ? null : values.telefono,
      email: values.email.trim() || null,
      idRolNativo: this.usuarioEncontrado.idRolNativo,
    };
    this.saving = true;
    this.http.put(this.configService.getApiUrl('/persona/changeUser'), payload).subscribe({
      next: () => {
        this.saving = false;
        this.usuarioEncontrado = {
          ...this.usuarioEncontrado!,
          dni: values.dni,
          nombre: values.nombre,
          apellidos: values.apellidos,
          telefono: values.telefono === '' ? null : Number(values.telefono),
          email: values.email.trim() || null,
        };
        document.cookie = `user=${encodeURIComponent(values.dni)}; path=/`;
        this.showMessage('PERFIL.GUARDADO');
      },
      error: error => {
        console.error('Error al guardar el perfil:', error);
        this.saving = false;
        this.showMessage('PERFIL.ERROR_GUARDAR');
      }
    });
  }

  redirectToHistorial(): void {
    if (!this.usuarioEncontrado) {
      return;
    }
    this.router.navigate(['/historial', { dato: this.usuarioEncontrado.idPersona }]).then(() => {
      window.location.reload();
    });
  }

  private showMessage(key: string): void {
    this.matDialog.open(ErrorSuccessComponent, {
      data: {
        text: this.translate.instant(key),
        buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
      },
    });
  }
}
