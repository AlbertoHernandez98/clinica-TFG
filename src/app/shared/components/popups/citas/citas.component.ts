import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
})
export class CitasComponent implements OnInit {
  buttonDisabled: boolean = true;
  userList: any[] = [];

  form = this.formBuilder.group({
    nombre: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<AdminUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private translate: TranslateService
  ) {}

  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';
  user: any;

  ngOnInit(): void {
    this.filtrarLista();
    this.user = this.data.selectedUser;
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
      });
  }

  public filtrarLista() {
    this.chargeList();

    this.form.valueChanges.subscribe((user) => {
      var textoBuscado = user.nombre.toUpperCase();
      const textoElemento = this.userList.filter((usuario) =>
        usuario.username.toUpperCase().includes(textoBuscado)
      );
      this.userList = textoElemento;

      if (textoBuscado === '') {
        this.chargeList();
      }
    });
  }

  close(user?: any) {
    if (user) {
      this.dialogRef.close(user);
    } else {
      this.dialogRef.close();
    }
  }
}
