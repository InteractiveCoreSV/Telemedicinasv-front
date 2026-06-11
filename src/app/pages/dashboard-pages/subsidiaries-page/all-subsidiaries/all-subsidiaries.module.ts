import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllSubsidiariesRoutingModule } from './all-subsidiaries-routing.module';
import { AllSubsidiariesComponent } from './all-subsidiaries.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    AllSubsidiariesComponent
  ],
  imports: [
    CommonModule,
    AllSubsidiariesRoutingModule,
    ComponentsModule,
    NgbPaginationModule,
    PipesModule
  ]
})
export class AllSubsidiariesModule { }
