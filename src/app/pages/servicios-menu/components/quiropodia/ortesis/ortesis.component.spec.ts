import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrtesisComponent } from './ortesis.component';

describe('OrtesisComponent', () => {
  let component: OrtesisComponent;
  let fixture: ComponentFixture<OrtesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrtesisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrtesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
