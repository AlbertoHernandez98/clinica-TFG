import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoDataService } from 'src/app/providers/mocked-services/logo-data.service';
import { DragAndDropComponent, DragDropOutput } from '../popups/drag-and-drop/drag-and-drop.component';


@Component({
  selector: 'app-card-img',
  templateUrl: './card-img.component.html',
  styleUrls: ['./card-img.component.scss'],
})
export class CardImgComponent implements OnInit {
  @Input() size: string = '';
  @Input() dimensiones: string = '';

  @Output() messageEmitter: EventEmitter<string> = new EventEmitter();

  imagenSelec = null; // Almacena datos de la imagen seleccionada

  nombre= '';
  file: any;


  constructor(
    public matDialog: MatDialog,
    public logoDataService: LogoDataService,

  ) { }

  ngOnInit() {
    this.getFileName();
  }

  getFileName() {
    this.logoDataService.$logos.subscribe((res) => {
      console.log(res[0]);
      this.file = res[0];
      this.nombre = res[0]?.name;
      this.messageEmitter.emit(this.nombre);
    });
  }

  abrirSelectorImagen(): void {
    const dialog = this.matDialog.open(DragAndDropComponent, {
      data: {
        title: 'titulo',
        buttonLabel: 'buttonLabel',
        edit: true
      }
    });

    dialog.afterClosed().subscribe((res: DragDropOutput) => {
      if (!res) {
        // Se ha pulsado el botón de cerrar del modal
        return;
      }
      if (res?.btnDelete) {
        // Se ha pulsado el botón de eliminar del modal.
        this.imagenSelec = null;
        // this.value = null;
        // this.onChange(null);
        // this.onTouched();
        return;
      }
    });
  }
}