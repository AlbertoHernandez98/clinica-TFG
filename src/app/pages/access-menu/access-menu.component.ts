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
  constructor(route: ActivatedRoute) {
  }

  ngOnInit() {}
}
