import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-medico',
  templateUrl: './register-medico.component.html',
  styleUrls: ['./register-medico.component.scss']
})
export class RegisterMedicoComponent implements OnInit {

  showPassword:boolean = false;

  createMedicoForm!:FormGroup;
  formSubmited:boolean = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private medicosService: UsersService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    public ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  getErrorMessageEmail(){
    const email = this.createMedicoForm.get('email');
    if(email?.hasError('required')){
      return 'El email es requerido'
    }

    return 'El email es inválido'
  }

  getErrorMessageName(){
    const full_name = this.createMedicoForm.get('names');
    if(full_name?.hasError('required')){
      return 'El nombre es requerido'
    }

    return 'El nombre solo debe llevar espacios y letras'
  }

  getErroridentityNumberMessage() {
    if (this.createMedicoForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad es requerido'
    }

    return 'Ingrese bien su número de identidad ';
  }

  getErrorMessagePassword(){
    const password = this.createMedicoForm.get('password');
    if(password?.hasError('required')){
      return 'La contraseña es requerida'
    }

    return ''
  }

  getErrorMessagePhone(){
    const phone_number = this.createMedicoForm.get('phone');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
  }

  createForm(){
    this.createMedicoForm = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      names:['',[Validators.required,Validators.pattern(/^[a-zA-ZÀ-ÿ ]*$/)]],
      last_names:['',[Validators.required,Validators.pattern(/^[a-zA-ZÀ-ÿ ]*$/)]],
      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []],
      password:['',[Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],
    });

    this.createMedicoForm.get('typeDocument')?.valueChanges.subscribe(value => {
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

      this.createMedicoForm.get('identityNumber')?.updateValueAndValidity();
      this.createMedicoForm.get('passport')?.updateValueAndValidity();
      this.createMedicoForm.get('idInternacional')?.updateValueAndValidity();
    });
    this.getControl('typeDocument')?.patchValue('DUI')
  }

  getControl(field:string){
    return this.createMedicoForm.get(field);
  }

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  async createMedico(){
    this.formSubmited = true;

    if(!this.strongPassword){
      this.alertsService.toastMixin('La contraseña no es segura','error');
      return ;
    }

    if(this.createMedicoForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      const roles = [this.createMedicoForm.get('roles')?.value];
      this.medicosService.createUser({...this.createMedicoForm.value,roles,medico:true}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.ngbActiveModal.close({reload:true});
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
    }else {
      this.alertsService.toastMixin('Complete todos los campos requeridos','error');
    }
  }

}
