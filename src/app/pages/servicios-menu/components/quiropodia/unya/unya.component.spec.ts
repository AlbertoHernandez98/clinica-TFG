import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnyaComponent } from './unya.component';

describe('UnyaComponent', () => {
  let component: UnyaComponent;
  let fixture: ComponentFixture<UnyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnyaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
