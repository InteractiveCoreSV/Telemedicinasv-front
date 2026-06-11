import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewSubsidiaryRoutingModule } from './new-subsidiary-routing.module';
import { NewSubsidiaryComponent } from './new-subsidiary.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SwiperModule } from 'swiper/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NewSubsidiaryComponent
  ],
  imports: [
    CommonModule,
    NewSubsidiaryRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    PipesModule,
    ComponentsModule
  ]
})
export class NewSubsidiaryModule { }
