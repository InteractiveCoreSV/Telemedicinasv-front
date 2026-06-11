import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-sexo-birthday',
  templateUrl: './update-sexo-birthday.component.html',
  styleUrls: ['./update-sexo-birthday.component.scss']
})
export class UpdateSexoBirthdayComponent implements OnInit {
  registerForm!:FormGroup;
  @Input() pacienteId!:string
  @Input() identityNumber!:string

  formSubmited:boolean=false;

  sexo!:string
  dateBirthday:any

  constructor(
    private formBuilder: FormBuilder,
    private usersService:UsersService,
    private alertsService: AlertsService,
    public ngbActiveModal: NgbActiveModal,
    private ngxSpinnerService: NgxSpinnerService
   ) { }


  ngOnInit(): void {
    this.createForm();
    console.log(this.identityNumber)
  }

  createForm(){
    this.registerForm = this.formBuilder.group({
      sexo:['',[Validators.required]],
      dateBirthday:['',[Validators.required]],
      identityNumber:['',[Validators.required]],
    },
    );

    if(this.identityNumber){
      this.registerForm.get('identityNumber')?.disable()
    }

  }

  getControl(field:string){
    return this.registerForm.get(field);
  }

  register(){
    this.formSubmited = true;
    this.getControl('sexo')?.setValue(this.sexo);
    if(this.registerForm?.valid){

      this.usersService.editUserForCRM({...this.registerForm.value, _id: this.pacienteId}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.ngbActiveModal.close({update:true, paciente:res.userUpdate})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      }); 
    }
  }

   getErrordateBirthdayMessage(){
      const dateBirthday = this.registerForm?.get('dateBirthday');
      if(dateBirthday?.hasError('required')){
        return 'La fecha de nacimiento es requerida'
      }
      return '';
    }
    
    
    changeDateEnter(){
      const day = this.dateBirthday.substring(0, 2);
      const month = this.dateBirthday.substring(2, 4);
      const year = this.dateBirthday.substring(4, 8);
      const date = new Date(`${year}-${month}-${day}T00:00:00`);
      this.registerForm.patchValue({dateBirthday:date});
  
    }
  
    changeDateCalendar(){
      let date = this.registerForm.get('dateBirthday')?.value
      date = dayjs(date).format('DD/MM/YYYY')
      const dateArray = date.split('/');
      this.dateBirthday = `${dateArray[0]}${dateArray[1]}${dateArray[2]}`
    }
}
