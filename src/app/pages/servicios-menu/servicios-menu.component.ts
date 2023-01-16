import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-servicios-menu',
  templateUrl: './servicios-menu.component.html',
  styleUrls: ['./servicios-menu.component.scss']
})
export class ServiciosMenuComponent implements OnInit {

  quiroBool= false;
  bioBool= false;
  ungBool= false;
  oseaBool= false;
  pieBool= false;
  infBool= false;
  gerBool= false;
  domBool= false;

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
  ) { }

  ngOnInit() {
    this.getTranslate();
  }



  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.SERVICIOS')
      .subscribe((res) => {
        this.initRoutes();
      });
  }

  initRoutes() {
    const appInfo: AppInfo = {
      breadcum: [
        {
          active: true,
          name: this.translate.instant('BREADCUMTEXT.MENU'),
          route: '/access-menu'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
          route: '/serviciosMenu'
        },
      ],
      isLogged: true,
      idMenuActive: '1'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

  quiro() {
    this.quiroBool = true;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= false;
  }

  bio() {
    this.quiroBool = false;
    this.bioBool= true;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= false;
  }
  
  ung() {
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= true;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= false;
  }

  osea() {
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= true;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= false;
  }

  pie() {
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= true;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= false;
  }

  inf() {
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= true;
    this.gerBool= false;
    this.domBool= false;
  }

  ger(){
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= true;
    this.domBool= false;
  }

  serv() {
    this.quiroBool = false;
    this.bioBool= false;
    this.ungBool= false;
    this.oseaBool= false;
    this.pieBool= false;
    this.infBool= false;
    this.gerBool= false;
    this.domBool= true;
  }

}


