import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    public getItem(item: string) {
        const localStorageItem = localStorage?.getItem(item);
        if (localStorageItem !== 'undefined') {
          return JSON.parse(localStorage?.getItem(item) as string);
        }
      }
    
      public setItem(item: string, value: any) {
        return localStorage.setItem(item, JSON.stringify(value));
      }
    
      public removeItem(item: string) {
        return localStorage.removeItem(item);
      }
    
      public clear() {
        return localStorage.clear();
      }
}