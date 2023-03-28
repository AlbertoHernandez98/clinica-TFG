import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-diabetico',
  templateUrl: './pie-diabetico.component.html',
  styleUrls: ['./pie-diabetico.component.scss']
})
export class PieDiabeticoComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

 

  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }

}
