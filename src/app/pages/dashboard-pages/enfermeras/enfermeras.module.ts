import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnfermerasRoutingModule } from './enfermeras-routing.module';
import { CreateNurseComponent } from './create-nurse/create-nurse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { EnfermerasComponent } from './enfermeras.component';
import { ViewNursesComponent } from './view-nurses/view-nurses.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    CreateNurseComponent,
    EnfermerasComponent,
    ViewNursesComponent
  ],
  imports: [
    CommonModule,
    EnfermerasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    NgbModule,
    NgxMaskDirective,
    NgxPermissionsModule
  ]
})
export class EnfermerasModule { }
