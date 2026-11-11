import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { ConfirmActionService } from 'src/app/shared/components/popups/confirm-action/confirm-action.service';
import { HistorialComponent } from './historial.component';

describe('HistorialComponent', () => {
  let fixture: ComponentFixture<HistorialComponent>;
  let component: HistorialComponent;
  let http: HttpTestingController;
  const patient = { idPersona: 4, nombre: 'Ana', apellidos: 'Pérez' };
  const entries = [{ idHistorialClinico: 1, fecha: '2031-02-04', hora: '10:00:00', comentarios: 'Nota',
    idMedico: 2, idServicio: 1, idCita: 9, autorNombre: 'Médica', autorApellidos: 'Ejemplo', servicio: 'Consulta',
    anulada: false, versiones: [] }];
  const confirmations = jasmine.createSpyObj<ConfirmActionService>('ConfirmActionService', ['confirm']);

  async function setup(appointment: boolean) {
    confirmations.confirm.calls.reset();
    await TestBed.configureTestingModule({
      declarations: [HistorialComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: {
          paramMap: of(convertToParamMap({ dato: 4 })),
          queryParamMap: of(convertToParamMap(appointment ? { cita: 9 } : {}))
        } },
        { provide: ConfirmActionService, useValue: confirmations }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  function flush(role: number, appointment = false) {
    http.expectOne('http://localhost:3000/auth/me').flush({ idPersona: 2, idRolNativo: role });
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

  it('only exposes edit and annul controls to an authoring doctor or administrator', async () => {
    await setup(false);
    flush(2);
    expect(fixture.nativeElement.textContent).toContain('HISTORIAL.EDITAR');
    expect(fixture.nativeElement.textContent).toContain('HISTORIAL.ANULAR');
    component.role = 3;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('HISTORIAL.EDITAR');
    expect(fixture.nativeElement.textContent).not.toContain('HISTORIAL.ANULAR');
  });

  it('requires an operation reason and confirmation before updating a note', async () => {
    await setup(false);
    flush(2);
    confirmations.confirm.and.returnValue(of(false));
    component.startEdit(component.entries[0]);
    component.editForm.setValue({ comentarios: 'Texto corregido', motivo: '' });
    component.saveEdit(component.entries[0]);
    expect(confirmations.confirm).not.toHaveBeenCalled();
    component.editForm.controls.motivo.setValue('Corrección');
    component.saveEdit(component.entries[0]);
    expect(confirmations.confirm).toHaveBeenCalled();
    http.expectNone('http://localhost:3000/historialclinico/1');
  });

  it('locks repeated edit and annul confirmation attempts until the dialog is cancelled', async () => {
    await setup(false);
    flush(2);
    const confirmation = new Subject<boolean>();
    confirmations.confirm.and.returnValue(confirmation);
    component.startEdit(component.entries[0]);
    component.editForm.setValue({ comentarios: 'Texto corregido', motivo: 'Corrección' });

    component.saveEdit(component.entries[0]);
    component.saveEdit(component.entries[0]);
    component.annulForm.controls.motivo.setValue('Duplicada');
    component.annulEntry(component.entries[0]);
    expect(confirmations.confirm).toHaveBeenCalledTimes(1);
    expect(component.operatingEntryId).toBe(1);

    confirmation.next(false);
    confirmation.complete();
    expect(component.operatingEntryId).toBeNull();

    const secondConfirmation = new Subject<boolean>();
    confirmations.confirm.and.returnValue(secondConfirmation);
    component.saveEdit(component.entries[0]);
    expect(confirmations.confirm).toHaveBeenCalledTimes(2);
    expect(component.operatingEntryId).toBe(1);
  });

  it('releases the operation lock when confirmation errors or the request fails', async () => {
    await setup(false);
    flush(2);
    const confirmation = new Subject<boolean>();
    confirmations.confirm.and.returnValue(confirmation);
    component.startEdit(component.entries[0]);
    component.editForm.setValue({ comentarios: 'Texto corregido', motivo: 'Corrección' });
    component.saveEdit(component.entries[0]);
    confirmation.error(new Error('Dialog failed'));
    expect(component.operatingEntryId).toBeNull();
    expect(component.operationError).toBeTrue();

    const confirmedThenErrored = new Subject<boolean>();
    confirmations.confirm.and.returnValue(confirmedThenErrored);
    component.saveEdit(component.entries[0]);
    confirmedThenErrored.next(true);
    confirmedThenErrored.error(new Error('Dialog closed after confirmation'));
    expect(component.operatingEntryId).toBe(1);
    http.expectOne('http://localhost:3000/historialclinico/1')
      .flush('Error', { status: 500, statusText: 'Error' });
    expect(component.operatingEntryId).toBeNull();
    expect(component.operationError).toBeTrue();
  });
});
