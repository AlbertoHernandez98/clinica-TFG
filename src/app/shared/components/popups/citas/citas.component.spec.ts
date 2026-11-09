import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CitasComponent } from './citas.component';

describe('CitasComponent', () => {
  let component: CitasComponent;
  let fixture: ComponentFixture<CitasComponent>;
  let http: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CitasComponent>>;
  const patient = { idPersona: 5 };
  const url = 'http://localhost:3000/citas';

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [CitasComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
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

  it('opens an appointment and refreshes the list on close', () => {
    const appointment = { idCliente: 5, idServicio: 2, fechaInicio: '2026-01-15T10:00:00' };
    http.expectOne(url).flush([appointment]);
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<any>);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.appointments__item').click();
    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({ data: { selectedUser: patient, appointment }, width: '500px' })
    );
    http.expectOne(url).flush([]);
  });

  it('opens the creation dialog and closes the list', () => {
    http.expectOne(url).flush([]);
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<any>);
    fixture.nativeElement.querySelector('.appointments__create').click();
    expect(dialog.open).toHaveBeenCalled();
    http.expectOne(url).flush([]);
    fixture.nativeElement.querySelector('.appointments__close').click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
