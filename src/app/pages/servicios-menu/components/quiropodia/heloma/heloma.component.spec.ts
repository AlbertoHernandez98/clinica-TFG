import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelomaComponent } from './heloma.component';

describe('HelomaComponent', () => {
  let component: HelomaComponent;
  let fixture: ComponentFixture<HelomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelomaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
