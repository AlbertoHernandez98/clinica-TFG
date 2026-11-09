import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MisCitasComponent } from './mis-citas.component';

describe('MisCitasComponent', () => {
  let fixture: ComponentFixture<MisCitasComponent>;
  let http: HttpTestingController;
  const url = 'http://localhost:3000/citas/mis-citas';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisCitasComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }]
    }).compileComponents();
    fixture = TestBed.createComponent(MisCitasComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); http.verify(); });

  it('shows appointment details and missing values without edit actions', () => {
    http.expectOne(url).flush([
      { idCita: 1, fecha: '2031-02-04', hora: '10:30', duracion: 30, servicio: 'Consulta', medicoNombre: 'Ana', medicoApellidos: 'Pérez' },
      { idCita: 2, fecha: null, hora: null, duracion: null, servicio: null, medicoNombre: null, medicoApellidos: null }
    ]);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('04/02/2031');
    expect(text).toContain('10:30');
    expect(text).toContain('Ana Pérez');
    expect(text).toContain('Consulta');
    expect(text).toContain('MIS_CITAS.FECHA_DESCONOCIDA');
    expect(text).toContain('MIS_CITAS.HORA_DESCONOCIDA');
    expect(text).toContain('MIS_CITAS.DURACION_DESCONOCIDA');
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('li button').length).toBe(0);
  });

  it('shows an empty state for a patient with no appointments', () => {
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('MIS_CITAS.VACIO');
  });

  it('shows errors and retries without showing the empty state', () => {
    http.expectOne(url).flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('MIS_CITAS.VACIO');
    fixture.nativeElement.querySelector('.retry').click();
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('MIS_CITAS.VACIO');
  });
});
