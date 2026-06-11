
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FormsNewAppointmentI, NewAppointmentFormsService } from '../new-appointment-forms.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/services/alerts.service';
import { Subscription } from 'rxjs';
import { SelectSubsidiaryModalComponent } from '../select-subsidiary-modal/select-subsidiary-modal.component';
import { SelectServiceModalComponent } from '../select-service-modal/select-service-modal.component';
import { SelectMedicoModalComponent } from '../select-medico-modal/select-medico-modal.component';
import { SelectDateAndHourModalComponent } from '../select-date-and-hour-modal/select-date-and-hour-modal.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ServiceI } from 'src/app/interfaces/service.interface';

@Component({
  selector: 'app-form3-new-appointment',
  templateUrl: './form3-new-appointment.component.html',
  styles: [
  ]
})
export class Form3NewAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {

  formSubmited:boolean = false;

  form3!:FormGroup;
  form!:FormGroup;
  form1!: FormGroup;
  forms!:FormsNewAppointmentI;

  virtual:boolean = false;

  subs:Subscription = new Subscription();

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();

  category!:string

  date:any
  userID!:any

  selectedFile: File | null = null;

  forMedicoDisponible:boolean = false
  total:number = 0

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
            this.date = null;
            this.selectedFile = null;

            if(this.forMedicoDisponible){
              const medico = this.newAppointmentFormsService.medicoDisponible$.value;
              if(medico){
                this.form3.get('medico')?.setValue(medico);
                if(!this.virtual){
                  this.form3.get('subsidiary')?.setValue(medico.subsidiary);
                }
              }
            }
          }
        })
      })
    );

    this.subs.add(
      this.newAppointmentFormsService.medicoDisponible$.subscribe({
        next:((value)=>{
          if(value){
            this.forMedicoDisponible = true;
            if(!this.virtual){
              this.form3.get('subsidiary')?.enable();
            }
            this.form3.get('medico')?.setValue(value);
            this.form3.get('subsidiary')?.setValue(value.subsidiary ?? null);
          }else {
            this.forMedicoDisponible = false;
            this.form3.get('medico')?.setValue(null);
            this.form3.get('subsidiary')?.setValue(null);
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

  ngAfterViewInit(): void {
    const medico = this.newAppointmentFormsService.medicoDisponible$.value;
    if(medico){
      this.forMedicoDisponible = true;
      this.form3.get('subsidiary')?.enable();
      this.form3.get('medico')?.setValue(medico);
      this.form3.get('subsidiary')?.setValue(medico.subsidiary ?? null);
      Promise.resolve().then(() => this.cdr.detectChanges());
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  createForm(){
    this.form3 = this.formBuilder.group({
      subsidiary:[null,[Validators.required]],

      service:[null,[Validators.required]],
      medico:[null,[Validators.required]],
      date:[null,[Validators.required]],
      hour:[null,[Validators.required]],
      disabledDate:[null],
      dayAppointment:[null],
      documentAppointment:[null,[]],
      commentAppointment:['',[]], 
    });
    this.form3.get('subsidiary')?.disable()

    Object.assign(this.newAppointmentFormsService.forms,{form3:this.form3})
 
  }

  getControl(name:string){
    return this.form3.get(name);
  }

  openModalSelectSubsidiary(){
    if(this.forMedicoDisponible === false){
      const modal = this.ngbModal.open(SelectSubsidiaryModalComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

      modal.result.then((result)=>{
        if(result.subsidiary){
          const current = this.getControl('subsidiary')?.value;
          if(!current || current._id !== result.subsidiary._id){
            this.newAppointmentFormsService.resetForm3From('subsidiary');
            this.date = null;
            this.selectedFile = null;
          }
          this.getControl('subsidiary')?.setValue(result.subsidiary)
        }
      }).catch(()=>{})
    }
  }

  openModalSelectService() {
    if (
      this.forMedicoDisponible ||
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
          this.date = null;
        })
        .catch(() => {});
    }
  }


  openModalSelectMedico(){

    if(this.getControl('service')?.value && this.forMedicoDisponible === false){
     const modal = this.ngbModal.open(SelectMedicoModalComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

     modal.componentInstance.medicoSelected = this.getControl('medico')?.value ?? null;
 
     if(this.getControl('subsidiary')?.value){
      modal.componentInstance.subsidiary = this.getControl('subsidiary')?.value._id
     }
 
     modal.result.then((result)=>{
       if(result.medico){
         const current = this.getControl('medico')?.value;
         if(!current || current._id !== result.medico._id){
           this.newAppointmentFormsService.resetForm3From('medico');
           this.date = null;
         }
         this.getControl('medico')?.setValue(result.medico)
       }
     }).catch(()=>{})
    }
   }

   async openModalSelectDateAndHourModal(){
    if(this.getControl('medico')?.value){
      const modalRef = this.ngbModal.open(SelectDateAndHourModalComponent,{centered:true,size:'lg',backdrop:'static'});

    if(this.date){
      modalRef.componentInstance.dateSelectedForm = this.date;
    }

    modalRef.componentInstance.medico = this.getControl('medico')?.value._id;

    if(this.getControl('subsidiary')?.value){
      modalRef.componentInstance.subsidiary = this.getControl('subsidiary')?.value._id
    }
    modalRef.componentInstance.userID = this.userID

    try {
      const {date} = await modalRef.result;
      if(date){
        this.date= date;
        this.getControl('date')?.setValue(this.date.date)
        this.getControl('hour')?.setValue(this.date.hour)
        this.getControl('dayAppointment')?.setValue(this.date.dayAppointment)
      }
    } catch (error) {}
    }
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
