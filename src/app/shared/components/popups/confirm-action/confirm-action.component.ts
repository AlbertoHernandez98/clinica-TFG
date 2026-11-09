import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmActionData {
  title: string;
  message: string;
  params?: Record<string, string>;
}

@Component({
  selector: 'app-confirm-action',
  template: `
    <h2 class="title">{{ data.title | translate }}</h2>
    <p class="message">{{ data.message | translate:data.params }}</p>
    <div class="actions">
      <button type="button" class="cancel" cdkFocusInitial (click)="dialogRef.close(false)">
        {{ 'CONFIRM_ACTION.CANCEL' | translate }}
      </button>
      <button type="button" class="confirm" (click)="dialogRef.close(true)">
        {{ 'CONFIRM_ACTION.CONFIRM' | translate }}
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; color: #233747; font-family: Karla, Arial, sans-serif; }
    .title { margin: 0; font-size: 22px; font-weight: 700; }
    .message { margin: 16px 0 24px; line-height: 1.5; }
    .actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; }
    button { min-height: 44px; padding: 10px 18px; border-radius: 8px; font: inherit; font-weight: 700; cursor: pointer; }
    .cancel { border: 1px solid #cbd9df; background: #fff; color: #233747; }
    .confirm { border: 1px solid #a63c3c; background: #a63c3c; color: #fff; }
    button:focus-visible { outline: 2px solid #087ba2; outline-offset: 2px; }
  `]
})
export class ConfirmActionComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmActionData
  ) {}
}
