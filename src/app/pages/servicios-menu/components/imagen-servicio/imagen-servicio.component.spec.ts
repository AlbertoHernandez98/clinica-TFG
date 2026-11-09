import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagenServicioComponent } from './imagen-servicio.component';

describe('ImagenServicioComponent', () => {
  let fixture: ComponentFixture<ImagenServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagenServicioComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagenServicioComponent);
    fixture.componentInstance.src = 'assets/img/quiro_verruga.jpg';
    fixture.componentInstance.alt = 'Verruga plantar';
    fixture.detectChanges();
  });

  it('muestra la fotografía con su descripción, sin reproductor', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/img/quiro_verruga.jpg');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('Verruga plantar');
    expect(element.querySelector('iframe')).toBeNull();
    expect(element.querySelector('button')).toBeNull();
  });
});
