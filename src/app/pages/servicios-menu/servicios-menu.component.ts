import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';
import { ActivatedRoute } from '@angular/router';
import { ServiceCategory } from 'src/app/shared/models/service.interface';

@Component({
  selector: 'app-servicios-menu',
  templateUrl: './servicios-menu.component.html',
  styleUrls: ['./servicios-menu.component.scss']
})
export class ServiciosMenuComponent implements OnInit {

  // Usar enum en lugar de múltiples booleans
  activeCategory: ServiceCategory = ServiceCategory.QUIROPODIA;
  readonly ServiceCategory = ServiceCategory; // Para acceso en template

  // Estado de visibilidad de servicio específico
  mostrandoServicio = false;

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Detectar si hay una ruta hija activa
    this.route.firstChild?.data.subscribe(() => {
      this.mostrandoServicio = !!this.route.firstChild;
    });

    // Subscribirse a cambios en los parámetros
    this.route.params.subscribe(() => {
      this.mostrandoServicio = !!this.route.firstChild;
    });
    
    this.getTranslate();
  }

  /**
   * Obtiene las traducciones y luego inicializa las rutas
   */
  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.SERVICIOS')
      .subscribe(() => {
        this.initRoutes();
      });
  }

  /**
   * Inicializa la información de rutas y breadcrumbs
   */
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

  /**
   * Cambia la categoría activa
   * Reemplaza los 8 métodos anteriores (quiro, bio, ung, etc.)
   * @param category - La categoría a activar
   */
  selectCategory(category: ServiceCategory): void {
    this.activeCategory = category;
  }

  /**
   * Helper para verificar si una categoría está activa
   * Útil para templates y lógica
   */
  isCategoryActive(category: ServiceCategory): boolean {
    return this.activeCategory === category;
  }
}



