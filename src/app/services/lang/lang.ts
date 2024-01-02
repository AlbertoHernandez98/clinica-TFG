import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'English' },
    { codigo: 'pt', nombre: 'Portuguese' },
  ];

  private defaultLanguage = 'es'; 
  private currentLanguageSubject = new BehaviorSubject<string>(
    this.defaultLanguage
  );
  public currentLanguage$: Observable<string> =
    this.currentLanguageSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const savedLanguage = this.localStorageService.getItem('language');
    if (
      savedLanguage &&
      this.idiomasDisponibles.find((lang) => lang.codigo === savedLanguage)
    ) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  public setLanguage(lang: string) {
    if (this.idiomasDisponibles.find((item) => item.codigo === lang)) {
      this.localStorageService.setItem('language', lang);
      this.currentLanguageSubject.next(lang);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.getValue();
  }
}
