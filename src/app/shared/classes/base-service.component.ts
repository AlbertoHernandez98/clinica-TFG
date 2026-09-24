import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

/**
 * Clase base para componentes de servicios
 * Reduce duplicación de código para getTranslate, initRoutes y volver
 */
@Component({
  template: ''
})
export abstract class BaseServiceComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();

  constructor(
    protected translate: TranslateService,
    protected appService: AppStateService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.getTranslate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Espera a que las traducciones estén cargadas antes de inicializar las rutas
   */
  protected getTranslate(): void {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.SERVICIOS')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initRoutes();
      });
  }

  /**
   * Inicializa las rutas y breadcrumbs
   * Debe ser implementado por cada componente hijo
   */
  protected abstract initRoutes(): void;

  /**
   * Navega de vuelta al menú de servicios
   */
  public volver(): void {
    this.router.navigateByUrl('/serviciosMenu');
  }

  /**
   * Helper para establecer breadcrumbs
   */
  protected setBreadcrumbs(breadcrumbs: Array<{ name: string; route: string; active: boolean }>): void {
    const appInfo: AppInfo = {
      breadcum: breadcrumbs,
      isLogged: true,
      idMenuActive: '2'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }
}
