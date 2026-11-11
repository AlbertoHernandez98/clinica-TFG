import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { ApiInterceptor } from './api.interceptor';
import { AuthService } from '../auth/auth.service';

interface TestLockManager {
  request(name: string, callback: () => Promise<unknown>): Promise<unknown>;
}

describe('ApiInterceptor session renewal', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    const locks = (navigator as Navigator & { locks: TestLockManager }).locks;
    if (locks) {
      spyOn(locks, 'request').and.callFake((_name, callback) => callback());
    }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    TestBed.inject(AuthService).setSession({
      access_token: 'expired', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 }
    });
  });

  afterEach(() => {
    backend.verify();
    TestBed.inject(AuthService).clearSession();
    for (const name of ['user', 'nombre', 'idRol', 'sessionToken']) document.cookie = `${name}=; Max-Age=0; path=/`;
  });

  it('coalesces concurrent refresh requests and retries both failed requests', fakeAsync(() => {
    const values: string[] = [];
    http.get('http://localhost:3000/auth/me').subscribe(() => values.push('me'));
    http.get('http://localhost:3000/citas').subscribe(() => values.push('citas'));
    backend.expectOne('http://localhost:3000/auth/me').flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    const refresh = backend.expectOne('http://localhost:3000/auth/refresh');
    expect(refresh.request.withCredentials).toBeTrue();
    refresh.flush({ access_token: 'renewed', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 } });
    flushMicrotasks();
    const me = backend.expectOne('http://localhost:3000/auth/me');
    const citas = backend.expectOne('http://localhost:3000/citas');
    expect(me.request.headers.get('Authorization')).toBe('Bearer renewed');
    expect(citas.request.headers.get('Authorization')).toBe('Bearer renewed');
    me.flush({});
    citas.flush({});
    expect(values).toEqual(['me', 'citas']);
  }));

  it('clears local session when refresh is rejected', fakeAsync(() => {
    let status = 0;
    http.get('http://localhost:3000/citas').subscribe({ error: error => status = error.status });
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/auth/refresh').flush({}, { status: 401, statusText: 'Unauthorized' });
    flushMicrotasks();
    expect(status).toBe(401);
    expect(TestBed.inject(AuthService).getAccessToken()).toBeNull();
  }));

  it('retries a refresh once after a network error and preserves the request', fakeAsync(() => {
    let completed = false;
    http.get('http://localhost:3000/citas').subscribe(() => completed = true);
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/auth/refresh').error(new ProgressEvent('error'));
    const retry = backend.expectOne('http://localhost:3000/auth/refresh');
    expect(retry.request.withCredentials).toBeTrue();
    retry.flush({ access_token: 'renewed', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 } });
    flushMicrotasks();
    backend.expectOne('http://localhost:3000/citas').flush({});
    expect(completed).toBeTrue();
  }));

  it('surfaces a repeated network error without clearing the session', fakeAsync(() => {
    let status = -1;
    http.get('http://localhost:3000/citas').subscribe({ error: error => status = error.status });
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/auth/refresh').error(new ProgressEvent('error'));
    backend.expectOne('http://localhost:3000/auth/refresh').error(new ProgressEvent('error'));
    flushMicrotasks();
    expect(status).toBe(0);
    expect(TestBed.inject(AuthService).getAccessToken()).toBe('expired');
  }));

  it('serializes refresh and logout using the shared browser lock', fakeAsync(() => {
    const locks = (navigator as Navigator & { locks: TestLockManager }).locks;
    if (!locks) return;
    let tail: Promise<unknown> = Promise.resolve();
    const request = locks.request as jasmine.Spy;
    request.and.callFake((_name: string, callback: () => Promise<unknown>) => {
      const current = tail.then(callback);
      tail = current.catch(() => undefined);
      return current;
    });
    const auth = TestBed.inject(AuthService);
    auth.refresh().subscribe();
    auth.logout().subscribe();
    flushMicrotasks();
    expect(request.calls.allArgs().map(args => args[0])).toEqual(['clinica-refresh-session', 'clinica-refresh-session']);
    backend.expectNone('http://localhost:3000/auth/logout');
    backend.expectOne('http://localhost:3000/auth/refresh').flush({
      access_token: 'renewed', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 }
    });
    flushMicrotasks();
    backend.expectOne('http://localhost:3000/auth/logout').flush({});
    flushMicrotasks();
    expect(auth.getAccessToken()).toBeNull();
  }));

  it('reuses an already renewed token for a late 401 without another refresh', fakeAsync(() => {
    http.get('http://localhost:3000/auth/me').subscribe();
    http.get('http://localhost:3000/citas').subscribe();
    const me = backend.expectOne('http://localhost:3000/auth/me');
    const citas = backend.expectOne('http://localhost:3000/citas');
    me.flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/auth/refresh').flush({
      access_token: 'renewed', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 }
    });
    flushMicrotasks();
    backend.expectOne('http://localhost:3000/auth/me').flush({});
    citas.flush({}, { status: 401, statusText: 'Unauthorized' });
    const retry = backend.expectOne('http://localhost:3000/citas');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer renewed');
    retry.flush({});
    backend.expectNone('http://localhost:3000/auth/refresh');
  }));

  it('does not renew after the local session was cleared while a request was pending', () => {
    let status = 0;
    http.get('http://localhost:3000/citas').subscribe({ error: error => status = error.status });
    const request = backend.expectOne('http://localhost:3000/citas');
    TestBed.inject(AuthService).clearSession();
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    backend.expectNone('http://localhost:3000/auth/refresh');
  });

  it('does not clear a valid new session when a retried API request is rejected', fakeAsync(() => {
    let status = 0;
    http.get('http://localhost:3000/citas').subscribe({ error: error => status = error.status });
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne('http://localhost:3000/auth/refresh').flush({
      access_token: 'renewed', user: { dni: 'TEST', nombre: 'Test', idRolNativo: 1 }
    });
    flushMicrotasks();
    backend.expectOne('http://localhost:3000/citas').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    expect(TestBed.inject(AuthService).getAccessToken()).toBe('renewed');
  }));
});
