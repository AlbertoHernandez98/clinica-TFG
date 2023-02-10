import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppStateService } from './providers/app-state/app-state.service';
import { Router } from '@angular/router';
import {
  AppInfo,
  Toast
} from './providers/app-state/models/app-state.interface';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isLogged = false;
  showSpiner = false;
  listaBreadcum: any = [];

  title = 'configurador-pwa-app';
  idMenu = '';
  constructor(
    private appState: AppStateService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    // this.lisentAppState();
    this.lisentToToastMsj();
    this.lisentToSpiner();
  }

  ngOnInit(): void {

  }

  // lisentAppState() {
  //   this.appState.getBreadcumInfo().subscribe((result) => {
  //     this.appInfo = result;
  //     this.listaBreadcum = [...this.appInfo.breadcum];
  //     if (this.appInfo.idMenuActive) {
  //       this.idMenu = this.appInfo.idMenuActive;
  //     }
  //     this.cd.detectChanges();
  //   });
  // }

  lisentToToastMsj() {
    this.appState.getSnackbarMsj().subscribe((res: Toast) => {
      this.openSnackBar(res);
    });
  }

  lisentToSpiner() {
    this.appState.getSpiner().subscribe((res: boolean) => {
      this.showSpiner = res;
    });
  }

  lisentToRoute() {
    return this.router.url === '/' || this.router.url.includes('access-menu');
  }

  showBreadCum() {
    return (
      this.router.url !== '/' &&
      !this.router.url.includes('access-menu')
    );
  }

  openSnackBar(parameters: Toast) {
    this.snackBar.open(parameters.msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:
        parameters.type === 'success' ? ['success_snack'] : ['error_snack'],
      duration: 3000
    });
  }
}
