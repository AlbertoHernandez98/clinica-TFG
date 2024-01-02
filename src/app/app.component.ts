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
import { LangService } from './services/lang/lang';
import { TranslateService } from '@ngx-translate/core';
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
  selectedLanguage = 'ES';

  title = 'configurador-pwa-app';
  idMenu = '';
  constructor(
    private appState: AppStateService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private langService: LangService,
    private translate: TranslateService
  ) {
    // this.lisentAppState();
    this.lisentToToastMsj();
    this.lisentToSpiner();
    //EL PUTO ROUTING
  }

  ngOnInit(): void {


  }

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
