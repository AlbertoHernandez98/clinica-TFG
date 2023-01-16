import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-base',
  templateUrl: './button-base.component.html',
  styleUrls: ['./button-base.component.scss']
})
export class ButtonBaseComponent implements OnInit {
  @Input() label = 'Button text';
  @Input() btnStyle = '';
  @Input() disabled = false;
  @Input() btnSrc = '';

  constructor() { }

  ngOnInit(): void {
  }

}
