import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { restoreSession } from '../../app.module';
import { AuthService } from './auth.service';

describe('Session initialization', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.setItem('accessToken', 'legacy-token');
    const locks = (navigator as Navigator & { locks?: { request(name: string, callback: () => Promise<unknown>): Promise<unknown> } }).locks;
    if (locks) spyOn(locks, 'request').and.callFake((_name, callback) => callback());
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    auth.clearSession();
  });

  it('removes legacy storage and keeps a restored token only in memory', fakeAsync(() => {
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    restoreSession(auth)();
    const request = http.expectOne('http://localhost:3000/auth/refresh');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ access_token: 'restored', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 } });
    flushMicrotasks();
    expect(auth.getAccessToken()).toBe('restored');
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  }));

  it('continues anonymously when there is no valid refresh cookie', fakeAsync(() => {
    document.cookie = 'idRol=1; path=/';
    restoreSession(auth)();
    http.expectOne('http://localhost:3000/auth/refresh').flush({}, { status: 401, statusText: 'Unauthorized' });
    flushMicrotasks();
    expect(auth.getAccessToken()).toBeNull();
    expect(document.cookie).not.toContain('idRol=1');
  }));

  it('reports server failure and clears stale local identity', fakeAsync(() => {
    spyOn(console, 'error');
    document.cookie = 'idRol=1; path=/';
    restoreSession(auth)();
    http.expectOne('http://localhost:3000/auth/refresh').flush({}, { status: 500, statusText: 'Error' });
    flushMicrotasks();
    expect(console.error).toHaveBeenCalled();
    expect(auth.getAccessToken()).toBeNull();
    expect(document.cookie).not.toContain('idRol=1');
  }));
});
