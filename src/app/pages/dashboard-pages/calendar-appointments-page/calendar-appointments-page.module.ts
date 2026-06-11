import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarAppointmentsPageRoutingModule } from './calendar-appointments-page-routing.module';
import { CalendarAppointmentsPageComponent } from './calendar-appointments-page.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CalendarAppointmentsPageComponent
  ],
  imports: [
    CommonModule,
    CalendarAppointmentsPageRoutingModule,
    FullCalendarModule,
    TooltipModule,
    NgxPermissionsModule,
    ComponentsModule,
    FormsModule
  ]
})
export class CalendarAppointmentsPageModule { }
