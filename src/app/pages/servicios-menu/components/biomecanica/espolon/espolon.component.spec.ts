import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspolonComponent } from './espolon.component';

describe('EspolonComponent', () => {
  let component: EspolonComponent;
  let fixture: ComponentFixture<EspolonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspolonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspolonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
