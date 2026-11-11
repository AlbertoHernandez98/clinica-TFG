import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/config/config.service';

interface AuditEvent {
  idAuditoria: string;
  fecha: string;
  idUsuario: number;
  rolUsuario: number;
  operacion: 'CONSULTA' | 'ALTA' | 'EDICION' | 'ANULACION';
  resultado: 'PERMITIDO' | 'DENEGADO';
  idPaciente: number | null;
  idHistorialClinico: number | null;
}

@Component({
  selector: 'app-auditoria-historial',
  templateUrl: './auditoria-historial.component.html',
  styleUrls: ['./auditoria-historial.component.scss']
})
export class AuditoriaHistorialComponent implements OnInit {
  events: AuditEvent[] = [];
  cursor: string | null = null;
  loading = false;
  error = false;

  constructor(
    private readonly http: HttpClient,
    private readonly config: ConfigService,
    public readonly dialog: MatDialogRef<AuditoriaHistorialComponent>
  ) {}

  ngOnInit(): void { this.load(); }

  load(more = false): void {
    if (this.loading || (more && !this.cursor)) return;
    this.loading = true;
    this.error = false;
    const params = more && this.cursor ? new HttpParams().set('antes', this.cursor) : new HttpParams();
    this.http.get<{ eventos: AuditEvent[]; siguiente: string | null }>(
      this.config.getApiUrl('/historialclinico/auditoria'), { params }
    ).subscribe({
      next: result => {
        this.events = more ? [...this.events, ...result.eventos] : result.eventos;
        this.cursor = result.siguiente;
        this.loading = false;
      },
      error: error => {
        console.error('Error al consultar la auditoría:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
