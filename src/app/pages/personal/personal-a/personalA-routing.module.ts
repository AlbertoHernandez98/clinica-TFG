import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAComponent } from './personal-a.component';


const routes: Routes = [
    { path: '', component: PersonalAComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonalARoutingModule { }
