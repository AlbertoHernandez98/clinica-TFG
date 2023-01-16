import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessMenuComponent } from './access-menu.component';

const routes: Routes = [{ path: '', component: AccessMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessMenuRoutingModule {}
