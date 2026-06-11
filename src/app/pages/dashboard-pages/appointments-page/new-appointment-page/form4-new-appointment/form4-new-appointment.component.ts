import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsNewAppointmentI, NewAppointmentFormsService } from '../new-appointment-forms.service';
import { Subscription, finalize } from 'rxjs';
import { CategoryServiceI, ServiceI } from 'src/app/interfaces/service.interface';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserI } from 'src/app/interfaces/user.interface';
import { VideoConferenciaI } from 'src/app/interfaces/video-conferencia.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments.service';


@Component({
  selector: 'app-form4-new-appointment',
  templateUrl: './form4-new-appointment.component.html',
  styles: [
  ]
})
export class Form4NewAppointmentComponent implements OnInit, OnDestroy {
  form!:FormGroup;
  form1!:FormGroup;
  form2!:FormGroup;
  form3!:FormGroup;

  forms!:FormsNewAppointmentI;

  subs:Subscription = new Subscription();

  // * Valores para hacer el resumen
  formValues?:{
    typeAppoinment?:CategoryServiceI,
    meetingTool?:VideoConferenciaI;
  };

  form1Values!:{
    user:UserI,

    referencedAppointment:boolean;
    referencedSubsidiary:SubsidiaryI;

    urgency:any;
    underAge:boolean,
    nameUnderAge:string,
    birthdateUnderAge:any
  };

  form3Values?:{
    subsidiary:SubsidiaryI,
    service:ServiceI[],
    medico: UserI,
    date:any,
    hour:any,
    documentAppointment:any,
    commentAppointment:string
  }

  commentAppointment!:string

  total: any = 0;
  virtual: boolean = false;
  remitida: boolean = false;

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private newAppointmentFormsService: NewAppointmentFormsService,
    private ngbModal: NgbModal,
    private formBuilder: FormBuilder,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
    private appointmentService: AppointmentsService,
    public ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.forms = this.newAppointmentFormsService.forms;
    this.form = this.forms['form'];
    this.form1 = this.forms['form1'];
    this.form3 = this.forms['form3'];

    this.subs.add(
      this.form.valueChanges.subscribe({
        next:((values)=>{
          this.formValues = values;
          this.virtual = values.typeAppoinment?.online ?? false;
        })
      })
    );

    this.subs.add(
      this.newAppointmentFormsService.remitida$.subscribe({
        next:((res:any) => { this.remitida = res; })
      })
    );

    this.subs.add(
      this.form1.valueChanges.subscribe({
        next:((values)=>{
          this.form1Values = values;
        })
      })
    );

    this.subs.add(
      this.form3.valueChanges.subscribe({
        next:((values)=>{
          this.form3Values = values;
        })
      })
    );

    this.subs.add(
      this.newAppointmentFormsService.totalAppointment$.subscribe({
        next:((res:any)=>{
          this.total = res;
        })
      })
    );

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  getControlForms(form:string,name:string){
   return this.forms[form].get(name);
  }

  async createAppointment() {
    await this.ngxSpinnerService.show('generalSpinner');

    setTimeout(async () => {
      if (this.form3) {
        this.form3.get('commentAppointment')?.setValue(this.commentAppointment || '');
      }

      const valuesForm = this.newAppointmentFormsService.getAllValuesFromForms();

      if (
        !valuesForm.form1?.urgency?.name ||
        !valuesForm.form3?.medico?._id ||
        !valuesForm.form3?.hour?._id ||
        !Array.isArray(valuesForm.form3?.service)
      ) {
        await this.ngxSpinnerService.hide('generalSpinner');
        this.alertsService.toastMixin('Datos incompletos, por favor complete todos los pasos', 'error');
        return;
      }

      const data = {
        typeAppoinment: valuesForm.form.typeAppoinment._id,
        meetingTool: valuesForm.form.meetingTool?._id,
        user: valuesForm.form1.user._id,
        phoneUser: `${valuesForm.form1.user.countryCode} ${valuesForm.form1.user.phone}`,
        onlyPhone: `${valuesForm.form1.user.countryCode}${valuesForm.form1.user.phone}`,
        referencedAppointment: valuesForm.form1.referencedAppointment,
        referencedSubsidiary: valuesForm.form1.referencedSubsidiary,
        idUnderAge: valuesForm.form1.idUnderAge,
        underAge: valuesForm.form1.underAge,
        nameUnderAge: valuesForm.form1.nameUnderAge,
        birthdateUnderAge: valuesForm.form1.birthdateUnderAge,
        urgency: valuesForm.form1.urgency.name,
        subsidiary: valuesForm.form3?.subsidiary
          ? valuesForm.form3.subsidiary._id
          : (valuesForm.form3?.medico?.subsidiary?._id ?? valuesForm.form3?.medico?.subsidiary),
        service: [...valuesForm.form3.service.map((s: ServiceI) => s._id)],
        medico: valuesForm.form3.medico._id,
        dateAppointment: valuesForm.form3.date,
        hour: valuesForm.form3.hour._id,
        documentAppointment: valuesForm.form3.documentAppointment,
        commentAppointment: valuesForm.form3.commentAppointment,
        total: Number(this.total),
        status: this.virtual === true ? 'Pending' : 'Reserved',
        remitida: this.remitida,
        dayAppointment: valuesForm.form3.dayAppointment,
      };

      const info = new FormData();
      info.append('documentAppointment', data.documentAppointment);
      info.append('data', JSON.stringify(data));

      this.appointmentService.newAppointmentClient(info).pipe(
        finalize(async () => {
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next: (_res: any) => {
          this.alertsService.appointmentSuccess();
          this.newAppointmentFormsService.appointmentRegistered$.next(true);
          this.ngbActiveModal.close();
          if (!this.remitida) {
            this.router.navigateByUrl('/dashboard/appointments');
          }
        },
        error: (e: any) => {
          this.alertsService.toastMixin(e.error.message, 'error');
        }
      });
    }, 1500);
  }

}
