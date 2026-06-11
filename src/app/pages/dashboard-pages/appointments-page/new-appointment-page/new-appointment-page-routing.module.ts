import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAppointmentPageComponent } from './new-appointment-page.component';

const routes: Routes = [
  {
    path:'',
    component:NewAppointmentPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewAppointmentPageRoutingModule { }
