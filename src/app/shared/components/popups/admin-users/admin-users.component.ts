import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../services/config/config.service';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { Persona } from '../../../models/persona.interface';
import { CitasComponent } from '../citas/citas.component';

interface AdminUsersData { patientAppointments?: boolean; }
interface SessionStaff { idPersona: number; nombre: string; apellidos: string; idRolNativo: number; }

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  buttonDisabled: boolean = true;
  userList: Persona[] = [];
  loading = false;
  loadError = false;
  private allUsers: Persona[] = [];
  private destroy$ = new Subject<void>();
  staff?: SessionStaff;

  form = this.formBuilder.group({
    nombre: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<AdminUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminUsersData,
    public formBuilder: FormBuilder,
    public matDialog: MatDialog,
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  success = './assets/icons/svg/icon-save.svg';
  error = './assets/icons/svg/icon-close.svg';


  ngOnInit(): void {
    this.filtrarLista();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private chargeList() {
    const url = this.configService.getApiUrl('/persona');
    this.loading = true;
    this.loadError = false;

    const request = forkJoin({ users: this.http.get<Persona[]>(url), staff: this.http.get<SessionStaff>(this.configService.getApiUrl('/auth/me')) });
    request.pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        if (![1, 2, 3].includes(result.staff.idRolNativo)) {
          this.loading = false;
          this.loadError = true;
          console.error('La sesión no tiene permiso para administrar usuarios.');
          return;
        }
        this.staff = result.staff;
        this.allUsers = result.users.filter(user =>
          this.data.patientAppointments ? user.idRolNativo === 4 :
          result.staff.idRolNativo === 1 ||
          (result.staff.idRolNativo === 2 && (user.idRolNativo === 4 || user.idPersona === result.staff.idPersona)) ||
          (result.staff.idRolNativo === 3 && [2, 4].includes(user.idRolNativo))
        );
        this.applyFilter();
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.allUsers = [];
        this.userList = [];
        this.loading = false;
        this.loadError = true;
      }
    );
  }

  public filtrarLista() {
    this.chargeList();

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilter());
  }

  private applyFilter(): void {
    const textoBuscado = (this.form.controls.nombre.value || '').toUpperCase();
    this.userList = this.allUsers.filter(usuario =>
      `${usuario.nombre} ${usuario.apellidos}`.toUpperCase().includes(textoBuscado)
    );
  }

  public async userDetail(user?: Persona) {
    if (this.data.patientAppointments) {
      if (!user || !this.staff) return;
      this.matDialog.open(CitasComponent, {
        data: { selectedUser: user },
        width: '500px', maxWidth: '95vw'
      });
      return;
    }
    if (!this.staff) return;
    const dialog = this.matDialog.open(UserDetailComponent, {
      data: { selectedUser: user, staff: this.staff },
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
