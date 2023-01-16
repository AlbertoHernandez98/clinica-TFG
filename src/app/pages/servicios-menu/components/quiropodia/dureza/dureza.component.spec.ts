import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurezaComponent } from './dureza.component';

describe('DurezaComponent', () => {
  let component: DurezaComponent;
  let fixture: ComponentFixture<DurezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
