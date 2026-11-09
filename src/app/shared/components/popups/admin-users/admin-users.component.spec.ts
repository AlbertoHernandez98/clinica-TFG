import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let http: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AdminUsersComponent>>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [AdminUsersComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('filters users and restores results when the search is shortened', () => {
    http.expectOne('http://localhost:3000/persona').flush([
      { nombre: 'Ana', apellidos: 'Pérez' }, { nombre: 'Alberto', apellidos: 'Ruiz' }
    ]);
    component.form.controls.nombre.setValue('ana');
    expect(component.userList.map(user => user.nombre)).toEqual(['Ana']);
    component.form.controls.nombre.setValue('a');
    expect(component.userList.map(user => user.nombre)).toEqual(['Ana', 'Alberto']);
  });

  it('shows an error rather than an empty list when loading fails', () => {
    http.expectOne('http://localhost:3000/persona').flush('Error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(component.loadError).toBeTrue();
  });

  it('opens the selected user and refreshes the list after closing', () => {
    const user = { nombre: 'Ana', apellidos: 'Pérez' };
    http.expectOne('http://localhost:3000/persona').flush([user]);
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as MatDialogRef<any>);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.admin-users__user').click();
    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({ data: { selectedUser: user }, width: '600px' })
    );
    http.expectOne('http://localhost:3000/persona').flush([user]);
  });

  it('closes the dialog using the close button', () => {
    http.expectOne('http://localhost:3000/persona').flush([]);
    fixture.nativeElement.querySelector('.admin-users__close').click();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
