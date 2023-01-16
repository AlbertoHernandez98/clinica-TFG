import { Component } from '@angular/core';

@Component({
  selector: 'app-access-menu',
  templateUrl: './access-menu.component.html',
  styleUrls: ['./access-menu.component.scss']
})
export class AccessMenuComponent {
  clinicaLogo = '../../../../assets/icons/logo_clinica.png';
  identitiesIcon = '../../../assets/icons/svg/identities.svg';
  productsIcon = '../../../assets/icons/svg/products.svg';
  applicationsIcon = '../../../assets/icons/svg/applications.svg';

  constructor() {}
}
