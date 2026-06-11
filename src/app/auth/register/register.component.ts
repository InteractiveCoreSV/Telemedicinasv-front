import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertsService } from 'src/app/services/alerts.service';
import * as dayjs from 'dayjs';


declare const $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {

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
  sexo!:string
  dateBirthday:any

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private alertsService: AlertsService
   ) { }


  ngOnInit(): void {
    this.createForm();

  }

  createForm(){
    this.registerForm = this.formBuilder.group({
      names:['',[Validators.required]],
      last_names:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required]],
      phone: ['', [Validators.required]],
      countryCode: ['+503', [Validators.required]],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', [Validators.required]],
      nameEmergency:['',[Validators.required]],
      phoneEmergency: ['', [Validators.required]],
      countryCodeEmergency: ['+503', [Validators.required]],
      COICodeEmergency: ['ESA', [Validators.required]],
      maskEmergency: ['0000 0000', [Validators.required]],
      typeDocument:['DUI',[Validators.required]],
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

  register(){
    this.formSubmited = true;
    this.getControl('sexo')?.setValue(this.sexo);
    if(this.registerForm?.valid){

      if(!this.strongPassword){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }

      this.authService.register(
       {...this.registerForm.value}
      )
    }
  }

  getControl(field:string){
    return this.registerForm.get(field);
  }

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
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

    getErroridentityNumberMessage() {
    if (this.registerForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad es requerido'
    }

    return 'Ingrese bien su número de identidad';
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
