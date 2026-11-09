import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HistorialComponent } from './historial.component';

describe('HistorialComponent', () => {
  let fixture: ComponentFixture<HistorialComponent>;
  let component: HistorialComponent;
  let http: HttpTestingController;
  const patient = { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez' };
  const entries = [{ idHistorialClinico: 1, fecha: '2031-02-04', hora: '10:00:00', comentarios: 'Nota',
    idMedico: 2, idServicio: 1, idCita: 9, autorNombre: 'Médica', autorApellidos: 'Ejemplo', servicio: 'Consulta' }];

  async function setup(appointment: boolean) {
    await TestBed.configureTestingModule({
      declarations: [HistorialComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: {
        paramMap: of(convertToParamMap({ dato: 4 })),
        queryParamMap: of(convertToParamMap(appointment ? { cita: 9 } : {}))
      } }]
    }).compileComponents();
    fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function flush(role: number, appointment = false) {
    http.expectOne('http://localhost:3000/auth/me').flush({ idRolNativo: role });
    http.expectOne('http://localhost:3000/historialclinico/paciente/4').flush({ paciente: patient, entradas: entries });
    http.expectOne('http://localhost:3000/servicio').flush([{ idServicio: 1, servicio: 'Consulta' }]);
    if (appointment) http.expectOne('http://localhost:3000/historialclinico/cita/9').flush({ idCita: 9, idCliente: 4, idServicio: 1 });
    fixture.detectChanges();
  }

  afterEach(() => { if (fixture) fixture.destroy(); if (http) http.verify(); });

  it('lets a doctor write a note linked to the appointment and reloads the history', async () => {
    await setup(true);
    flush(2, true);
    expect(component.form.controls.idServicio.value).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Ana Pérez');
    component.form.controls.comentarios.setValue('Comentario de la consulta');
    component.save();
    const request = http.expectOne('http://localhost:3000/historialclinico');
    expect(request.request.body).toEqual({ idCliente: 4, idServicio: 1, idCita: 9, comentarios: 'Comentario de la consulta' });
    request.flush({ idHistorialClinico: 2 });
    flush(2, true);
    expect(component.saved).toBeTrue();
    expect(component.form.controls.comentarios.value).toBe('');
  });

  [3, 4].forEach(role => it(`shows history without a write form for role ${role}`, async () => {
    await setup(false);
    flush(role);
    expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
    component.save();
    http.expectNone('http://localhost:3000/historialclinico');
    expect(fixture.nativeElement.textContent).toContain('Nota');
  }));

  it('does not show an entry form when the appointment belongs to another patient', async () => {
    await setup(true);
    http.expectOne('http://localhost:3000/auth/me').flush({ idRolNativo: 2 });
    http.expectOne('http://localhost:3000/historialclinico/paciente/4').flush({ paciente: patient, entradas: entries });
    http.expectOne('http://localhost:3000/servicio').flush([]);
    http.expectOne('http://localhost:3000/historialclinico/cita/9').flush({ idCita: 9, idCliente: 5, idServicio: 1 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('textarea')).toBeNull();
  });

  it('preserves the note and shows an error when saving fails', async () => {
    await setup(false);
    flush(1);
    component.form.patchValue({ idServicio: 1, comentarios: 'Texto' });
    component.save();
    http.expectOne('http://localhost:3000/historialclinico').flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(component.saveError).toBeTrue();
    expect(component.form.controls.comentarios.value).toBe('Texto');
  });
});
