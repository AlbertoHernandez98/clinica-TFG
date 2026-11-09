import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { forkJoin, Observable, Subject } from 'rxjs';
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

    const request: Observable<Persona[] | { users: Persona[]; staff: SessionStaff }> = this.data.patientAppointments
      ? forkJoin({ users: this.http.get<Persona[]>(url), staff: this.http.get<SessionStaff>(this.configService.getApiUrl('/auth/me')) })
      : this.http.get<Persona[]>(url);
    request.pipe(takeUntil(this.destroy$)).subscribe(
      result => {
        if (Array.isArray(result)) {
          this.allUsers = result;
        } else {
          if (![1, 2, 3].includes(result.staff.idRolNativo)) {
            this.loading = false;
            this.loadError = true;
            console.error('La sesión no tiene permiso para administrar citas.');
            return;
          }
          this.staff = result.staff;
          this.allUsers = result.users.filter(user => user.idRolNativo === 4);
        }
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

  createPatient(): void {
    if (!this.data.patientAppointments || !this.staff || ![1, 2, 3].includes(this.staff.idRolNativo)) return;
    const dialog = this.matDialog.open(UserDetailComponent, {
      data: { patientOnly: true },
      width: '600px', maxWidth: '95vw'
    });
    dialog.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(created => {
      if (created) this.chargeList();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
