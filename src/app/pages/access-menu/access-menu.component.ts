import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-access-menu',
  templateUrl: './access-menu.component.html',
  styleUrls: ['./access-menu.component.scss']
})
export class AccessMenuComponent implements OnInit{
  clinicaLogo = '../../../../assets/icons/logo_clinica.png';
  identitiesIcon = '../../../assets/icons/svg/identities.svg';
  productsIcon = '../../../assets/icons/svg/products.svg';
  applicationsIcon = '../../../assets/icons/svg/applications.svg';
  access: any;

  isLogged: boolean = false;
  constructor(route: ActivatedRoute, private auth: AuthService, private translate: TranslateService) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => { window.location.href = '/login'; },
      error: error => { console.error('Error al cerrar sesión:', error); alert(this.translate.instant('LOGIN.LOGOUT_ERROR')); }
    });
  }
}
