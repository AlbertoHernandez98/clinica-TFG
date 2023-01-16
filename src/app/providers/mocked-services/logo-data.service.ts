import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoDataService {
  logos = new BehaviorSubject<any[]>([]);
  $logos: Observable<any[]> = this.logos.asObservable();

  constructor() {}

  saveLogos(files: any[]) {
    this.logos.next(files);
  }

  loadLogos() {
    this.logos.subscribe((files) => files);
  }
}
