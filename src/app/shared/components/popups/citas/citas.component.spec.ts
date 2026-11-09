import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { CitasComponent } from './citas.component';

describe('CitasComponent', () => {
  let component: CitasComponent;
  let fixture: ComponentFixture<CitasComponent>;
  let http: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CitasComponent>>;
  const patient = { idPersona: 5 };
  const url = 'http://localhost:3000/citas';

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CitasComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { selectedUser: patient } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CitasComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('shows loading and empty states', () => {
    expect(fixture.nativeElement.querySelector('.appointments__state')).toBeTruthy();
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.appointments__empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('shows a loading error rather than an empty list', () => {
    http.expectOne(url).flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.appointments__empty')).toBeFalsy();
  });

  it('shows appointments without controls to edit or create them', () => {
    const appointment = { idCliente: 5, idServicio: 2, fechaInicio: '2026-01-15T10:00:00' };
    http.expectOne(url).flush([appointment]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.appointments__item').textContent).toContain('2');
    expect(fixture.nativeElement.querySelector('button.appointments__item')).toBeNull();
    expect(fixture.nativeElement.querySelector('.appointments__create')).toBeNull();
  });

  it('closes the list', () => {
    http.expectOne(url).flush([]);
    fixture.nativeElement.querySelector('.appointments__close').click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
