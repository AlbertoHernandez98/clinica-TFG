import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cirugia-osea',
  templateUrl: './cirugia-osea.component.html',
  styleUrls: ['./cirugia-osea.component.scss']
})
export class CirugiaOseaComponent implements OnInit {

  constructor(
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  
  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }

}
