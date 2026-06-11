import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoConferenciaRoutingModule } from './video-conferencia-routing.module';
import { VideoConferenciaComponent } from './video-conferencia.component';
import { AllVideoConferenciasComponent } from './all-video-conferencias/all-video-conferencias.component';
import { NewVideoConferenciaComponent } from './new-video-conferencia/new-video-conferencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    VideoConferenciaComponent,
    AllVideoConferenciasComponent,
    NewVideoConferenciaComponent
  ],
  imports: [
    CommonModule,
    VideoConferenciaRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    FormsModule,
    NgbPaginationModule
  ]
})
export class VideoConferenciaModule { }
