import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, firstValueFrom, from, Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

interface SessionResponse {
  access_token: string;
  user: { dni: string; nombre: string; idRolNativo: number };
}

interface SessionLockManager {
  request<T>(name: string, callback: () => Promise<T>): Promise<T>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient;
  private refreshing?: Observable<SessionResponse>;
  private accessToken: string | null = null;

  constructor(backend: HttpBackend, private readonly config: ConfigService) {
    this.http = new HttpClient(backend);
    sessionStorage.removeItem('accessToken');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setSession(result: SessionResponse): void {
    this.accessToken = result.access_token;
    document.cookie = `user=${encodeURIComponent(result.user.dni)}; path=/; SameSite=Lax`;
    document.cookie = `nombre=${encodeURIComponent(result.user.nombre)}; path=/; SameSite=Lax`;
    document.cookie = `idRol=${result.user.idRolNativo}; path=/; SameSite=Lax`;
  }

  refresh(): Observable<SessionResponse> {
    if (!this.refreshing) {
      this.refreshing = this.serializeCookieRequest(() => {
        const request = this.http.post<SessionResponse>(this.config.getApiUrl('/auth/refresh'), {}, { withCredentials: true });
        return request.pipe(
          catchError((error: HttpErrorResponse) => error.status === 0 ? request : throwError(() => error)),
          tap(result => this.setSession(result))
        );
      }).pipe(finalize(() => this.refreshing = undefined), shareReplay(1));
    }
    return this.refreshing;
  }

  logout(): Observable<unknown> {
    return this.serializeCookieRequest(() =>
      this.http.post(this.config.getApiUrl('/auth/logout'), {}, { withCredentials: true }).pipe(
        tap(() => this.clearSession())
      )
    );
  }

  private serializeCookieRequest<T>(request: () => Observable<T>): Observable<T> {
    return defer(() => {
      const locks = (navigator as Navigator & { locks?: SessionLockManager }).locks;
      if (!locks) return request();
      return from(locks.request('clinica-refresh-session', () => firstValueFrom(request())));
    });
  }

  clearSession(): void {
    this.accessToken = null;
    sessionStorage.removeItem('accessToken');
    for (const name of ['user', 'nombre', 'idRol', 'sessionToken']) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }
}
