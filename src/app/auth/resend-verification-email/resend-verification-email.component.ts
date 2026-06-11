import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-resend-verification-email',
  templateUrl: './resend-verification-email.component.html',
  styles: [
  ]
})
export class ResendVerificationEmailComponent implements OnInit {

  emailForm!:FormControl;
  sendEmail:boolean=false;
  submited:boolean=false;

  constructor(
    private authService:AuthService,
    private alertService:AlertsService,
    private ngxSpinnerService:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.emailForm = new FormControl('',[Validators.required, Validators.email]);
  }

  getEmailErrorMessage(){
    const email = this.emailForm;

    if(email.hasError('required')){
      return 'El E-mail es requerido';
    }
    return 'Ingrese un E-mail válido';
  }

  send(){
    this.submited = true;
    if(this.emailForm.valid){
      this.ngxSpinnerService.show('generalSpinner');
      this.authService.resendValidationAccountCode(this.emailForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          if(res.ok===true){
            this.sendEmail = true
          }
        },error:(e:any)=>{
            const message = e['error']['message'];
            const message2 = e.error.errors?.email.msg
           this.alertService.toastMixin(message?message:message2?message2:'Hubo un error, intentalo de nuevo','error');
        }
      })
    }
  }

}
