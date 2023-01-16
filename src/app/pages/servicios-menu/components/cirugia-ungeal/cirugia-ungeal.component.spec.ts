import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaUngealComponent } from './cirugia-ungeal.component';

describe('CirugiaUngealComponent', () => {
  let component: CirugiaUngealComponent;
  let fixture: ComponentFixture<CirugiaUngealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirugiaUngealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaUngealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
