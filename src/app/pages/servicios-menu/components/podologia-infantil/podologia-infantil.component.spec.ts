import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodologiaInfantilComponent } from './podologia-infantil.component';

describe('PodologiaInfantilComponent', () => {
  let component: PodologiaInfantilComponent;
  let fixture: ComponentFixture<PodologiaInfantilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodologiaInfantilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodologiaInfantilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
