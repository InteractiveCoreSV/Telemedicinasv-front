import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewAppointmentPageRoutingModule } from './new-appointment-page-routing.module';
import { NewAppointmentPageComponent } from './new-appointment-page.component';
import { Form1NewAppointmentComponent } from './form1-new-appointment/form1-new-appointment.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Form2NewAppointmentComponent } from './form2-new-appointment/form2-new-appointment.component';
import { Form3NewAppointmentComponent } from './form3-new-appointment/form3-new-appointment.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Form4NewAppointmentComponent } from './form4-new-appointment/form4-new-appointment.component';
import { Form5NewAppointmentComponent } from './form5-new-appointment/form5-new-appointment.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxMaskDirective } from 'ngx-mask';
import { FormNewAppointmentComponent } from './form-new-appointment/form-new-appointment.component';
import { SelectSubsidiaryModalComponent } from './select-subsidiary-modal/select-subsidiary-modal.component';
import { SelectServiceModalComponent } from './select-service-modal/select-service-modal.component';
import { SelectMedicoModalComponent } from './select-medico-modal/select-medico-modal.component';
import { SelectDateAndHourModalComponent } from './select-date-and-hour-modal/select-date-and-hour-modal.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
  declarations: [
    NewAppointmentPageComponent,
    FormNewAppointmentComponent,
    Form1NewAppointmentComponent,
    Form2NewAppointmentComponent,
    Form3NewAppointmentComponent,
    Form4NewAppointmentComponent,
    Form5NewAppointmentComponent,
    SelectSubsidiaryModalComponent,
    SelectServiceModalComponent,
    SelectMedicoModalComponent,
    SelectDateAndHourModalComponent,

  ],
  imports: [
    CommonModule,
    NewAppointmentPageRoutingModule,
    CdkStepperModule,
    NgStepperModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PipesModule,
    // NgCreditCardModule,
    NgxMaskDirective,
    NgxPermissionsModule,
    NgbModule,
    AutocompleteLibModule,
    CreditCardDirectivesModule
  ],
  exports:[
    NewAppointmentPageComponent
  ]
})
export class NewAppointmentPageModule { }
