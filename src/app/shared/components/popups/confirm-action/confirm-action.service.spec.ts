import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ConfirmActionComponent } from './confirm-action.component';
import { ConfirmActionService } from './confirm-action.service';

describe('ConfirmActionService', () => {
  let dialog: jasmine.SpyObj<MatDialog>;
  let service: ConfirmActionService;
  const data = { title: 'TITLE', message: 'MESSAGE' };

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ConfirmActionService,
        { provide: MatDialog, useValue: dialog },
        { provide: TranslateService, useValue: { instant: () => 'Confirm action' } }
      ]
    });
    service = TestBed.inject(ConfirmActionService);
  });

  it('only accepts an explicit confirmation', () => {
    for (const result of [false, undefined, true]) {
      const ref = jasmine.createSpyObj<MatDialogRef<ConfirmActionComponent>>('MatDialogRef', ['afterClosed']);
      ref.afterClosed.and.returnValue(of(result));
      dialog.open.and.returnValue(ref);
      let accepted: boolean | undefined;
      service.confirm(data).subscribe(value => accepted = value);
      expect(accepted).toBe(result === true);
      expect(dialog.open).toHaveBeenCalledWith(ConfirmActionComponent, jasmine.objectContaining({
        data, ariaLabel: 'Confirm action'
      }));
    }
  });
});
