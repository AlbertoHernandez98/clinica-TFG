import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Input() idMenu = '';
  // TO-DO: he puesto esta manera de mostrar/ocultar los elementos menú
  // con dropdown. Habría que buscar otra manera para poder ser realista
  // y tener más de un elemento como dropdown
  toggleClass = false;
  arrayOfElements: any = [];
  oneMore = {};

  constructor(
    private appService: AppStateService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTranslations();
  }

  tooltipOptionSelect(option: string, id: string) {
    // this.tooltipOptionService.setTooltipOption(option);
    this.router.navigate([
      `/products/solicitud-de-asistencia/${id}`,
      { data: option }
    ]);
    //TODO: Refresh components
  }

  getMenuChild() {
    //aquí deberemos setear los child
    const child = this.appService.getState('menuChild');
    let array = [];
    if (child) {
      array = [...child];
      array.push(this.oneMore);
      this.arrayOfElements[4].childs = [...array];
    }
    this.appService.getMenuchild().subscribe((res) => {
      array = [...res];
      // array.push(this.oneMore);
      this.arrayOfElements[4].childs = [...array];
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
    const index = this.arrayOfElements[4].childs.findIndex(
      (ele: any) => ele.id === id
    );
    if (index !== -1) {
      this.resetActiveChild();
      this.arrayOfElements[4].childs[index].active = true;
    }
  }

  resetActiveChild() {
    this.arrayOfElements[4].childs.forEach((element: any) => {
      element.active = false;
    });
  }

  getTextMenu() {
    this.oneMore = {
      id: '',
      icon: '#icon-plus-red',
      label: this.translate.instant('MAIN_MENU.ADD'),
      url: '/products/solicitud-de-asistencia/nueva-linea',
      active: false
    };
    this.arrayOfElements = [
      {
        id: '0',
        icon: '#error',
        label: this.translate.instant('MAIN_MENU.ERROR'),
        disabled: false,
        url: '/products/errores',
        active: false
      },
      {
        id: '1',
        icon: '#carga-y-acceso-a-la-pwa',
        label: this.translate.instant('MAIN_MENU.ACCESO_PWA'),
        url: '/products/carga-acceso-pwa',
        active: true
      },
      {
        id: '2',
        icon: '#identificacion-de-usuario',
        label: this.translate.instant('MAIN_MENU.IDENTIFICACION_USUARIO'),
        url: '/products/identificar-usuario',
        active: false
      },
      {
        id: '3',
        icon: '#menu-en-linea',
        label: this.translate.instant('MAIN_MENU.MENU_LINEA'),
        url: '/products/menu-de-la-linea',
        active: false
      },
      {
        id: '4',
        icon: '#solicitud-de-asistencia',
        label: this.translate.instant('MAIN_MENU.SOLICITUD_ASISTENCIA'),
        childs: [...[this.oneMore]],
        url: '/products/solicitud-de-asistencia',
        active: false
      },
      {
        id: '5',
        icon: '#solicitud-de-reembolso',
        label: this.translate.instant('MAIN_MENU.SOLICITUD_REEMBOLSO'),
        url: '',
        active: false
      },
      {
        id: '6',
        icon: '#origen',
        label: this.translate.instant('MAIN_MENU.ORIGEN'),
        url: '/products/origen',
        active: false
      },
      {
        id: '7',
        icon: '#destino',
        label: this.translate.instant('MAIN_MENU.DESTINO'),
        url: '/products/destino',
        active: false
      },
      {
        id: '8',
        icon: '#seguimiento',
        label: this.translate.instant('MAIN_MENU.SEGUIMIENTO'),
        disabled: true,
        url: '',
        active: false
      },
      {
        id: '9',
        icon: '#historico',
        label: this.translate.instant('MAIN_MENU.HISTORICO'),
        disabled: true,
        url: '',
        active: false
      },
      {
        id: '10',
        icon: '#traduccion',
        label: this.translate.instant('MAIN_MENU.TRADUCCION'),
        disabled: false,
        url: '/products/traductor',
        active: false
      }
    ];
  }

  getUrlActive() {}
}
