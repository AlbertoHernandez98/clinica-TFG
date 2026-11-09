import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { VacacionesComponent } from './vacaciones.component';
import { ClinicDatePickerModule } from '../../forms/clinic-date-picker/clinic-date-picker.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';
import { Subject } from 'rxjs';

describe('VacacionesComponent', () => {
  let fixture: ComponentFixture<VacacionesComponent>;
  let component: VacacionesComponent;
  let http: HttpTestingController;
  const url = 'http://localhost:3000/medicos/2/vacaciones';
  let confirmation: Subject<boolean>;
  let confirm: jasmine.Spy;

  beforeEach(async () => {
    confirmation = new Subject<boolean>();
    confirm = jasmine.createSpy('confirm').and.returnValue(confirmation.asObservable());
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), ClinicDatePickerModule, NoopAnimationsModule],
      declarations: [VacacionesComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: ConfirmActionService, useValue: { confirm } },
        { provide: MAT_DIALOG_DATA, useValue: { idMedico: 2, nombre: 'Test' } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(VacacionesComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(url).flush([]);
  });

  afterEach(() => http.verify());

  it('rejects reversed dates without sending a request', () => {
    component.form.patchValue({ fechaInicio: '2031-02-03', fechaFin: '2031-02-01' });
    component.add();
    expect(component.errorKey).toBe('VACACIONES.FECHAS_INVALIDAS');
    http.expectNone(url);
  });

  it('warns about existing appointments and refreshes the list', () => {
    component.form.patchValue({ fechaInicio: '2031-02-01', fechaFin: '2031-02-03' });
    component.add();
    http.expectOne(url).flush({ citasExistentes: 2 });
    http.expectOne(url).flush([]);
    expect(component.warningCount).toBe(2);
  });

  it('shows a validation error for vacation periods without working days', () => {
    component.form.patchValue({ fechaInicio: '2031-02-08', fechaFin: '2031-02-09' });
    component.add();
    http.expectOne(url).flush('Error', { status: 400, statusText: 'Bad Request' });
    expect(component.errorKey).toBe('VACACIONES.FECHAS_INVALIDAS');
  });

  it('deletes holidays only after confirmation', () => {
    const holiday = { idVacacion: 7, fechaInicio: '2031-02-01', fechaFin: '2031-02-03' };
    component.remove(holiday);
    component.remove(holiday);
    expect(confirm).toHaveBeenCalledTimes(1);
    http.expectNone(`${url}/7`);
    confirmation.next(false);
    confirmation.complete();
    expect(component.saving).toBeFalse();
    confirmation = new Subject<boolean>();
    confirm.and.returnValue(confirmation.asObservable());
    component.remove(holiday);
    confirmation.next(true);
    confirmation.complete();
    http.expectOne(`${url}/7`).flush(null);
    http.expectOne(url).flush([]);
  });
});
