import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-clinica',
  templateUrl: './clinica.component.html',
  styleUrls: ['./clinica.component.scss']
})
export class ClinicaComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
  ) { }

  ngOnInit(): void {
    this.getTranslate();
  }

  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.CLINICA')
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
          name: this.translate.instant('BREADCUMTEXT.CLINICA'),
          route: '/clinica'
        },
      ],
      isLogged: true,
      idMenuActive: '1'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

}
