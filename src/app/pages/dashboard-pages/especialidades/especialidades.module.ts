import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspecialidadesRoutingModule } from './especialidades-routing.module';
import { EspecialidadesComponent } from './especialidades.component';
import { NewEspecialidadComponent } from './modals/new-especialidad/new-especialidad.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EspecialidadesComponent,
    NewEspecialidadComponent
  ],
  imports: [
    CommonModule,
    EspecialidadesRoutingModule,
    PipesModule,
    NgbPaginationModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class EspecialidadesModule { }
