import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicosRoutingModule } from './medicos-routing.module';
import { MedicosComponent } from './medicos.component';
import { AllMedicosComponent } from './all-medicos/all-medicos.component';
import { NewMedicoComponent } from './new-medico/new-medico.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxMaskDirective } from 'ngx-mask';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AllMedicoSolicitudComponent } from './all-medico-solicitud/all-medico-solicitud.component';
import { NewMedicoSolicitudComponent } from './new-medico-solicitud/new-medico-solicitud.component';
import { MedicosInLineComponent } from './medicos-in-line/medicos-in-line.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';


@NgModule({
  declarations: [
    MedicosComponent,
    AllMedicosComponent,
    NewMedicoComponent,
    AllMedicoSolicitudComponent,
    NewMedicoSolicitudComponent,
    MedicosInLineComponent
  ],
  imports: [
    CommonModule,
    MedicosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    NgxMaskDirective,
    NgbPaginationModule,
    NgbModule,
    PipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class MedicosModule { }
