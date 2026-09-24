import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config/config.service';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  @Output() formEvent: EventEmitter<FormGroup> = new EventEmitter();



  servicios: any;
  servicioSeleccionado: any;
  radioSelected: any;

  form = this.fb.group({
  });

  constructor(
    public router: Router,
    public loadingCtrl: LoadingController,
    private appService: AppStateService,
    public translate: TranslateService,
    private fb: FormBuilder,
    private http: HttpClient,
    private configService: ConfigService
  ) {


  }

  ngOnInit() {
    this.getListOfServices();
    this.getTranslate();
  }

  radioFun() {
    console.log(this.radioSelected);
  }

  getServicio(){
    return this.radioSelected;
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
          active: false,
          name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
          route: '/servicios'
        },
      ],
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }



  getListOfServices() {
    const url = 'assets/reportes.json';
    
    this.http.get<any>(url).subscribe(
      (data) => {
        this.servicios = data;
        console.log(this.servicios);
      },
      (error) => {
        console.error('Error loading services:', error);
      }
    );
  }



  goTo() {
    this.router.navigate(['/disponibilidad']);
  }
}
