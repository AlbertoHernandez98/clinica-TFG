import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractFormCommon, generarProviderFormulario } from '../abstract-form-common';

@Component({
  selector: 'app-input-text-v2',
  templateUrl: './input-text-v2.component.html',
  styleUrls: ['./input-text-v2.component.scss'],
  providers: [generarProviderFormulario(InputTextV2Component)]
})
export class InputTextV2Component extends AbstractFormCommon implements OnInit, OnDestroy {
  @Input() type = 'text'; // Puede ser de tipo 'password', 'email', 'number', etc

  modoSelectorDeColor = false; // Flag que indica si el input es de tipo colorPicker

  constructor(
    protected override translateService: TranslateService,
    private renderer2: Renderer2
    ) {
    super(translateService); // Pasarle a AbstractFormCommonV2 los providers que necesite
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }



  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  inputHaCambiado(value: any): void {


    let valueAux;
    if (this.type === 'number') {
      valueAux = isNaN(value.target.valueAsNumber) ? 0 : value.target.valueAsNumber;
    } else {
      valueAux = value.target.value;
    }

    this.onChange(valueAux);
    this.onTouched();
  }


}
