import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb } from './models/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
