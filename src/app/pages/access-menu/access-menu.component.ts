import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  constructor(route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  logout(): void {
    // Delete sessionToken cookie
    document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to login page
    window.location.href = '/login';
  }
}
