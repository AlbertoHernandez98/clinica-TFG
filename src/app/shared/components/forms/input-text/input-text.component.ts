import { Component, Input } from '@angular/core';
import {
  AbstractValueAccessor,
  MakeProvider
} from '../abstract-value-accessor';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [MakeProvider(InputTextComponent)]
})
export class InputTextComponent extends AbstractValueAccessor {
  @Input() label: any = 'Label Name';
  //propiedad obligatoria si se quiere cambiar de color
  @Input() idColorBall = '';
  @Input() setValue = '';
  @Input() placeholder = '';
  @Input() alert = 'Invalid field';
  @Input() inputStyle = '';
  @Input() secondary = '';
  @Input() invalid = false;
  @Input() colorPicker = false;
  @Input() disabled = false;
  @Input() required = false;

  colorSelected = '';

  constructor() {
    super();
  }

  onInput(value: string) {
    this.value = value;
    this.onTouched();
    this.onChange(this.value);
  }
}
