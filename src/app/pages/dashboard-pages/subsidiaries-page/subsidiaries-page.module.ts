import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubsidiariesPageRoutingModule } from './subsidiaries-page-routing.module';
import { SubsidiariesPageComponent } from './subsidiaries-page.component';


@NgModule({
  declarations: [
    SubsidiariesPageComponent
  ],
  imports: [
    CommonModule,
    SubsidiariesPageRoutingModule
  ]
})
export class SubsidiariesPageModule { }
