import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'src/app/services/lang/lang';
import { AdminUsersComponent } from '../popups/admin-users/admin-users.component';
import { MatDialog } from '@angular/material/dialog';
import { AgendaMedicoComponent } from '../popups/agenda-medico/agenda-medico.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuditoriaHistorialComponent } from '../popups/auditoria-historial/auditoria-historial.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() login = false;

  idioma: string = 'es';
  isLogged = false;
  isAdmin = false;
  isDoctor = false;
  isReceptionist = false;

  constructor(
    private translate: TranslateService,
    private languageService: LangService,
    private matDialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logFunctions();
    this.idioma = this.languageService.getCurrentLanguage().toLowerCase();
  }

  logFunctions() {
    if (this.auth.getAccessToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    const str = document.cookie;

    const match = str.match(/(?:^|;\s*)idRol=([^;]*)/);
    
    if (match) {
      const idRolValue = match[1].trim();

      this.isAdmin = this.isLogged && idRolValue === '1';
      this.isDoctor = this.isLogged && idRolValue === '2';
      this.isReceptionist = this.isLogged && idRolValue === '3';
    } else {
      this.isAdmin = false;
      this.isDoctor = false;
      this.isReceptionist = false;
    }
  }


  public redirectToProfile() {
    window.location.href = '/perfil';
  }

  public redirectToAdmin() {
    const dialog = this.matDialog.open(AdminUsersComponent, {
      data: {
      },
      width: '940px',
    });
  }

  public openPatientAppointments(): void {
    this.matDialog.open(AdminUsersComponent, {
      data: { patientAppointments: true },
      width: '600px',
      maxWidth: '95vw'
    });
  }

  public openAgenda(): void {
    this.matDialog.open(AgendaMedicoComponent, { width: '1200px', maxWidth: '98vw', maxHeight: '95vh' });
  }

  public openAudit(): void {
    this.matDialog.open(AuditoriaHistorialComponent, { width: '1100px', maxWidth: '95vw', maxHeight: '90vh' });
  }

  public logout(): void {
    this.auth.logout().subscribe({
      next: () => { window.location.href = '/access-menu'; },
      error: error => { console.error('Error al cerrar sesión:', error); alert(this.translate.instant('LOGIN.LOGOUT_ERROR')); }
    });
  }

  public useLanguage(language: string) {
    const lang = language.toLowerCase();
    this.idioma = lang;
    this.languageService.setLanguage(lang);
    this.translate.use(lang);
  }
}
