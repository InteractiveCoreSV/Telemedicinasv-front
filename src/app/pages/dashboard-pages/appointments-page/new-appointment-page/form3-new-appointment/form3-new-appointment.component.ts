
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsNewAppointmentI, NewAppointmentFormsService } from '../new-appointment-forms.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/services/alerts.service';
import { Subscription } from 'rxjs';
import { SelectSubsidiaryModalComponent } from '../select-subsidiary-modal/select-subsidiary-modal.component';
import { SelectServiceModalComponent } from '../select-service-modal/select-service-modal.component';
import { SelectDateRangeModalComponent } from '../select-date-range-modal/select-date-range-modal.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ServiceI } from 'src/app/interfaces/service.interface';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-form3-new-appointment',
  templateUrl: './form3-new-appointment.component.html',
  styles: [`
    .container-paso-3-select {
      padding: 0 !important;
      align-items: stretch !important;
      overflow: hidden;
    }

    .select-paso-3 {
      width: 100%;
      flex: 1;
    }

    ::ng-deep .select-paso-3 .ng-select-container {
      border: none !important;
      background: transparent !important;
      height: 100%;
      min-height: 47px !important;
      border-radius: 10px !important;
      box-shadow: none !important;
      padding: 0 15px;
    }

    ::ng-deep .select-paso-3 .ng-placeholder,
    ::ng-deep .select-paso-3 .ng-value {
      font-size: 12px;
      font-weight: 500;
    }

    ::ng-deep .select-paso-3.ng-select-disabled .ng-select-container {
      background-color: transparent !important;
      cursor: not-allowed;
    }
  `]
})
export class Form3NewAppointmentComponent implements OnInit, OnDestroy {

  formSubmited:boolean = false;

  form3!:FormGroup;
  form!:FormGroup;
  form1!: FormGroup;
  forms!:FormsNewAppointmentI;

  virtual:boolean = false;

  subs:Subscription = new Subscription();

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();

  category!:string

  minDate:Date = dayjs().startOf('day').toDate();
  userID!:any

  selectedFile: File | null = null;

  total:number = 0

  typePaymentOptions = [
    { value:'tarjeta', label:'Tarjeta' },
    { value:'efectivo', label:'Efectivo' },
    { value:'cheque', label:'Cheque' },
    { value:'transferencia', label:'Transferencia' },
  ];

  private previousTypeAppoinmentId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private ngbModal: NgbModal,
    private alertService: AlertsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.createForm();
    this.forms = this.newAppointmentFormsService.forms;

    this.form = this.forms['form'];

    this.form1 = this.forms['form1'];

    const user = this.authService.userInfo.value

    if(user && user.roles && user.roles[0].name === 'patient'){
      this.userID = user._id
    }else {
      this.userID = this.form1?.get('user')?.value?._id ?? null

      this.subs.add(
        this.form1?.get('user')?.valueChanges.subscribe((selectedUser) => {
          this.userID = selectedUser?._id ?? null
        })
      )
    }

    this.subs.add(
      this.form.valueChanges.subscribe({
        next:((value)=>{
          const newTypeId: string | null = value.typeAppoinment?._id ?? null;
          const typeChanged = newTypeId !== this.previousTypeAppoinmentId;
          this.previousTypeAppoinmentId = newTypeId;

          this.virtual = value.typeAppoinment?.online ?? false;
          this.category = value.typeAppoinment?._id;

          if(this.virtual){
            this.form3.get('subsidiary')?.setValue(null)
            this.form3.get('subsidiary')?.disable()
          }else {
            this.form3.get('subsidiary')?.enable()
          }

          if(typeChanged){
            this.newAppointmentFormsService.resetForm3From('all');
            this.selectedFile = null;
          }
        })
      })
    );

   this.subs.add(
      this.getControl('service')?.valueChanges.subscribe((services: ServiceI[]) => {

        if (!services || !Array.isArray(services)) {
          this.total = 0;
          return;
        }

        this.total = services.reduce((acc, s) => {
          const price = parseFloat(String(s?.price).replace(/[^0-9.]/g, ''));
          return acc + (isNaN(price) ? 0 : price);
        }, 0);

      })
    );

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  createForm(){
    this.form3 = this.formBuilder.group({
      subsidiary:[null,[Validators.required]],

      service:[null,[Validators.required]],
      date:[null,[Validators.required]],
      dateEnd:[null,[]],
      disabledDate:[null],
      documentAppointment:[null,[]],
      commentAppointment:['',[]],
      typePayment:[null,[Validators.required]],
    });
    this.form3.get('subsidiary')?.disable()
    this.form3.get('typePayment')?.disable()

    Object.assign(this.newAppointmentFormsService.forms,{form3:this.form3})

  }

  getControl(name:string){
    return this.form3.get(name);
  }

  openModalSelectSubsidiary(){
    const modal = this.ngbModal.open(SelectSubsidiaryModalComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});
    modal.componentInstance.patientAddress = this.form1?.get('patientAddress')?.value ?? '';

    modal.result.then((result)=>{
      if(result.subsidiary){
        const current = this.getControl('subsidiary')?.value;
        if(!current || current._id !== result.subsidiary._id){
          this.newAppointmentFormsService.resetForm3From('subsidiary');
          this.selectedFile = null;
        }
        this.getControl('subsidiary')?.setValue(result.subsidiary)
      }
    }).catch(()=>{})
  }

  openModalSelectService() {
    if (
      (!this.getControl('subsidiary')?.value && this.virtual) ||
      (this.getControl('subsidiary')?.value && !this.virtual)
    ) {

      const modal = this.ngbModal.open(SelectServiceModalComponent, {
        centered: true,
        size: 'md',
        scrollable: true,
        backdrop: 'static'
      });

      modal.componentInstance.category = this.category;

      const currentServices = this.getControl('service')?.value;
      if (currentServices) {
        modal.componentInstance.servicesSelected = [...currentServices];
      }

      modal.result
        .then((result) => {
          if (!result?.service) return;

          const services: ServiceI[] = Array.isArray(result.service)
            ? result.service
            : [result.service];

          this.getControl('service')?.setValue([...services]);

          this.newAppointmentFormsService.resetForm3From('service');
        })
        .catch(() => {});
    }
  }

  openSelectDateModal(){
    if(!this.getControl('service')?.value) return;

    const modal = this.ngbModal.open(SelectDateRangeModalComponent,{centered:true, size:'lg', backdrop:'static'});
    modal.componentInstance.minDate = this.minDate;
    modal.componentInstance.date = this.getControl('date')?.value;
    modal.componentInstance.dateEnd = this.getControl('dateEnd')?.value;

    modal.result.then((result:any)=>{
      this.getControl('date')?.setValue(result.date);
      this.getControl('dateEnd')?.setValue(result.dateEnd ?? null);

      if(result.date){
        this.getControl('typePayment')?.enable();
      }else{
        this.getControl('typePayment')?.disable();
      }
    }).catch(()=>{});
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.getControl('documentAppointment')?.setValue(this.selectedFile)
    }
  }

  nextForm(){
    this.formSubmited = true;

    if(this.form3.valid){
      let total:any = parseFloat(this.total.toString()).toFixed(2)
      total = ((total) as any)*1
      this.newAppointmentFormsService.totalAppointment$.next(total.toFixed(2));
      this.nextStepper.emit(true);
    }
  }

}
