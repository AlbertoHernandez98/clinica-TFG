import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { MisCitasComponent } from 'src/app/shared/components/popups/mis-citas/mis-citas.component';

describe('PerfilUsuarioComponent', () => {
  let fixture: ComponentFixture<PerfilUsuarioComponent>;
  let component: PerfilUsuarioComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    spyOnProperty(document, 'cookie', 'get').and.returnValue('user=TEST123');
    spyOnProperty(document, 'cookie', 'set');
    await TestBed.configureTestingModule({
      declarations: [PerfilUsuarioComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) }]
    }).compileComponents();
    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('loads the signed-in user and populates editable fields', () => {
    http.expectOne('http://localhost:3000/persona').flush([
      { idPersona: 1, dni: 'TEST123', nombre: 'Ana', apellidos: 'Pérez', telefono: 12345, email: 'ana@example.com', idRolNativo: 2 }
    ]);
    expect(component.form.value).toEqual({ nombre: 'Ana', apellidos: 'Pérez', dni: 'TEST123', telefono: '12345', email: 'ana@example.com' });
    expect(component.loadError).toBeFalse();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[formcontrolname="email"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[formcontrolname="domicilio"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('PERFIL.DOMICILIO');
  });

  it('reports an unknown user instead of attempting to edit an empty profile', () => {
    http.expectOne('http://localhost:3000/persona').flush([]);
    expect(component.loadError).toBeTrue();
    component.guardarPerfil();
    http.expectNone('http://localhost:3000/persona/changeUser');
  });

  it('offers patient appointments only to patients', () => {
    http.expectOne('http://localhost:3000/persona').flush([
      { idPersona: 1, dni: 'TEST123', nombre: 'Ana', apellidos: 'Pérez', telefono: 12345, email: null, idRolNativo: 4 }
    ]);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const button = Array.from(element.querySelectorAll('button'))
      .find(item => item.textContent?.includes('MIS_CITAS.TITULO'));
    expect(button).toBeTruthy();
    button!.click();
    expect(TestBed.inject(MatDialog).open).toHaveBeenCalledWith(MisCitasComponent, jasmine.objectContaining({ width: '600px' }));
  });

  it('does not open patient appointments for a doctor', () => {
    http.expectOne('http://localhost:3000/persona').flush([
      { idPersona: 1, dni: 'TEST123', nombre: 'Ana', apellidos: 'Pérez', telefono: 12345, email: null, idRolNativo: 2 }
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('MIS_CITAS.TITULO');
    component.openMisCitas();
    expect(TestBed.inject(MatDialog).open).not.toHaveBeenCalled();
  });

  it('saves the original DNI and preserves the user role', () => {
    http.expectOne('http://localhost:3000/persona').flush([
      { idPersona: 1, dni: 'TEST123', nombre: 'Ana', apellidos: 'Pérez', telefono: 12345, email: null, idRolNativo: 2 }
    ]);
    component.form.patchValue({ nombre: 'María', email: 'maria@example.com' });
    component.guardarPerfil();
    const request = http.expectOne('http://localhost:3000/persona/changeUser');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      oldDni: 'TEST123', dni: 'TEST123', nombre: 'María', apellidos: 'Pérez', telefono: '12345', email: 'maria@example.com', idRolNativo: 2
    });
    request.flush(null);
  });

  it('reports a server error while loading', () => {
    http.expectOne('http://localhost:3000/persona').flush('Error', { status: 500, statusText: 'Error' });
    expect(component.loadError).toBeTrue();
    expect(component.loading).toBeFalse();
  });
});
