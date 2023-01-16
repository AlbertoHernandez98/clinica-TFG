import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-success',
  templateUrl: './error-success.component.html',
  styleUrls: ['./error-success.component.scss']
})
export class ErrorSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close('Thanks for using me!');
  }
}
