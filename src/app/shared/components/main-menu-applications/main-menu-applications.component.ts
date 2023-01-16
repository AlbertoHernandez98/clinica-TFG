import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';

@Component({
  selector: 'app-main-menu-applications',
  templateUrl: './main-menu-applications.component.html',
  styleUrls: ['./main-menu-applications.component.scss']
})
export class MainMenuApplicationsComponent implements OnInit {
  @Input() idMenu = '';
  toggleClass = false;
  arrayOfElements: any = [];
  oneMore = {};

  constructor(
    private appService: AppStateService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTranslations();
  }

  getMenuChild() {
    //aqui deberemos setear los child
    const child = this.appService.getState('menuChild');
    let array = [];
    if (child) {
      array = [...child];
      array.push(this.oneMore);
      this.arrayOfElements[3].childs = [...array];
    }
    this.appService.getMenuchild().subscribe((res) => {
      array = [...res];
      // array.push(this.oneMore);
      this.arrayOfElements[3].childs = [...array];
    });
  }

  getTranslations() {
    this.appService.traduccionesLoaded('BREADCUMTEXT.MENU').subscribe((res) => {
      this.getTextMenu();
      this.getMenuChild();
    });
  }

  navTo(url: string) {
    this.router.navigateByUrl(url);
  }

  navToChild(id:any) {
    const route = '/products/solicitud-de-asistencia/' + id;
    this.activateRoute(id);
    this.router.navigateByUrl(route);
  }

  activateRoute(id: any) {
    const index = this.arrayOfElements[3].childs.findIndex(
      (ele:any) => ele.id === id
    );
    if (index !== -1) {
      this.resetActiveChild();
      this.arrayOfElements[3].childs[index].active = true;
    }
  }

  resetActiveChild() {
    this.arrayOfElements[3].childs.forEach((element:any) => {
      element.active = false;
    });
  }

  getTextMenu() {
    this.oneMore = {
      id: '',
      icon: '#icon-plus-red',
      label: this.translate.instant('MAIN_MENU.ADD'),
      url: '/products/solicitud-de-asistencia-nueva-linea',
      active: false
    };
    this.arrayOfElements = [
      {
        id: '0',
        icon: '#error',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.ERROR'),
        disabled: false,
        url: '/applications/errores',
        active: false
      },
      {
        id: '1',
        icon: '#carga-y-acceso-a-la-pwa',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.LOAD_ACCESS_PWA'),
        url: '/applications/carga-acceso-pwa',
        active: true
      },
      {
        id: '2',
        icon: '#identificacion-de-usuario',
        label: this.translate.instant(
          'MAIN_MENU_APPLICATIONS.USER_IDENTIFICATION'
        ),
        url: '/applications/identificar-usuario',
        active: false
      },
      {
        id: '3',
        icon: '#menu-en-linea',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.LINE_MENU'),
        url: '/applications/menu-de-la-linea',
        active: false
      },
      {
        id: '4',
        icon: '#solicitud-de-asistencia',
        label: this.translate.instant(
          'MAIN_MENU_APPLICATIONS.ASSISTANCE_REQUEST'
        ),
        childs: [],
        url: '/applications/solicitud-de-asistencia',
        active: false
      },
      // {
      //   id: '4',
      //   icon: '#solicitud-de-reembolso',
      //   label: this.translate.instant('MAIN_MENU.SOLICITUD_REEMBOLSO'),
      //   url: '',
      //   active: false
      // },
      {
        id: '5',
        icon: '#origen',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.ORIGIN'),
        url: '/applications/origen',
        active: false
      },
      {
        id: '6',
        icon: '#destino',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.DESTINATION'),
        url: '/applications/destino',
        active: false
      },
      {
        id: '7',
        icon: '#seguimiento',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.FOLLOW_UP'),
        disabled: true,
        url: '',
        active: false
      },
      {
        id: '8',
        icon: '#historico',
        label: this.translate.instant('MAIN_MENU_APPLICATIONS.HISTORY'),
        disabled: true,
        url: '',
        active: false
      }
      // {
      //   id: '9',
      //   icon: '#traduccion',
      //   label: this.translate.instant('MAIN_MENU.TRADUCCION'),
      //   disabled: false,
      //   url: '/products/traductor',
      //   active: false
      // }
    ];
  }

  getUrlActive() {}
}
