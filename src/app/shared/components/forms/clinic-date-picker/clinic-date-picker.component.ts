import { Component, forwardRef, Injectable, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

@Injectable()
class ClinicDateAdapter extends NativeDateAdapter {
  constructor() { super('es-ES'); }
  override parse(value: string): Date | null {
    if (!value) return null;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return this.invalid();
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    if (year < 1000) return this.invalid();
    const date = new Date(year, month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : this.invalid();
  }

  override format(date: Date, displayFormat: object | string): string {
    if (displayFormat === 'clinicDate') {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }
    if (typeof displayFormat === 'string') throw new Error(`Unsupported date format: ${displayFormat}`);
    return super.format(date, displayFormat);
  }
}

@Component({
  selector: 'app-clinic-date-picker',
  template: `
    <div class="date-field">
      <input [matDatepicker]="picker" [ngModel]="date" (ngModelChange)="change($event)"
        [ngModelOptions]="{standalone: true}" [min]="minimum" [disabled]="disabled"
        (blur)="touched()" placeholder="DD/MM/YYYY" [attr.aria-label]="label" />
      <mat-datepicker-toggle [for]="picker" [disabled]="disabled" [aria-label]="'DATE_PICKER.OPEN' | translate"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .date-field { display: flex; align-items: center; border: 1px solid #cbd9df; border-radius: 8px; background: #fff; }
    input { box-sizing: border-box; flex: 1; width: 0; min-width: 0; min-height: 42px; padding: 10px; border: 0; background: transparent; color: #233747; font: inherit; }
    mat-datepicker-toggle { flex: 0 0 auto; color: #087ba2; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ClinicDatePickerComponent), multi: true },
    { provide: DateAdapter, useClass: ClinicDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: {
      parse: { dateInput: 'clinicDate' },
      display: { dateInput: 'clinicDate', monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' } }
    } }
  ]
})
export class ClinicDatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() set min(value: string | null) { this.minimum = this.fromIso(value); }
  date: Date | null = null;
  minimum: Date | null = null;
  disabled = false;
  private onChange: (value: string | null) => void = () => {};
  touched: () => void = () => {};

  writeValue(value: string | null): void { this.date = this.fromIso(value); }
  registerOnChange(fn: (value: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.touched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }

  change(date: Date | null): void {
    this.date = date;
    this.onChange(date && !Number.isNaN(date.getTime())
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : null);
  }

  private fromIso(value: string | null): Date | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(5, 7)) - 1;
    const day = Number(value.slice(8, 10));
    const date = new Date(year, month, day);
    return year >= 1000 && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
  }
}
