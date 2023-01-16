import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAComponent } from './personal-a.component';

describe('PersonalAComponent', () => {
  let component: PersonalAComponent;
  let fixture: ComponentFixture<PersonalAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
