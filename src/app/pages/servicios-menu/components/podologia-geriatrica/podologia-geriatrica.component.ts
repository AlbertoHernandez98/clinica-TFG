import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-podologia-geriatrica',
  templateUrl: './podologia-geriatrica.component.html',
  styleUrls: ['./podologia-geriatrica.component.scss']
})
export class PodologiaGeriatricaComponent implements OnInit {
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  volver() {
    this.router.navigateByUrl('/serviciosMenu')
  }

}
