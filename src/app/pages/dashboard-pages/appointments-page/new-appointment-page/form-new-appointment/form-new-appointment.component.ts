import { Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';
import { finalize, Subscription } from 'rxjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { VideoConferenciaI } from 'src/app/interfaces/video-conferencia.interface';
import { CategoryServiceI } from 'src/app/interfaces/service.interface';
import { VideoConferenciaService } from 'src/app/services/video-conferencia.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-form-new-appointment',
  templateUrl: './form-new-appointment.component.html',
  styleUrls: ['./form-new-appointment.component.scss']
})
export class FormNewAppointmentComponent  implements OnInit,OnDestroy {

  form!:FormGroup;

  formSubmited:boolean = false;

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setSubsidiary:EventEmitter<boolean> = new EventEmitter<boolean>();


  subs:Subscription = new Subscription();

  videoConferencia:VideoConferenciaI[] = []

  categoriesServices:CategoryServiceI[] = []

  loading:boolean =true;
  
  constructor(
    private formBuilder: FormBuilder,
    private videoConferenciaService: VideoConferenciaService,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private alertsService: AlertsService,
    private categoriesServicesService: ServiceService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getcategoriesServices();
    this.getvideoConferencia();

    this.subs.add(
      this.newAppointmentFormsService.appointmeRemision$.subscribe({
        next:((appointment)=>{
          if(appointment){
            this.form.patchValue({typeAppoinment:appointment.typeAppoinment,meetingTool:appointment.meetingTool})
          }
        })
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getControl(name:string){
    return this.form.get(name);
  }

  setValue(name:string,value:any){
    this.form.get(name)?.setValue(value);
  }

  createForm(){
    this.form = this.formBuilder.group({
      typeAppoinment:['',[Validators.required]],
      meetingTool:['',[Validators.required]],
    });

    this.form.get('meetingTool')?.disable()

    Object.assign(this.newAppointmentFormsService.forms,{form:this.form})
  }


  nextForm(){
    this.formSubmited = true;
    if(this.form.valid){
      this.nextStepper.emit(true);
    }
  }

  setSubsidiaryFunction(){
    if(this.getControl('typeAppoinment')?.value.online == true){
      this.form.get('meetingTool')?.enable()
    }else {
      this.form.get('meetingTool')?.disable()
    }
    // Reset form3 since appointment type changed
    this.newAppointmentFormsService.resetForm3From('all');
  }

  getvideoConferencia(){
    this.videoConferenciaService.getVideoConferencias(1,'true').subscribe({
      next:(res:any)=>{
        this.videoConferencia = res.videoConferencias;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  getcategoriesServices(){
    this.loading =true;
     this.categoriesServicesService.getCategoriesServices(1,{status: 'true'}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.categoriesServices = res.serviceCategoris;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }
}
