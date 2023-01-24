import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicaComponent } from './clinica.component';

const routes: Routes = [{ path: '', component: ClinicaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicaRoutingModule {}
