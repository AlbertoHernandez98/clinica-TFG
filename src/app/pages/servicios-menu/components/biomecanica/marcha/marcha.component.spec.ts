import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarchaComponent } from './marcha.component';

describe('MarchaComponent', () => {
  let component: MarchaComponent;
  let fixture: ComponentFixture<MarchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
