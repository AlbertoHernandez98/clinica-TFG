import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuditoriaHistorialComponent } from './auditoria-historial.component';

describe('AuditoriaHistorialComponent', () => {
  let fixture: ComponentFixture<AuditoriaHistorialComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditoriaHistorialComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }]
    }).compileComponents();
    fixture = TestBed.createComponent(AuditoriaHistorialComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => { http.verify(); fixture.destroy(); });

  it('displays audit events and loads older pages', () => {
    const event = { idAuditoria: '5', fecha: '2031-02-03T10:00:00Z', idUsuario: 1, rolUsuario: 1,
      operacion: 'CONSULTA', resultado: 'PERMITIDO', idPaciente: 4, idHistorialClinico: null };
    http.expectOne('http://localhost:3000/historialclinico/auditoria').flush({ eventos: [event], siguiente: '5' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('AUDIT.CONSULTA');
    expect(fixture.nativeElement.textContent).toContain('AUDIT.PERMITIDO');
    fixture.componentInstance.load(true);
    http.expectOne('http://localhost:3000/historialclinico/auditoria?antes=5').flush({ eventos: [], siguiente: null });
    expect(fixture.componentInstance.events.length).toBe(1);
    expect(fixture.componentInstance.cursor).toBeNull();
  });

  it('shows an error and retries initial loading', () => {
    http.expectOne('http://localhost:3000/historialclinico/auditoria')
      .flush({}, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    fixture.componentInstance.load();
    http.expectOne('http://localhost:3000/historialclinico/auditoria').flush({ eventos: [], siguiente: null });
    expect(fixture.componentInstance.error).toBeFalse();
  });
});
