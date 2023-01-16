import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FascitisComponent } from './fascitis.component';

describe('FascitisComponent', () => {
  let component: FascitisComponent;
  let fixture: ComponentFixture<FascitisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FascitisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FascitisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
