import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent{

  @Input() title = '';
  @Input() idCard = '';
  @Input() isCollapsed = false;
  @Input() isCollapsible = true;

  saveIcon = '../../../../assets/icons/svg/Icon_save.svg';
  informationIcon = '../../../../assets/icons/svg/info_white.svg';
  collapseDownIcon = '../../../../../assets/icons/flecha_abajo.svg';
  collapseUpIcon = '../../../../../assets/icons/flecha_arriba.svg';

  constructor() {}


}
