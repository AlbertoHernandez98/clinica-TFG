import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface User {
  dni: string;
  idRolNativo: number;
  [key: string]: any;
}

interface Service {
  id: number;
  name: string;
  [key: string]: any;
}

/**
 * DatabaseService - Handles all API calls to backend
 * Uses HttpClient with API Interceptor for base URL management
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor(private http: HttpClient) { }

  /**
   * Load user role by username (DNI)
   * @param username User DNI
   * @returns Observable of user role ID
   */
  public loadUserRol(username: string): Observable<number> {
    return this.http.get<User[]>('/persona')
      .pipe(
        map((users: User[]) => {
          const user = users.find((u: User) => u.dni === username);
          if (!user) {
            throw new Error('User not found');
          }
          return user.idRolNativo;
        }),
        catchError((error) => {
          console.error('Error loading user role:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Load current logged-in user from cookie
   * @returns Observable of user object
   */
  public loadUser(): Observable<User> {
    const userLogged = this.getUserFromCookie();
    
    return this.http.get<User[]>('/persona')
      .pipe(
        map((users: User[]) => {
          const user = users.find((u: User) => u.dni === userLogged);
          if (!user) {
            throw new Error('User not found in database');
          }
          return user;
        }),
        catchError((error) => {
          console.error('Error loading user:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Load all available services
   * @returns Observable of services array
   */
  public loadServices(): Observable<Service[]> {
    return this.http.get<Service[]>('/servicio')
      .pipe(
        catchError((error) => {
          console.error('Error loading services:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Extract username from browser cookie
   * @returns Username from cookie
   */
  private getUserFromCookie(): string {
    const str = document.cookie;
    const match: any = str.match(/user=([^;]*)/);
    return match ? match[1].trim() : '';
  }
}