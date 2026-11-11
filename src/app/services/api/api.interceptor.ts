import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService, private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('assets/') || request.url.includes('i18n/')) return next.handle(request);
    const apiRequest = request.url.startsWith('http') ? request : request.clone({
      url: this.configService.getApiUrl(request.url)
    });
    const base = `${this.configService.getApiBaseUrl()}/`;
    if (!apiRequest.url.startsWith(base)) return next.handle(apiRequest);
    const token = this.auth.getAccessToken();
    const authRequest = token ? apiRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : apiRequest;
    return next.handle(authRequest).pipe(catchError((error: HttpErrorResponse) => {
      const sessionEndpoint = ['login', 'refresh', 'logout'].some(endpoint => apiRequest.url === `${base}auth/${endpoint}`);
      if (error.status === 401 && token && !sessionEndpoint) {
        const currentToken = this.auth.getAccessToken();
        if (!currentToken) return throwError(() => error);
        if (currentToken !== token) {
          return next.handle(apiRequest.clone({ setHeaders: { Authorization: `Bearer ${currentToken}` } }));
        }
        return this.auth.refresh().pipe(
          catchError(refreshError => {
            if (refreshError.status === 401) this.auth.clearSession();
            return throwError(() => refreshError);
          }),
          switchMap(session => next.handle(apiRequest.clone({
            setHeaders: { Authorization: `Bearer ${session.access_token}` }
          })))
        );
      }
      return throwError(() => error);
    }));
  }
}
