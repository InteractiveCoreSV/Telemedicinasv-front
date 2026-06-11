import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsPageRoutingModule } from './appointments-page-routing.module';
import { AppointmentsPageComponent } from './appointments-page.component';
import { AllAppointmentsPageComponent } from './all-appointments-page/all-appointments-page.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  declarations: [
    AppointmentsPageComponent,
    AllAppointmentsPageComponent,
  ],
  imports: [
    CommonModule,
    AppointmentsPageRoutingModule,
    ComponentsModule,
    PipesModule,
    NgbPaginationModule,
    FormsModule,
    NgxPermissionsModule,
    FlatpickrModule,
    DirectivesModule,
    NgbModule
  ]
})
export class AppointmentsPageModule { }
