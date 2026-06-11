import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import {finalize, tap,filter} from 'rxjs/operators'
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {
  recoveryPassForm!:FormGroup;
  urlTree:any;
  token:any;
  formSubmited:boolean=false;
  showPassword:boolean=false;
  showPasswordC:boolean=false;
  strongPassword = false;

  cambioExitoso: boolean = false

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AuthService,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
  ) {
      this.urlTree = this.router.parseUrl(this.router.url);
      this.token = this.urlTree.queryParams['token'];
}

  ngOnInit(): void {
    this.createForm();
  }


  createForm(){
    this.recoveryPassForm = this.formBuilder.group({
      password:['',[Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.chechPasswords('password','confirmPassword')});
  }

  chechPasswords(password:string, confirmPassword:string){
    return (formGroup:FormGroup)=>{
      const pass = formGroup.controls[password];
      const confirmPass:any = formGroup.controls[confirmPassword];
      if(pass.errors && !confirmPass.errors['notSame']){
        return;
      }
      if(pass.value !== confirmPass.value){

        confirmPass.setErrors({notSame:true});
      }else{
        confirmPass.setErrors(null);
      }
    }
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  getErrorPasswordMessage() {
    const password = this.recoveryPassForm.get('password');
    if (password?.hasError('required')) {
      return 'La contraseña es requerida'
    }
    return ''
  }

  getErrorConfirmPasswordMessage() {
    if (this.recoveryPassForm.get('confirmPassword')?.hasError('required')) {
      return 'Confirma la nueva contraseña';
    }
    return this.recoveryPassForm.get('confirmPassword')?.hasError('notSame') ? 'Las contraseñas no coiciden' : '';
  }

  async changePassword(){
    this.formSubmited = true;
    if(this.recoveryPassForm.valid){
      
      if(!this.strongPassword){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }
      
      await this.ngxSpinnerService.show('generalSpinner');
      
      this.authService.changePassword({...this.recoveryPassForm.value,token:this.token}).pipe(
        tap((res:any)=>{
          localStorage.setItem('x-access-token', res['token']);
        }),
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin('El cambio de contraseña se realizó con éxito.','success',5000);
          this.cambioExitoso = true
        },
        error:(e)=>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error',5000);
        }
      });

    }
  }

}
