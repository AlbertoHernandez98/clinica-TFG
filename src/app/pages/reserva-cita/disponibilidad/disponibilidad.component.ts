import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.scss']
})
export class DisponibilidadComponent implements OnInit {

  constructor(
    public router: Router,
    public loadingCtrl: LoadingController,
    private appService: AppStateService,
    public translate: TranslateService
  ) {

    
  }

  ngOnInit() {
      this.getTranslate();
  }


  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.PRODUCTOS')
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
          name: this.translate.instant('BREADCUMTEXT.RESERVA_CITA'),
          route: '/reserva-cita'
        },
        {
          active: true,
          name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
          route: '/servicios'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.DISPONIBILIDAD'),
          route: '/servicios'
        }
      ],
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

}
