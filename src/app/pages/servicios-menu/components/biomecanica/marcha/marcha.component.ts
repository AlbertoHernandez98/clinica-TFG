import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { BaseServiceComponent } from 'src/app/shared/classes/base-service.component';

@Component({
  selector: 'app-marcha',
  templateUrl: './marcha.component.html',
  styleUrls: ['./marcha.component.scss']
})
export class MarchaComponent extends BaseServiceComponent {

  constructor(
    translate: TranslateService,
    appService: AppStateService,
    router: Router
  ) {
    super(translate, appService, router);
  }

  protected initRoutes(): void {
    this.setBreadcrumbs([
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
        name: this.translate.instant('BREADCUMTEXT.MARCHA'),
        route: '/marcha'
      }
    ]);
  }
}
