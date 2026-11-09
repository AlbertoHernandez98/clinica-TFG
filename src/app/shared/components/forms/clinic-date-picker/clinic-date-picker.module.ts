import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicDatePickerComponent } from './clinic-date-picker.component';

@NgModule({
  declarations: [ClinicDatePickerComponent],
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, TranslateModule],
  exports: [ClinicDatePickerComponent]
})
export class ClinicDatePickerModule {}
