import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    public getItem(item: string) {
        try {
          const localStorageItem = localStorage?.getItem(item);
          if (localStorageItem && localStorageItem !== 'undefined') {
            return JSON.parse(localStorageItem);
          }
          return null;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      }
    
      public setItem(item: string, value: any) {
        try {
          return localStorage.setItem(item, JSON.stringify(value));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      }
    
      public removeItem(item: string) {
        try {
          return localStorage.removeItem(item);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    
      public clear() {
        try {
          return localStorage.clear();
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
      }
}