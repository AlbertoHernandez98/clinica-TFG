import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioDomicilioComponent } from './servicio-domicilio.component';

describe('ServicioDomicilioComponent', () => {
  let component: ServicioDomicilioComponent;
  let fixture: ComponentFixture<ServicioDomicilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioDomicilioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
