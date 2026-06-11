import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarAppointmentsPageComponent } from './calendar-appointments-page.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title:'Calendario',
      breadcrumb:
        {
          title:'Calendario',
          url:'/dashboard/calendar'
        }
    },
    component:CalendarAppointmentsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarAppointmentsPageRoutingModule { }
