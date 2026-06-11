import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUsersPipe } from './search-users.pipe';
import { ParseStatusPipe } from './parse-status.pipe';
import { ParseDateCreateOfferPipe } from './parse-date-create-job.pipe';
import { ParseVerifiedPipe } from './parse-verification.pipe';
import { GetFisrtWordPipe } from './get-fisrt-word.pipe';
import {  SpanStatusPipe } from './span-status.pipe';
import { ConvertToBase64Pipe } from './convert-to-base64.pipe';
import { OrderHoursPipe } from './order-hours.pipe';
import { ParseDay } from './parse-day.pipe';
import { OrderAppointmentsByHourPipe } from './order-appointments-by-hour.pipe';
import { CalcDateCancelPipe } from './calc-date-cancel.pipe';
import { ParseTypePaymentPipe } from './parse-type-payment.pipe';
import { ParseStatusNamePipe } from './parse-status-name.pipe';
import { ParseUrgencyPipe } from './parse-urgency.pipe';
import { VerifyHourDayPipe } from './verify-new-hour.pipe';
import { ParseAllDay } from './parse-all-day.pipe';
import { ParseStatusSolicitudMedicoPipe } from './parse-status-solicitud-medico.pipe';
import { ParseStatusMedicoPipe } from './parse-status-medico.pipe';
import { CheckedServicePipe } from './checked-service.pipe';
import { CalcYearsOfPracticePipe } from './calc-years-of-practice.pipe';
import { MedicoScorePipe } from './medico-score.pipe';
import { DollarPipe } from './dollar.pipe';

const listPipes = [
  SearchUsersPipe,
  ParseStatusPipe,
  ParseDateCreateOfferPipe,
  ParseVerifiedPipe,
  GetFisrtWordPipe,
  SpanStatusPipe,
  ConvertToBase64Pipe,
  OrderHoursPipe,
  ParseDay,
  OrderAppointmentsByHourPipe,
  CalcDateCancelPipe,
  ParseTypePaymentPipe,
  ParseStatusNamePipe,
  ParseUrgencyPipe,
  VerifyHourDayPipe,
  ParseAllDay,
  ParseStatusSolicitudMedicoPipe,
  ParseStatusMedicoPipe,
  CheckedServicePipe,
  CalcYearsOfPracticePipe,
  MedicoScorePipe,
  DollarPipe
]

@NgModule({
  declarations: [
    listPipes
  ],
  imports: [
    CommonModule
  ],
  exports:[
    listPipes
  ]
})
export class PipesModule { }
