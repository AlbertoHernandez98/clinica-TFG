import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiltracionComponent } from './infiltracion.component';

describe('InfiltracionComponent', () => {
  let component: InfiltracionComponent;
  let fixture: ComponentFixture<InfiltracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfiltracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiltracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
