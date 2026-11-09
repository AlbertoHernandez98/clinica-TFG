import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../../services/config/config.service';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { getSessionUser } from 'src/app/shared/classes/session-user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmActionService } from '../confirm-action/confirm-action.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnDestroy {
  public static readonly id = 'change-password';
  submitting = false;
  private readonly destroyed = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private http: HttpClient,
    private translate: TranslateService,
    private configService: ConfigService,
    private confirmAction: ConfirmActionService
  ) {}

  form = this.formBuilder.group({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    newPasswordSecure: new FormControl('', Validators.required),
  });

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';


  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }


  comparePasswords() {
    const actual = this.form.controls.password.value;
    const nueva = this.form.controls.newPassword.value;
    if (actual !== '' && nueva !== '') {
      const notEqual =
        this.form.controls.password.value ===
        this.form.controls.newPassword.value;

      return notEqual;
    }
    return;
  }

  equalPasswords() {
    const nueva = this.form.controls.newPassword.value;
    const repite = this.form.controls.newPasswordSecure.value;
    if (nueva !== '' && repite !== '') {
      const notEqual =
        this.form.controls.newPassword.value !==
        this.form.controls.newPasswordSecure.value;
      return notEqual;
    }
    return;
  }

  onSubmit() {
    const dni = getSessionUser();
    if (!dni || this.form.invalid || this.comparePasswords() || this.equalPasswords() || this.submitting) {
      this.form.markAllAsTouched();
      if (!dni) {
        this.matDialog.open(ErrorSuccessComponent, {
          data: {
            text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
            buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
          },
        });
      }
      return;
    }

    this.submitting = true;
    const payload = {
      dni,
      password: this.form.controls.password.value,
      newPassword: this.form.controls.newPassword.value,
    };
    this.confirmAction.confirm({
      title: 'CONFIRM_ACTION.CHANGE_PASSWORD_TITLE',
      message: 'CONFIRM_ACTION.CHANGE_PASSWORD'
    }).pipe(takeUntil(this.destroyed)).subscribe(confirmed => {
      if (!confirmed) { this.submitting = false; return; }
      this.http.put(this.configService.getApiUrl('/persona/changePassword'), payload).subscribe({
        next: () => {
          this.submitting = false;
          this.matDialog.open(ErrorSuccessComponent, {
            data: {
              icon: this.success,
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.SUCCESS'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
          this.dialogRef.close();
        },
        error: error => {
          this.submitting = false;
          console.error('Error al cambiar la contraseña:', error);
          this.matDialog.open(ErrorSuccessComponent, {
            data: {
              text: this.translate.instant('SHARED.POPUPS.CHANGE_PASSWORD.ERROR'),
              buttonLabel: this.translate.instant('LOGIN.POPUP_BUTTON_LABEL'),
            },
          });
        }
      });
    });
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }

  close() {
    this.dialogRef.close();
  }
}
