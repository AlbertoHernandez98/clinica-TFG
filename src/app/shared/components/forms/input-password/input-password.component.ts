import { Component, Input } from '@angular/core';
import {
  AbstractValueAccessor,
  MakeProvider
} from '../abstract-value-accessor';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [MakeProvider(InputPasswordComponent)]
})
export class InputPasswordComponent extends AbstractValueAccessor {
  @Input() label = 'Label Name';
  @Input() placeholder = 'Placeholder text';
  @Input() alert = 'Invalid field';

  isHidden!: boolean;
  mapfreImg = '../../../assets/images/AF_Logo_MAPFRE_desktop.png';

  constructor() {
    super();
  }

  onInput(value: string) {
    this.value = value;
    this.onTouched();
    this.onChange(this.value);
  }
}
