import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicio-domicilio',
  templateUrl: './servicio-domicilio.component.html',
  styleUrls: ['./servicio-domicilio.component.scss']
})
export class ServicioDomicilioComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }
}
