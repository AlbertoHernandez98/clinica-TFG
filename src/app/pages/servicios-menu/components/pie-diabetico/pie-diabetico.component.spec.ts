import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieDiabeticoComponent } from './pie-diabetico.component';

describe('PieDiabeticoComponent', () => {
  let component: PieDiabeticoComponent;
  let fixture: ComponentFixture<PieDiabeticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieDiabeticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieDiabeticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
