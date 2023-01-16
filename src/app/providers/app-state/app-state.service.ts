import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { AppInfo, MenuChild, Toast } from './models/app-state.interface';
@Injectable({
  providedIn: 'root'
})
export class AppStateService {
breadcumInfo: Subject<AppInfo> = new Subject();
setToastMsj: Subject<Toast> = new Subject();
menuChild: Subject <Array<MenuChild>> = new Subject();
spiner: Subject<boolean> = new Subject();

  constructor(private translate: TranslateService) { }

setBreadcumInfo( payload: AppInfo, key: string ) {
  this.breadcumInfo.next(payload);
  this.setState(key, payload);
}

getBreadcumInfo(): Observable<AppInfo> {
  return this.breadcumInfo;
}

setState(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

getState(key: string) {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

traduccionesLoaded(key: string): Observable<any> {
  return this.translate.get(key);
}

setSnackbarMsj( msjP: string, typeP: string ) {
  const toast: Toast = {
    msj: msjP,
    type: typeP
  };
  this.setToastMsj.next(toast);
}

getSnackbarMsj() {
  return this.setToastMsj;
}

setSpiner(value: boolean) {
  this.spiner.next(value);
}

getSpiner() {
  return this.spiner;
}

setMenuChild(payload: Array<MenuChild>) {
  this.setState('menuChild', payload);
  this.menuChild.next(payload);
}

getMenuchild() {
  return this.menuChild;
}
}


