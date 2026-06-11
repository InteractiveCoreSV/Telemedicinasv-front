import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';
import { finalize, Subscription } from 'rxjs';
import { MenorEdadI, UserI } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterUserComponent } from 'src/app/components/modals/register-user/register-user.component';
import { UsersService } from 'src/app/services/user.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { NewMenorEdadComponent } from 'src/app/components/modals/new-menor-edad/new-menor-edad.component';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';

@Component({
  selector: 'app-form1-new-appointment',
  templateUrl: './form1-new-appointment.component.html',
  styles: [
  ]
})
export class Form1NewAppointmentComponent implements OnInit,OnDestroy {

  form1!:FormGroup;
  menoresDeEdad: MenorEdadI[] = []

  formSubmited:boolean = false;

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createUser:EventEmitter<boolean> = new EventEmitter<boolean>();

  subs:Subscription = new Subscription();
  userInfo!:UserI | null;

  urgencies:any[] = [
    {
      _id: '1',
      name: 'Leve',
      color: 'rgba(0, 195, 42, 1)'
    },
    {
      _id: '2',
      name: 'Grave',
      color: 'rgba(255, 184, 32, 1)'
    },    {
      _id: '3',
      name: 'Urgente',
      color: 'rgba(234, 72, 80, 1)'
    },
  ];

  paciente!:UserI | null
  loading:boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private authService: AuthService,
    private usersService: UsersService,
    private alertsService: AlertsService,
    
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:any)=>{
        this.userInfo = userInfo;
        this.userInfo?.roles?.map(r => {
          if(this.userInfo && r.name == 'patient'){
            this.setValue('user',this.userInfo);
            this.paciente = this.userInfo
          }
        })

      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getControl(name:string){
    return this.form1.get(name);
  }

  setValue(name:string,value:any){
    this.form1.get(name)?.setValue(value);
  }

  createForm(){
    this.form1 = this.formBuilder.group({
      user:['',[Validators.required]],
      urgency:['',[Validators.required]],
      
      referencedAppointment:[false,[Validators.required]],
      referencedSubsidiary:['',[Validators.required]],

      underAge:[false,[Validators.required]],
      idUnderAge:['',[]],
      nameUnderAge:['',[]],
      birthdateUnderAge:[,[]],
    });

    Object.assign(this.newAppointmentFormsService.forms,{form1:this.form1})

    this.getControl('referencedSubsidiary')?.disable()

    this.subs.add(
      this.getControl('referencedAppointment')?.valueChanges.subscribe((value:boolean) => {
        if(value){
          this.getControl('referencedSubsidiary')?.enable()
        }else {
          this.getControl('referencedSubsidiary')?.disable()
        }
      })
    );
  }

  createNewUser(){
    const modal = this.ngbModal.open(RegisterUserComponent,{centered:true,scrollable:true, backdrop:'static'});
    modal.result.then((result)=>{
      if(result.reload){

      }
    }).catch(()=>{})
  }

  setUser(user:UserI | null){
    if(user){
      this.deleteUser()
      this.setValue('user',user);
      this.paciente = user
    }else{
      this.deleteUser()
    }
    // User changed — reset form3 so service/medico/date are reselected
    this.newAppointmentFormsService.resetForm3From('all');
  }

  selectMenorEdad(menor:MenorEdadI){
    this.setValue('idUnderAge', menor._id);
    this.setValue('nameUnderAge', menor.name);
    this.setValue('birthdateUnderAge', menor.birthdate);
  }

  getMenoresDeEdad(){
    this.loading =true;
    this.usersService.getMenoresDeEdad(this.paciente?._id).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.menoresDeEdad = res.menoresDeEdad;
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  nextForm(){
    this.formSubmited = true;
    if(this.form1.valid){
      this.nextStepper.emit(true);
    }
  }

  changeUnderAge(){
    const underAge = this.form1.value.underAge
    if(underAge){
      this.resetUndeAge()
    }else {

      const id = this.form1.get('idUnderAge');
      id?.setValidators([Validators.required]);
      id?.updateValueAndValidity();
      
      const name = this.form1.get('nameUnderAge');
      name?.setValidators([Validators.required]);
      name?.updateValueAndValidity();

      const birthdateUnderAge = this.form1.get('birthdateUnderAge');
      birthdateUnderAge?.setValidators([Validators.required]);
      birthdateUnderAge?.updateValueAndValidity();

      this.getMenoresDeEdad()
    }
  }

  deleteUser(){
    this.setValue('user',null);
    this.paciente = null;
    this.setValue('underAge',false);
    
    this.resetUndeAge()
  }

  resetUndeAge(){
    const id = this.form1.get('idUnderAge');
    id?.clearValidators();
    id?.updateValueAndValidity();
    this.setValue('idUnderAge',null);

    const name = this.form1.get('nameUnderAge');
    name?.clearValidators();
    name?.updateValueAndValidity();
    this.setValue('nameUnderAge',null);

    const birthdateUnderAge = this.form1.get('birthdateUnderAge');
    birthdateUnderAge?.clearValidators();
    birthdateUnderAge?.updateValueAndValidity();
    this.setValue('birthdateUnderAge',null);

    this.selectMenorEdad
  }

  openNewMenoDeEdad(menor?:MenorEdadI){
    const modal = this.ngbModal.open(NewMenorEdadComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    modal.componentInstance.userId = this.paciente?._id

    modal.result.then((result)=>{
      if(result.reload){
        this.getMenoresDeEdad()
      }
    }).catch(()=>{})
    
  }

  setSubsidiaryReferenced(subsidiary:SubsidiaryI | undefined){
    this.getControl('referencedSubsidiary')?.setValue(subsidiary)
  }
}
