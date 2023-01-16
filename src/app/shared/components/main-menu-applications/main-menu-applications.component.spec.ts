import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuApplicationsComponent } from './main-menu-applications.component';

describe('MainMenuApplicationsComponent', () => {
  let component: MainMenuApplicationsComponent;
  let fixture: ComponentFixture<MainMenuApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainMenuApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
