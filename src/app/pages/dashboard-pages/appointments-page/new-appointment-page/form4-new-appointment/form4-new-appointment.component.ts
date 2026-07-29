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
import { UtilsService } from 'src/app/services/utils.service';


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
    patientType:'registered' | 'external';
    user:UserI;
    patientAddress:string;
    diagnostico?:string;

    referencedAppointment:boolean;
    referencedSubsidiary:SubsidiaryI;

    urgency:any;
    underAge:boolean,
    nameUnderAge:string,
    birthdateUnderAge:any

    insuranceType?:'aseguradora' | 'particular';
    duiImage?:File | null;
    indicacionMedica?:File | null;
    medico?:UserI | null;

    externalPatientNames?:string;
    externalPatientPhone?:string;
    externalPatientCountryCode?:string;
    externalPatientMask?:string;
    externalPatientTypeDocument?:string;
    externalPatientDocument?:string;
    externalPatientEmail?:string;

    isExternalMedico?:boolean;
    externalMedicoNames?:string;
    externalMedicoPhone?:string;
    externalMedicoCountryCode?:string;
    externalMedicoMask?:string;
  };

  form3Values?:{
    subsidiary:SubsidiaryI,
    service:ServiceI[],
    date:any,
    dateEnd?:any,
    documentAppointment:any,
    commentAppointment:string,
    typePayment?:string
  }

  commentAppointment!:string

  duiImagePreviewUrl:string | null = null;
  indicacionMedicaPreviewUrl:string | null = null;

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
    private utilsService: UtilsService,
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
          const previousDuiImage = this.form1Values?.duiImage;
          const previousIndicacionMedica = this.form1Values?.indicacionMedica;

          this.form1Values = values;

          if(values.duiImage !== previousDuiImage){
            this.duiImagePreviewUrl = this.buildFilePreviewUrl(this.duiImagePreviewUrl, values.duiImage);
          }

          if(values.indicacionMedica !== previousIndicacionMedica){
            this.indicacionMedicaPreviewUrl = this.buildFilePreviewUrl(this.indicacionMedicaPreviewUrl, values.indicacionMedica);
          }
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
    if(this.duiImagePreviewUrl) URL.revokeObjectURL(this.duiImagePreviewUrl);
    if(this.indicacionMedicaPreviewUrl) URL.revokeObjectURL(this.indicacionMedicaPreviewUrl);
  }

  // Genera una URL de previsualización para un File del formulario, liberando la anterior para no dejar memoria colgada.
  private buildFilePreviewUrl(previousUrl:string | null, file:File | null | undefined):string | null {
    if(previousUrl) URL.revokeObjectURL(previousUrl);
    return file ? URL.createObjectURL(file) : null;
  }

  getControlForms(form:string,name:string){
   return this.forms[form].get(name);
  }

  getDateSummary(){
    if(!this.form3Values?.date) return '';
    return this.utilsService.formatAppointmentDate(this.form3Values.date, this.form3Values.dateEnd);
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
        !valuesForm.form3?.date ||
        !Array.isArray(valuesForm.form3?.service)
      ) {
        await this.ngxSpinnerService.hide('generalSpinner');
        this.alertsService.toastMixin('Datos incompletos, por favor complete todos los pasos', 'error');
        return;
      }

      const isExternalPatient = valuesForm.form1.patientType === 'external';
      const isExternalMedico = !!valuesForm.form1.isExternalMedico;

      const externalPatient = isExternalPatient ? {
        names: valuesForm.form1.externalPatientNames,
        phone: valuesForm.form1.externalPatientPhone,
        countryCode: valuesForm.form1.externalPatientCountryCode,
        mask: valuesForm.form1.externalPatientMask,
        typeDocument: valuesForm.form1.externalPatientTypeDocument,
        document: valuesForm.form1.externalPatientDocument,
        email: valuesForm.form1.externalPatientEmail || null,
      } : null;

      const externalMedico = isExternalMedico ? {
        names: valuesForm.form1.externalMedicoNames,
        phone: valuesForm.form1.externalMedicoPhone,
        countryCode: valuesForm.form1.externalMedicoCountryCode,
        mask: valuesForm.form1.externalMedicoMask,
      } : null;

      const phoneUser = isExternalPatient
        ? `${externalPatient?.countryCode} ${externalPatient?.phone}`
        : `${valuesForm.form1.user.countryCode} ${valuesForm.form1.user.phone}`;

      const onlyPhone = isExternalPatient
        ? `${externalPatient?.countryCode}${externalPatient?.phone}`
        : `${valuesForm.form1.user.countryCode}${valuesForm.form1.user.phone}`;

      const data = {
        typeAppoinment: valuesForm.form.typeAppoinment._id,
        meetingTool: valuesForm.form.meetingTool?._id,
        user: isExternalPatient ? null : valuesForm.form1.user._id,
        externalPatient,
        phoneUser,
        onlyPhone,
        referencedAppointment: valuesForm.form1.referencedAppointment,
        referencedSubsidiary: valuesForm.form1.referencedSubsidiary,
        idUnderAge: valuesForm.form1.idUnderAge,
        underAge: valuesForm.form1.underAge,
        nameUnderAge: valuesForm.form1.nameUnderAge,
        birthdateUnderAge: valuesForm.form1.birthdateUnderAge,
        urgency: valuesForm.form1.urgency.name,
        patientAddress: valuesForm.form1.patientAddress,
        diagnostico: valuesForm.form1.diagnostico,
        medico: valuesForm.form1.medico?._id ?? null,
        externalMedico,
        insuranceType: valuesForm.form1.insuranceType ?? null,
        duiImage: valuesForm.form1.duiImage,
        indicacionMedica: valuesForm.form1.indicacionMedica,
        subsidiary: valuesForm.form3?.subsidiary?._id,
        service: [...valuesForm.form3.service.map((s: ServiceI) => s._id)],
        dateAppointment: valuesForm.form3.date,
        dateAppointmentEnd: valuesForm.form3.dateEnd ?? null,
        documentAppointment: valuesForm.form3.documentAppointment,
        commentAppointment: valuesForm.form3.commentAppointment,
        typePayment: valuesForm.form3.typePayment,
        total: Number(this.total),
        status: this.virtual === true ? 'Pending' : 'Reserved',
        remitida: this.remitida,
      };

      const info = new FormData();
      info.append('documentAppointment', data.documentAppointment);
      if(data.duiImage) info.append('duiImage', data.duiImage);
      if(data.indicacionMedica) info.append('indicacionMedica', data.indicacionMedica);
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
