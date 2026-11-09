import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicDatePickerModule } from './clinic-date-picker.module';

@Component({ template: '<app-clinic-date-picker [(ngModel)]="value" label="Fecha"></app-clinic-date-picker>' })
class HostComponent { value: string | null = '2031-02-03'; }

describe('ClinicDatePickerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [FormsModule, ClinicDatePickerModule, NoopAnimationsModule, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
  });

  it('shows DD/MM/YYYY while keeping an ISO date in the form', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('03/02/2031');
    input.value = '15/04/2031';
    input.dispatchEvent(new Event('input'));
    tick();
    expect(fixture.componentInstance.value).toBe('2031-04-15');
  }));

  it('does not accept an invalid calendar date', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '31/02/2031';
    input.dispatchEvent(new Event('input'));
    tick();
    expect(fixture.componentInstance.value).toBeNull();
  }));
});
