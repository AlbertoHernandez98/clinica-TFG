import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/providers/usuario';

@Component({
  selector: 'app-reserva-cita-child',
  templateUrl: './reserva-cita-child.component.html',
  styleUrls: ['./reserva-cita-child.component.scss']
})
export class ReservaCitaChildComponent implements OnInit {
  @Output() formReserva: EventEmitter<FormGroup> = new EventEmitter();


  form;
  intentoGuardar: boolean = false;
  tabBarElement: any;
  goToRoot: boolean = true;



  constructor(
    public router:Router,
    public formBuilder: FormBuilder,
    public usuario: Usuario
  ) {


    this.form = formBuilder.group({
      nombre: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      apellidos: ['', Validators.compose([Validators.required])],
      telefono: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(9)])],
      email:['']
    })

   }

  ngOnInit() {
    this.changesForm();
  }

  getTouchedAndError(key: string) {
    return this.form.get(key)?.touched && this.form.get(key)?.errors?.required;
  }

  changesForm() {
    this.form.valueChanges.subscribe((res) => {
      console.log(res);
      this.formReserva.emit(this.form);
    });
  }
}
