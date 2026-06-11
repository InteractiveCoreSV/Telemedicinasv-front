import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { ServiceI } from 'src/app/interfaces/service.interface';
import { UserI } from 'src/app/interfaces/user.interface';

export interface FormsNewAppointmentI{
  [formName:string]:UntypedFormGroup
}

@Injectable({
  providedIn: 'root'
})
export class NewAppointmentFormsService {

  forms:FormsNewAppointmentI = {};

  currentSlide:BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // currentExtraServices$:BehaviorSubject<ExtraServiceI[]> = new BehaviorSubject<ExtraServiceI[]>([]);

  totalAppointment$:BehaviorSubject<number> = new BehaviorSubject<number>(0);

  appointmentRegistered$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  remitida$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  medicoDisponible$:BehaviorSubject<UserI | null> = new BehaviorSubject<UserI | null>(null);

  appointmeRemision$:BehaviorSubject<AppointmentI | null> = new BehaviorSubject<AppointmentI | null>(null);

  constructor() { }

  reset(){
    this.forms = {};
    this.currentSlide.next(0);
    this.totalAppointment$.next(0);
    this.appointmentRegistered$.next(false);
    this.remitida$.next(false);
    this.medicoDisponible$.next(null);
    this.appointmeRemision$.next(null);
  }

  /**
   * Resets form3 fields downstream from the given step.
   * - 'all': resets subsidiary + service + medico + date/hour
   * - 'subsidiary': resets service + medico + date/hour (keeps subsidiary)
   * - 'service': resets medico + date/hour (keeps subsidiary + service)
   * - 'medico': resets date/hour only (keeps subsidiary + service + medico)
   */
  resetForm3From(from: 'all' | 'subsidiary' | 'service' | 'medico' = 'all'){
    const form3 = this.forms['form3'];
    if(!form3) return;

    if(from === 'all'){
      form3.get('subsidiary')?.setValue(null);
    }
    if(from === 'all' || from === 'subsidiary'){
      form3.get('service')?.setValue(null);
    }
    if(from === 'all' || from === 'subsidiary' || from === 'service'){
      form3.get('medico')?.setValue(null);
    }
    form3.get('date')?.setValue(null);
    form3.get('hour')?.setValue(null);
    form3.get('disabledDate')?.setValue(null);
    form3.get('dayAppointment')?.setValue(null);

    const preselectedMedico = this.medicoDisponible$.value;
    if(preselectedMedico){
      form3.get('medico')?.setValue(preselectedMedico);
      if(from === 'all'){
        form3.get('subsidiary')?.setValue(preselectedMedico.subsidiary ?? null);
      }
    }
  }

  getAllValuesFromForms(){
    let values:any = {};
    Object.keys(this.forms).forEach((key)=>{
      values[key] = this.forms[key].value;
    });

    return values;
  }

  getTotalByAppointment(service:ServiceI){
    let total = 0;

    total = service?.price || 0;

    return ((total.toFixed(2)) as any)*1;
  }
}
