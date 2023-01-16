import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAComponent } from './personal-a/personal-a.component';
import { PersonalComponent } from './personal.component';



const routes: Routes = [
    { path: '', component: PersonalComponent },
    { path: 'personalA', component: PersonalAComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonalRoutingModule { }
