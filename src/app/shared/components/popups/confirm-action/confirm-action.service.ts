import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmActionComponent, ConfirmActionData } from './confirm-action.component';

@Injectable({ providedIn: 'root' })
export class ConfirmActionService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  confirm(data: ConfirmActionData): Observable<boolean> {
    return this.dialog.open(ConfirmActionComponent, {
      data,
      width: '420px',
      maxWidth: '95vw',
      ariaLabel: this.translate.instant(data.title),
      autoFocus: true
    }).afterClosed().pipe(map(result => result === true));
  }
}
