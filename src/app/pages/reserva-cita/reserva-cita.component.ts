import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-reserva-cita',
  templateUrl: './reserva-cita.component.html',
  styleUrls: ['./reserva-cita.component.scss']
})
export class ReservaCitaComponent implements OnInit {
  
  spinner = false;
  reserva = this.formBuilder.group({})

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
    private formBuilder: FormBuilder,
    private router: Router

  ) {}

  ngOnInit() {
    this.getTranslate();
  }

  formReserva(form: FormGroup) {
    this.reserva = form;
  }

  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.RESERVA_CITA')
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
          name: this.translate.instant('BREADCUMTEXT.RESERVA_CITA'),
          route: '/reserva-cita'
        },
      ],
      isLogged: true,
      idMenuActive: '1'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

  goTo() {
    this.spinner = true;
    setTimeout(() => {
      this.router.navigateByUrl('/servicios');
    }, 1500);
  }

}
