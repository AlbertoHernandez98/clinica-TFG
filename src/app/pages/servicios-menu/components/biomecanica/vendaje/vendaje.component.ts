import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-vendaje',
  templateUrl: './vendaje.component.html',
  styleUrls: ['./vendaje.component.scss']
})
export class VendajeComponent implements OnInit {


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
          active: true,
          name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
          route: '/serviciosMenu'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.VENDAJE'),
          route: '/vendaje'
        },
      ],
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

}
