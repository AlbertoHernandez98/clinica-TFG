import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaOseaComponent } from './cirugia-osea.component';

describe('CirugiaOseaComponent', () => {
  let component: CirugiaOseaComponent;
  let fixture: ComponentFixture<CirugiaOseaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirugiaOseaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaOseaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
