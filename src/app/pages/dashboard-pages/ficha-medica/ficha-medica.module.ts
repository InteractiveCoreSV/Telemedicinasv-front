import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FichaMedicaRoutingModule } from './ficha-medica-routing.module';
import { AllFichasMedicasComponent } from './all-fichas-medicas/all-fichas-medicas.component';
import { NewFichaMedicaComponent } from './new-ficha-medica/new-ficha-medica.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFichaMedicaComponent } from './custom-ficha-medica/custom-ficha-medica.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { ComponentsModule } from 'src/app/components/components.module';
import { DatePipe } from '@angular/common';  // Importar DatePipe


@NgModule({
  declarations: [
    AllFichasMedicasComponent,
    NewFichaMedicaComponent,
    CustomFichaMedicaComponent
  ],
  imports: [
    CommonModule,
    FichaMedicaRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgxMaskDirective
  ],
  providers: [DatePipe],  // Proveedor de DatePipe

})
export class FichaMedicaModule { }
