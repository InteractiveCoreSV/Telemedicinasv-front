import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { MenorEdadI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-menor-edad',
  templateUrl: './new-menor-edad.component.html',
  styleUrls: ['./new-menor-edad.component.scss']
})
export class NewMenorEdadComponent implements OnInit {

  registerForm!:FormGroup;
  formSubmited:boolean=false;

  birthdate:any
  sexo!:string

  @Input() userId!: string
  @Input() edit!: MenorEdadI

  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
    public ngbActiveModal: NgbActiveModal,
   ) { }


  ngOnInit(): void {
    this.createForm();

    if(this.edit) {
      this.registerForm.patchValue(this.edit)
      this.sexo = this.edit.sexo;

      this.changeDateCalendar()
    }

  }


  createForm(){
    this.registerForm = this.formBuilder.group({
      name:['',[Validators.required]],
      birthdate:['',[Validators.required]],
      sexo:['',[Validators.required]],
    }
    );
  }

  getControl(field:string){
    return this.registerForm.get(field);
  }

  async register(){
    this.formSubmited = true;
        this.getControl('sexo')?.setValue(this.sexo);

    if(this.registerForm?.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.userService.addUnderAgeToProfile( {...this.registerForm.value, userId:this.userId}, ).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin('Se agrego el menor de edad con exito.','success',3000);
          this.ngbActiveModal.close({reload:true})
        },
        error:(e:any)=>{
          const message = e['error']['message'];
          console.log(e)
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      });

    }
  }

  async editUnderAge(){
    this.formSubmited = true;
    this.getControl('sexo')?.setValue(this.sexo);

    if(this.registerForm?.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.userService.editUnderAgeToProfile( {...this.registerForm.value, userId:this.userId, underAgeId: this.edit._id}, ).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin('Se edito el menor de edad con exito.','success',3000);
          this.ngbActiveModal.close({reload:true})
        },
        error:(e:any)=>{
          const message = e['error']['message'];
          console.log(e)
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      });

    }
  }

  cancelar(){
    this.ngbActiveModal.close()
  }

 
  // Mensajes del formulario
  getErrorNamesMessage(){
    const names = this.registerForm?.get('name');
    if(names?.hasError('required')){
      return 'El nombre es requerido'
    }
    return '';
  }

  getErrorBirthdateMessage(){
    const birthdate = this.registerForm?.get('birthdate');
    if(birthdate?.hasError('required')){
      return 'La fecha de nacimiento es requerida'
    }
    return '';
  }


  changeDateEnter(){
    const day = this.birthdate.substring(0, 2);
    const month = this.birthdate.substring(2, 4);
    const year = this.birthdate.substring(4, 8);
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    this.registerForm.patchValue({birthdate:date});

  }

  changeDateCalendar(){
    let date = this.registerForm.get('birthdate')?.value
    date = dayjs(date).format('DD/MM/YYYY')
    const dateArray = date.split('/');
    this.birthdate = `${dateArray[0]}${dateArray[1]}${dateArray[2]}`
  }

}
