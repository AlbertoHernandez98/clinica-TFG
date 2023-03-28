import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-podologia-infantil',
  templateUrl: './podologia-infantil.component.html',
  styleUrls: ['./podologia-infantil.component.scss']
})
export class PodologiaInfantilComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

 

  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }
}
