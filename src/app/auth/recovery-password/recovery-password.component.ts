import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import {finalize, tap,filter} from 'rxjs/operators'
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styles: [
  ]
})
export class RecoveryPasswordComponent implements OnInit {

  emailForm!:FormControl;
  submited:boolean=false;
  sendEmail:boolean=false;

  constructor(
    private authService:AuthService,
    private ngxSpinnerService:NgxSpinnerService,
    private alertService:AlertsService
  ) { }

  ngOnInit(): void {
    this.emailForm = new FormControl('',[Validators.required,Validators.email]);
  }

  getEmailErrorMessage(){
    const email  = this.emailForm;

    if(email.hasError('required')){
      return 'El E-mail es requerido';
    }

    return 'Ingrese un E-mail válido'
  }

  send(){
    this.submited = true;
    if(this.emailForm.valid){
      this.ngxSpinnerService.show('generalSpinner');
      this.authService.recovery(this.emailForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          if(res.ok === true){
            this.sendEmail = true
          }
        },error:(e:any)=>{
            this.alertService.toastMixin('Email no encontrado.','error')
        }
      })

    }else{
      console.log('no valid')
    }
  }

}
