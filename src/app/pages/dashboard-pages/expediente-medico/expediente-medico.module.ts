import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ExpedienteMedicoRoutingModule } from './expediente-medico-routing.module';
import { ExpedienteMedicoComponent } from './expediente-medico.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { DetalleExpedienteComponent } from './detalle-expediente/detalle-expediente.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    ExpedienteMedicoComponent,
    PacientesComponent,
    DetalleExpedienteComponent
  ],
  imports: [
    CommonModule,
    ExpedienteMedicoRoutingModule,
    ComponentsModule,
    NgxDocViewerModule,
    NgbPaginationModule,
    DirectivesModule,
    NgbModule,
    FormsModule,
    NgxPermissionsModule
  ],
  providers: [DatePipe],  // Proveedor de DatePipe

})
export class ExpedienteMedicoModule { }
