import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';
import { Subscription, combineLatest, finalize, take } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { EncryptService } from 'src/app/services/encrypt.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { InsuranceI } from 'src/app/interfaces/insurance';
import { TermsAndConditionsComponent } from 'src/app/components/modals/terms-and-conditions/terms-and-conditions.component';
import { CreditCardFormatDirective, CreditCardValidators } from 'angular-cc-library';
import { ShowIframePowertranzComponent } from '../components/show-iframe-powertranz/show-iframe-powertranz.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceI } from 'src/app/interfaces/service.interface';

declare const PayWayOneButton: any;

@Component({
  selector: 'app-form5-new-appointment',
  templateUrl: './form5-new-appointment.component.html',
  styles: [
  ]
})
export class Form5NewAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ccNumber') ccNumber!: CreditCardFormatDirective;
  form5!: FormGroup;

  name: string = '';
  number: string = '';
  cvc: string = '';
  expiry: string = '';

  focusedField: string = 'number';

  typePayment!: string;

  total: any = 0;
  subs: Subscription = new Subscription();

  insurance!: InsuranceI
  formSubmited: boolean = false;
  remitida: boolean = false;

  @Output() nextStepper: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() appointmentRegistered: EventEmitter<boolean> = new EventEmitter<boolean>();

  virtual: boolean = false;
  termsnAndCondition: boolean = false;

  imgComprobante: File[] = [];

  public cardMethodForm!: FormGroup;
  public cardType = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private appointmentService: AppointmentsService,
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private authService: AuthService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createCardMethod();

    const forms = this.newAppointmentFormsService.forms;

    const form = forms['form'];

    this.subs.add(
      form.valueChanges.subscribe({
        next: ((value) => {
          this.virtual = value.typeAppoinment.online
        })
      })
    );

    /*TOTAL A COBRAR DE TODOS LAS CITAS AGENDADAS, AGREGADAS AUN MISMO PAGO*/
    this.subs.add(
      this.newAppointmentFormsService.totalAppointment$.subscribe({
        next: ((res: any) => {
          this.total = res;
        })
      })
    );

    this.subs.add(
      this.newAppointmentFormsService.remitida$.subscribe({
        next: ((res: any) => {
          this.remitida = res;
        })
      })
    );

    const valuesForm = this.newAppointmentFormsService.getAllValuesFromForms();
  }

  ngAfterViewInit(): void {
    this.subs.add(
      this.ccNumber?.resolvedScheme$.subscribe({
        next: (cardType:any) => {
          this.cardType = cardType;
          if (!['visa', 'mastercard', 'amex'].includes(cardType)) {
            this.getControlCard('number')?.setErrors({ invalidCardType: true });
          }
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModalTermsAndCondictions() {
    const modal = this.ngbModal.open(TermsAndConditionsComponent, { centered: true, size: 'md', scrollable: true, backdrop: 'static' });
    modal.result.then((result) => {

      if (result.accepted === true) {
        this.termsnAndCondition = true
      } else {
        this.termsnAndCondition = false
      }
    }).catch(() => { })
  }

  procedPayment() {
    if (!['creditCard', 'cash', 'insurance', 'transferencia'].includes(this.typePayment)) {
      this.alertsService.toastMixin('Seleccione el metodo de pago', 'warning', 3000)
      return;
    }

    if (this.typePayment == 'insurance' && !this.insurance) {
      this.alertsService.toastMixin('Seleccione la aseguradora para continuar', 'warning', 3000)
      return;
    }

    if (this.termsnAndCondition == false) {
      this.alertsService.toastMixin('Aceptar los Terminos y Condiciones para continuar', 'warning', 3000)
      return;
    }

    if (this.typePayment === 'transferencia' && this.imgComprobante.length === 0) {
      this.alertsService.toastMixin('El comprobante de pago es necesario para continuar', 'warning');
      return
    }

    if (this.typePayment === 'creditCard') {
      this.payment()
    }

    if (['cash', 'insurance', 'transferencia'].includes(this.typePayment)) {
      this.payment()
    }
  }


  getControlValue(name: string) {
    return this.form5.get(name)?.value;
  }

  createForm() {
    this.form5 = this.formBuilder.group({
      name: ['', [Validators.required]],
      number: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
      expiry: ['', [Validators.required]]
    })
  }

  createCardMethod() {
    this.cardMethodForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // number: ['', [CreditCardValidators.validateCCNumber]],
      number: ['', [Validators.required]],
      ccv: ['', [Validators.required, Validators.minLength(3)]],
      expDate: ['', [CreditCardValidators.validateExpDate]]
    });
  }

  getControlCard(name: string) {
    return this.cardMethodForm.get(name);
  }

  isInvalidControlCard(name: string) {
    return this.getControlCard(name)?.invalid;
  }


  nextForm() {
    this.nextStepper.emit(true);
  }

  async payment() {

    await this.ngxSpinnerService.show('generalSpinner');
    setTimeout(async () => {
      const valuesForm = this.newAppointmentFormsService.getAllValuesFromForms();

      if(
        !valuesForm.form1?.urgency?.name ||
        !valuesForm.form3?.medico?._id ||
        !valuesForm.form3?.hour?._id ||
        !Array.isArray(valuesForm.form3?.service)
      ){
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
        service: [...valuesForm.form3.service.map((s: ServiceI) => s._id)] ,
        medico: valuesForm.form3.medico._id,
        dateAppointment: valuesForm.form3.date,
        hour: valuesForm.form3.hour._id,
        documentAppointment: valuesForm.form3.documentAppointment,

        commentAppointment: valuesForm.form3.commentAppointment,

        total:Number(this.total),

        status: this.virtual === true ? 'Pending' : 'Reserved',
        remitida:this.remitida,

        insurance: this.typePayment === 'insurance' ? this.insurance._id : null,
        insuranceName: this.typePayment === 'insurance' ? this.insurance.name : null,
        typePayment: this.typePayment,

        dayAppointment: valuesForm.form3.dayAppointment,

      };

      const info = new FormData();
      info.append('documentAppointment', data.documentAppointment);
      info.append('data', JSON.stringify(data));

      if (this.typePayment === 'transferencia' && this.imgComprobante.length > 0) {
        info.append('imgComprobante', this.imgComprobante[0]);
      }

      this.appointmentService.newAppointmentClient(info).pipe(
        finalize(async () => {
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next: ((res: any) => {
          this.alertsService.appointmentSuccess();

          this.newAppointmentFormsService.appointmentRegistered$.next(true);

          this.ngbActiveModal.close()
          if(!this.remitida){
            this.router.navigateByUrl('/dashboard/appointments');
          }
        }),
        error: ((e: any) => {
          this.alertsService.toastMixin(e.error.message, 'error');
        })
      });
    }, 1500);
  }

  async paymentCard(){
    await this.ngxSpinnerService.show('generalSpinner');
    setTimeout(async () => {
      const valuesForm = this.newAppointmentFormsService.getAllValuesFromForms();

      if(
        !valuesForm.form1?.urgency?.name ||
        !valuesForm.form3?.medico?._id ||
        !valuesForm.form3?.hour?._id ||
        !Array.isArray(valuesForm.form3?.service)
      ){
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
        service: [...valuesForm.form3.service.map((s: ServiceI) => s._id)] ,
        medico: valuesForm.form3.medico._id,
        dateAppointment: valuesForm.form3.date,
        hour: valuesForm.form3.hour._id,
        documentAppointment: valuesForm.form3.documentAppointment,

        commentAppointment: valuesForm.form3.commentAppointment,

        total:Number(this.total),

        status: this.virtual === true ? 'Pending' : 'Reserved',
        remitida:this.remitida,

        insurance: null,
        insuranceName: null,
        typePayment: 'creditCard',

        dayAppointment: valuesForm.form3.dayAppointment,

        dataCard:this.cardMethodForm.value
      };

      const info = new FormData();
      info.append('documentAppointment', data.documentAppointment);
      info.append('data', JSON.stringify(data));

      this.appointmentService.newAppointmentPaymentCard(info).pipe(
        finalize(async () => {
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next: ((res: any) => {
          // this.alertsService.appointmentSuccess();

          // this.newAppointmentFormsService.appointmentRegistered$.next(true);

          // this.ngbActiveModal.close()
          // this.router.navigateByUrl('/dashboard/appointments');
          this.showIframe(res.iframe);
        }),
        error: ((e: any) => {
          this.alertsService.toastMixin(e.error.message, 'error');
        })
      });
    }, 1500);
  }

  showIframe(iframe:string){
    const modalRef = this.ngbModal.open(ShowIframePowertranzComponent,{size:'lg',backdrop:'static',scrollable:true});
    modalRef.componentInstance.iframeHtml = this.domSanitizer.bypassSecurityTrustHtml(iframe);

    this.subs.add(modalRef.dismissed.subscribe((res:any)=>{
      if(res?.paymentComplete){
        this.alertsService.appointmentSuccess();
        this.newAppointmentFormsService.appointmentRegistered$.next(true);
        this.ngbActiveModal.close()
        this.router.navigateByUrl('/dashboard/appointments');
      }else{
        this.alertsService.toastMixin('Error en el pago, intente nuevamente', 'error');
      }
    }));
  }

  get canProccedPayement() {
    if (this.typePayment === 'creditCard') {
      return this.cardMethodForm.invalid || this.termsnAndCondition == false;
    }

    return (this.termsnAndCondition == false || !['creditCard', 'cash', 'transferencia', 'insurance'].includes(this.typePayment));
  }
}
