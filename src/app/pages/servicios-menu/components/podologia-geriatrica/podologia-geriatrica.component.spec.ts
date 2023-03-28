import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodologiaGeriatricaComponent } from './podologia-geriatrica.component';

describe('PodologiaGeriatricaComponent', () => {
  let component: PodologiaGeriatricaComponent;
  let fixture: ComponentFixture<PodologiaGeriatricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodologiaGeriatricaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodologiaGeriatricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
