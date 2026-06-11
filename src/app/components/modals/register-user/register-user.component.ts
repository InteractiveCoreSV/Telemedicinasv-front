import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertsService } from 'src/app/services/alerts.service';

declare const $: any;

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  registerForm!:FormGroup;
  formSubmited:boolean=false;
  role!:boolean;
  showPassword:boolean=false;
  showPasswordConfirm:boolean=false

  strongPassword = false;

  isOpenDropdown:boolean = false;

  countries = [
    { countryCode: '+502', name: 'GUATEMALA', COICode: 'GUA', mask: '0000 0000' },
    { countryCode: '+503', name: 'EL SALVADOR', COICode: 'ESA', mask: '0000 0000' },
    { countryCode: '+507', name: 'PANAMÁ', COICode: 'PAN', mask: '0000 0000' },
    { countryCode: '+504', name: 'HONDURAS', COICode: 'HON', mask: '0000 0000' },
    { countryCode: '+505', name: 'NICARAGUA', COICode: 'NCA', mask: '0000 0000' },
    { countryCode: '+506', name: 'COSTA RICA', COICode: 'CRC', mask: '0000 0000' },
  ];

  typesDocuments: string[] = ['DUI','ID internacional','Pasaporte']

  @Output() createUser:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  sexo!:string
  dateBirthday:any

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private changeDetectorRef:ChangeDetectorRef,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
    public ngbActiveModal: NgbActiveModal,

   ) { }


  ngOnInit(): void {
    this.createForm();

  }


  createForm(){
    this.registerForm = this.formBuilder.group({
      names:['',[Validators.required]],
      last_names:['',[Validators.required]],
      email:[null,[Validators.email]],
      userName:[null,[]],
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required]],
      statusRole:[false,[Validators.required]],
      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []],
      nameEmergency:['',[Validators.required]],
      phoneEmergency: ['', [Validators.required]],
      countryCodeEmergency: ['+503', [Validators.required]],
      COICodeEmergency: ['ESA', [Validators.required]],
      maskEmergency: ['0000 0000', [Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],
      sexo:['',[Validators.required]],
      dateBirthday:['',[Validators.required]],
    },
    { validators: this.checkPasswords('password','confirmPassword')}
    );

     this.registerForm.get('typeDocument')?.valueChanges.subscribe(value => {
      if(value === 'Pasaporte'){
        this.getControl('identityNumber')?.setValidators([])
        this.getControl('idInternacional')?.setValidators([])
        this.getControl('passport')?.setValidators([Validators.required])
      }else if(value === 'DUI') {
        this.getControl('passport')?.setValidators([])
        this.getControl('idInternacional')?.setValidators([])
        this.getControl('identityNumber')?.setValidators([Validators.required,Validators.pattern(/^[0-9]+$/)])
      }else if(value === 'ID internacional') {
        this.getControl('passport')?.setValidators([])
        this.getControl('identityNumber')?.setValidators([])
        this.getControl('idInternacional')?.setValidators([Validators.required])
      }

      this.registerForm.get('identityNumber')?.updateValueAndValidity();
      this.registerForm.get('passport')?.updateValueAndValidity();
      this.registerForm.get('idInternacional')?.updateValueAndValidity();
    });

    this.getControl('typeDocument')?.patchValue('DUI')
  }

  getControl(field:string){
    return this.registerForm.get(field);
  }

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
  } 

  async register(){
    this.formSubmited = true;
    this.getControl('sexo')?.setValue(this.sexo);

    if(!this.getControl('email')?.value && !this.getControl('userName')?.value){
      this.alertsService.toastMixin('Ingrese el correo electrónico o nombre de usuario','warning',4000);
      return
    }
    //
    if(this.registerForm?.valid){

      if(!this.strongPassword){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }
      await this.ngxSpinnerService.show('generalSpinner');

      this.authService.registerUserModal( {...this.registerForm.value}, true ).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin('El usuario se registro con exito.','success',8000);
          this.ngbActiveModal.close()
        },
        error:(e)=>{
          if (e?.error?.errors && Object.keys(e.error.errors).length > 0) {
              const firstErrorKey = Object.keys(e.error.errors)[0];
              const msg = e.error.errors[firstErrorKey]?.msg || 'Ocurrió un error';
              this.alertsService.toastMixin(msg, 'error');
            } else if (e?.error?.message) {
              this.alertsService.toastMixin(e.error.message, 'error');
            } else {
              this.alertsService.toastMixin('Ocurrió un error inesperado', 'error');
            }
          }
      });

    }
  }

  cancelar(){
    this.ngbActiveModal.close()
  }

  // Validar Contraseña
  checkPasswords(password:string,confirmPassword:string) {
    return (formGroup:FormGroup)=>{
      const pass = formGroup.controls[password];
      const confirmPass:any = formGroup.controls[confirmPassword];
      if(pass.errors && !confirmPass.errors['notSame']){
        return;
      }
      if(pass.value !== confirmPass.value){
        confirmPass.setErrors({notSame:true})
      }else{
        confirmPass.setErrors(null);
      }
    }
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  // Mensajes del formulario
  getErrorNamesMessage(){
    const names = this.registerForm?.get('names');
    if(names?.hasError('required')){
      return 'Los nombres son requeridos'
    }
    return '';
  }

  getErrorLastNamesMessage(){
    const last_names = this.registerForm?.get('last_names');
    if(last_names?.hasError('required')){
      return 'Los apellidos son requeridos'
    }
    return '';
  }

  getErrorPhoneMessage(){
    const phone = this.registerForm?.get('phone');
    if(phone?.hasError('required')){
      return 'El número teléfonico es requerido'
    }
    return '';
  }

  getErrorBrandMessage(){
    const brand = this.registerForm?.get('brand');
    if(brand?.hasError('required')){
      return 'La marca es requerida'
    }
    return '';
  }

   getErrorEmailMessage() {
    if (this.registerForm?.get('email')?.hasError('required')) {
      return 'El E-mail es requerido';
    }

    return 'El E-mail inválido';
  }

  getErrorPasswordMessage() {

    if (this.registerForm?.get('password')?.hasError('required')) {
      return 'La contraseña es requerida.';
    }

    return '';
  }

  getErroridentityNumberMessage() {
    if (this.registerForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad es requerido'
    }

    return 'Ingrese bien su número de identidad ';
  }

  getErrorConfirmPasswordMessage() {
    if (this.registerForm?.get('confirmPassword')?.hasError('required')) {
      return 'La confirmación de la contraseña es requerida.';
    }

    return this.registerForm?.get('confirmPassword')?.hasError('notSame') ? 'Las contraseñas no coiciden' : '';
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
