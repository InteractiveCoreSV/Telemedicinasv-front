import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { InsuranceComponent } from './insurance.component';
import { NewInsuranceComponent } from './new-insurance/new-insurance.component';
import { AllInsurersComponent } from './all-insurers/all-insurers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InsuranceComponent,
    NewInsuranceComponent,
    AllInsurersComponent
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    ComponentsModule,
    NgbPaginationModule
  ]
})
export class InsuranceModule { }
