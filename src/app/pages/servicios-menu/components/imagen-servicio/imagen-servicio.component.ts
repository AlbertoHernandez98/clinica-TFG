import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-imagen-servicio',
  template: '<img [src]="src" [alt]="alt">',
  styleUrls: ['./imagen-servicio.component.scss']
})
export class ImagenServicioComponent {
  @Input() src = '';
  @Input() alt = '';
}
