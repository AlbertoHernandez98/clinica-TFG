import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { BaseServiceComponent } from 'src/app/shared/classes/base-service.component';

@Component({
  selector: 'app-fascitis',
  templateUrl: './fascitis.component.html',
  styleUrls: ['./fascitis.component.scss']
})
export class FascitisComponent extends BaseServiceComponent {

  constructor(
    translate: TranslateService,
    appService: AppStateService,
    router: Router
  ) {
    super(translate, appService, router);
  }

  /**
   * Inicializa los breadcrumbs específicos para el servicio de Fascitis
   */
  protected initRoutes(): void {
    this.setBreadcrumbs([
      {
        name: this.translate.instant('BREADCUMTEXT.MENU'),
        route: '/access-menu',
        active: true
      },
      {
        name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
        route: '/serviciosMenu',
        active: true
      },
      {
        name: this.translate.instant('BREADCUMTEXT.FASCITIS'),
        route: '/fascitis',
        active: false
      }
    ]);
  }
}

