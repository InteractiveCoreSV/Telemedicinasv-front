import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { CreditCardFormatDirective, CreditCardValidators } from 'angular-cc-library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { InsuranceI } from 'src/app/interfaces/insurance';
import { TermsAndConditionsComponent } from '../../terms-and-conditions/terms-and-conditions.component';
import { ShowIframePowertranzComponent } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/components/show-iframe-powertranz/show-iframe-powertranz.component';

@Component({
  selector: 'app-pay-appointment',
  templateUrl: './pay-appointment.component.html',
  styleUrls: ['./pay-appointment.component.scss']
})
export class PayAppointmentComponent implements OnInit , AfterViewInit, OnDestroy {
  @ViewChild('ccNumber') ccNumber!: CreditCardFormatDirective;
  form5!: FormGroup;

  name: string = '';
  number: string = '';
  cvc: string = '';
  expiry: string = '';

  focusedField: string = 'number';

  typePayment!: string;
  
  @Input() appointmentId!: string
  @Input() virtual: boolean = false;
  @Input() total: any = 0;

  subs: Subscription = new Subscription();

  insurance!: InsuranceI
  formSubmited: boolean = false;

  termsnAndCondition: boolean = false;

  imgComprobante: File[] = [];


  public cardMethodForm!: FormGroup;
  public cardType = '';

  constructor(
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private ngbModal: NgbModal,
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private appointmentService: AppointmentsService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.createCardMethod();
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
      this.pay()
    }

    if (['cash', 'insurance', 'transferencia'].includes(this.typePayment)) {
      this.pay()
    }
  }
  
  async pay(){
    await this.ngxSpinnerService.show('generalSpinner');
    const data = {
      total:Number(this.total),
      status:'Reserved',

      insurance: this.typePayment === 'insurance' ? this.insurance._id : null,
      insuranceName: this.typePayment === 'insurance' ? this.insurance.name : null,
      typePayment: this.typePayment,

      dataCard:this.cardMethodForm.value,

      appointmentId:this.appointmentId
    };

    const info = new FormData();
    info.append('data', JSON.stringify(data));
      
    if (this.typePayment === 'transferencia' && this.imgComprobante.length > 0) {
      info.append('imgComprobante', this.imgComprobante[0]);
    }

    this.appointmentService.payAppointment(info).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointmentService.updateAppointmets$.next(true)

        if(res.iframe){
          this.showIframe(res.iframe);
        }else {
          this.alertsService.appointmentSuccess('Pago Existoso','Cita pagada con exito.');
        }

        if(res.ok){
          this.ngbActiveModal.close({reload:true})
        }
      }),
      error:((e:any)=>{
        console.log(e)
        if(e.error.iframe){
            this.showIframe(e.error.iframe);
          }else {
            this.alertsService.toastMixin(e.error.message,'error');
          }
      })
    });
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
  

  
  showIframe(iframe:string){
      const modalRef = this.ngbModal.open(ShowIframePowertranzComponent,{size:'lg',backdrop:'static',scrollable:true});
      modalRef.componentInstance.iframeHtml = this.domSanitizer.bypassSecurityTrustHtml(iframe);
  
      modalRef.dismissed.subscribe((res:any)=>{
        if(res?.paymentComplete){
          this.alertsService.appointmentSuccess();
          this.ngbActiveModal.close({reload:true})
        }else{
          this.alertsService.toastMixin('Error en el pago, intente nuevamente', 'error');
        }
      })
    }
  
    get canProccedPayement() {
      if (this.typePayment === 'creditCard') {
        return this.cardMethodForm.invalid || this.termsnAndCondition == false;
      }
  
      return (this.termsnAndCondition == false || !['creditCard', 'cash', 'transferencia', 'insurance'].includes(this.typePayment));
    }
}
