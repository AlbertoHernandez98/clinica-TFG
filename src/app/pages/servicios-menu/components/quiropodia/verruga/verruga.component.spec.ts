import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerrugaComponent } from './verruga.component';

describe('VerrugaComponent', () => {
  let component: VerrugaComponent;
  let fixture: ComponentFixture<VerrugaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerrugaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerrugaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
