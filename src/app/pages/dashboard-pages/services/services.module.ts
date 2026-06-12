import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { AllServicesComponent } from './all-services/all-services.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesComponent } from './categories/categories.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    ServicesComponent,
    AllServicesComponent,
    CategoriesComponent,
    SubCategoriesComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    PipesModule,
    NgbPaginationModule,
    NgbModule,
    ComponentsModule,
  ]
})
export class ServicesModule { }
