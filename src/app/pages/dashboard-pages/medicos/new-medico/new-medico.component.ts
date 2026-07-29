import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-medico',
  templateUrl: './new-medico.component.html',
  styleUrls: ['./new-medico.component.scss']
})
export class NewMedicoComponent implements OnInit {

  showPassword:boolean =false;

  createMedicoForm!:FormGroup;
  formSubmited:boolean = false;

  medicoToEdit!: UserI;

  strongPassword = false;

  especialidad!:string | null

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
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private changeDetectorRef:ChangeDetectorRef
  )
     { }

  ngOnInit(): void {
    this.createForm();

    this.medicoToEdit = history.state?.medico;
    if(this.medicoToEdit){
      this.setEditMedico();
    }
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

  getErrorMessagePhoneNumber(){
    const phone_number = this.createMedicoForm.get('phone_number');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
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

  getErrorMessageRole(){
    const roles = this.createMedicoForm.get('roles');
    if(roles?.hasError('required')){
      return 'Seleccione un rol para el usuario'
    }

    return ''
  }

  createForm(){
    this.createMedicoForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      last_names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []],      password:['',[Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],
      numberColegio:['',[Validators.required]],
      especialidad:['',[]],

      nameEmergency:['',[]],
      phoneEmergency: ['', []],
      countryCodeEmergency: ['+503', []],
      COICodeEmergency: ['ESA', []],
      maskEmergency: ['0000 0000', []],
    });

    this.createMedicoForm.get('_id')?.disable();

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

  setEspecialidad(especialidad:any){
    this.createMedicoForm.get('especialidad')?.setValue(especialidad)
    this.especialidad = especialidad
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
          this.createMedicoForm.reset();
          this.formSubmited = false;
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

  async editMedico(){
    this.formSubmited = true;

    if(this.createMedicoForm.valid){
      if(!this.strongPassword && this.createMedicoForm.value.password){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }

      await this.ngxSpinnerService.show('generalSpinner');

      const roles = [this.createMedicoForm.get('roles')?.value];
      this.medicosService.editUser({...this.createMedicoForm.value,roles,medico:true}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createMedicoForm.reset();
          this.especialidad = null
          this.formSubmited = false;

          this.router.navigate(['/dashboard/medicos'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }else {
      this.alertsService.toastMixin('Complete todos los campos requeridos','error');
    }
  }

  setEditMedico(){
    this.createMedicoForm.get('_id')?.enable();
    this.createMedicoForm.patchValue(this.medicoToEdit);
    this.getControl('password')?.setValidators([])
    this.createMedicoForm.get('password')?.updateValueAndValidity();

    this.especialidad = this.medicoToEdit.especialidad?._id ?? null

    this.changeDetectorRef.detectChanges();
  }

}
