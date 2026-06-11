import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StadisticsPageRoutingModule } from './stadistics-page-routing.module';
import { StadisticsPageComponent } from './stadistics-page.component';

import { ComponentsModule } from 'src/app/components/components.module';
import { PatientsRegisterComponent } from './patients-register/patients-register.component';
import { PatientRetentionRateComponent } from './patient-retention-rate/patient-retention-rate.component';
import { ForAppointmentsStatusComponent } from './for-appointments-status/for-appointments-status.component';
import { TotalSaleForTypeAppointmentComponent } from './total-sale-for-type-appointment/total-sale-for-type-appointment.component';
import { CanceledAppointmentsComponent } from './canceled-appointments/canceled-appointments.component';
import { DailyAppointmentReportComponent } from './daily-appointment-report/daily-appointment-report.component';
import { AverageConsultationTimeComponent } from './average-consultation-time/average-consultation-time.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ReporteDiarioCitasSucursalComponent } from './reporte-diario-citas-sucursal/reporte-diario-citas-sucursal.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { ReportProcessMedicoComponent } from './report-process-medico/report-process-medico.component';
import { ReportPatientsInFollowUpComponent } from './report-patients-in-follow-up/report-patients-in-follow-up.component';
import { ReportPatientByDoctorComponent } from './report-patient-by-doctor/report-patient-by-doctor.component';
import { ReportMotivoCancelacionAppointmentComponent } from './report-motivo-cancelacion-appointment/report-motivo-cancelacion-appointment.component';
import { ReportForSurveyComponent } from './report-for-survey/report-for-survey.component';
import { ReportFavoriteMedicoComponent } from './report-favorite-medico/report-favorite-medico.component';
import { ReportDoctorsByRatingComponent } from './report-doctors-by-rating/report-doctors-by-rating.component';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    StadisticsPageComponent,
    PatientsRegisterComponent,
    PatientRetentionRateComponent,
    ForAppointmentsStatusComponent,
    TotalSaleForTypeAppointmentComponent,
    CanceledAppointmentsComponent,
    DailyAppointmentReportComponent,
    AverageConsultationTimeComponent,
    ReporteDiarioCitasSucursalComponent,
    ReportProcessMedicoComponent,
    ReportPatientsInFollowUpComponent,
    ReportPatientByDoctorComponent,
    ReportMotivoCancelacionAppointmentComponent,
    ReportForSurveyComponent,
    ReportFavoriteMedicoComponent,
    ReportDoctorsByRatingComponent
  ],
  imports: [
    CommonModule,
    StadisticsPageRoutingModule,
    ComponentsModule,
    NgxPermissionsModule,
    DirectivesModule,
    FlatpickrModule,
    FormsModule,
    PipesModule
  ]
})
export class StadisticsPageModule { }
