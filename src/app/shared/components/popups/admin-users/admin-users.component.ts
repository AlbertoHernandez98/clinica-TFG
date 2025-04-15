import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ErrorSuccessComponent } from '../error-success/error-success.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  buttonDisabled: boolean = true;
  userList: any[] = [];

  form = this.formBuilder.group({
    nombre: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<AdminUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService
  ) { }


  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';


  ngOnInit(): void {
    this.filtrarLista();
  }

  private chargeList() {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = 'http://localhost:8080/persona';

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        try {
          this.userList = JSON.parse(data);

        } catch (error) {
          console.error('Error al analizar la respuesta JSON:', error);
        }
      })
  }

  public filtrarLista() {
    this.chargeList();

    this.form.valueChanges.subscribe(user => {      
      var textoBuscado = user.nombre.toUpperCase();
      const textoElemento = this.userList.filter((usuario) => usuario.username.toUpperCase().includes(textoBuscado));
      this.userList = textoElemento;

      if (textoBuscado === '') {
        this.chargeList();
      }
    });
  }

  public async userDetail(user?: any) {
    const dialog = this.matDialog.open(UserDetailComponent, {
      data: { selectedUser: user },
      width: '600px'
    });
    dialog.afterClosed().subscribe(() => {
      if (window.location.href.includes('historial')) {
        this.dialogRef.close();
      }
      this.chargeList();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
