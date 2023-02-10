import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-espolon',
  templateUrl: './espolon.component.html',
  styleUrls: ['./espolon.component.scss']
})
export class EspolonComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
    private router: Router

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
          name: this.translate.instant('BREADCUMTEXT.ESPOLON'),
          route: '/espolon'
        },
      ],
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }
  
  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }

}
