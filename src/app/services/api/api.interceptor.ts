import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

/**
 * API Interceptor - Handles all HTTP requests
 * - Adds base URL to relative requests
 * - Sets default headers
 * - Handles global error responses
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  
  constructor(private configService: ConfigService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // Don't intercept external URLs, assets, or i18n translation files
    if (request.url.startsWith('http') || request.url.includes('assets/') || request.url.includes('i18n/')) {
      return next.handle(request);
    }

    // Add base URL to relative requests
    const apiRequest = request.clone({
      url: this.configService.getApiUrl(request.url),
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });

    return next.handle(apiRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }
}
