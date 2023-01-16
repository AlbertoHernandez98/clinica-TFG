import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaCitaChildComponent } from './reserva-cita-child.component';

describe('ReservaCitaChildComponent', () => {
  let component: ReservaCitaChildComponent;
  let fixture: ComponentFixture<ReservaCitaChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaCitaChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaCitaChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
