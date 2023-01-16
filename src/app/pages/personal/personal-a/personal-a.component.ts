import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-personal-a',
  templateUrl: './personal-a.component.html',
  styleUrls: ['./personal-a.component.scss']
})
export class PersonalAComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
    private router: Router

  ) {}

  ngOnInit() {
    this.getTranslate();
  }



  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.PERSONAL')
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
          name: this.translate.instant('BREADCUMTEXT.PERSONAL'),
          route: '/personal'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.PERSONAL-A'),
          route: '/personalA'
        },
      ],
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

}
