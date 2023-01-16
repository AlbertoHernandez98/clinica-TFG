import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendajeComponent } from './vendaje.component';

describe('VendajeComponent', () => {
  let component: VendajeComponent;
  let fixture: ComponentFixture<VendajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
