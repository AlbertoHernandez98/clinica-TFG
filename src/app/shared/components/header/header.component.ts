import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'src/app/services/lang/lang';
import { AdminUsersComponent } from '../popups/admin-users/admin-users.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private translate: TranslateService,
    private languageService: LangService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.logFunctions();
    this.idioma = this.languageService.getCurrentLanguage().toLowerCase();
  }

  logFunctions() {
    if (document.cookie) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    const str = document.cookie;

    const match: any = str.match(/idRol=(.*?);/);
    
    if (match) {
      const idRolValue = match[1].trim();

      if(idRolValue == 1) {
        this.isAdmin = true;
      }
    } else {
      this.isAdmin = false;
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


  public logout(): void {
    // Delete sessionToken cookie
    document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
      this.eraseCookie(cookies[i].split("=")[0]);
    // Seteo la variable isLogged
    this.isLogged = false;
    // Redirect to login page
    window.location.href = '/access-menu';
  }

  private eraseCookie(name: any) {
    this.createCookie(name,"",-1);
  }

  private createCookie(name: string,value: string,days: number) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  public useLanguage(language: string) {
    const lang = language.toLowerCase();
    this.idioma = lang;
    this.languageService.setLanguage(lang);
    this.translate.use(lang);
  }
}
