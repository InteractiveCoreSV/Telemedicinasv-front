import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RoleI, UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-create-nurse',
  templateUrl: './create-nurse.component.html',
  styles: [
  ]
})
export class CreateNurseComponent implements OnInit {

  showPassword:boolean = false;
  strongPassword:boolean = false;

  createNurseForm!:FormGroup;
  formSubmited:boolean = false;

  userToEdit!:UserI;

  nurseRoleId!:string;

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
    private usersService: UsersService,
    private rolesService: RolesService,
    private alertsService: AlertsService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getNurseRole();

    this.userToEdit = history.state?.user;

    if(this.userToEdit){
      this.setEditNurse();
    }
  }

  getNurseRole(){
    this.rolesService.getAllRoles().subscribe({
      next:(res:any)=>{
        const roles:RoleI[] = res.roles;
        const nurseRole = roles.find(role => role.name === 'nurse');
        this.nurseRoleId = nurseRole ? nurseRole._id : '';
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  getErrorMessageEmail(){
    const email = this.createNurseForm.get('email');
    if(email?.hasError('required')){
      return 'El correo electrónico es requerido'
    }

    return 'El correo electrónico es inválido'
  }

  getErrorMessageName(){
    const full_name = this.createNurseForm.get('names');
    if(full_name?.hasError('required')){
      return 'El nombre es requerido'
    }

    return 'El nombre solo debe llevar espacios y letras'
  }

  getErrorMessagePassword(){
    const password = this.createNurseForm.get('password');
    if(password?.hasError('required')){
      return 'La contraseña es requerida'
    }

    return ''
  }

  getErrorMessagePhone(){
    const phone_number = this.createNurseForm.get('phone');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
  }

  getErroridentityNumberMessage() {
    if (this.createNurseForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad es requerido'
    }

    return 'Ingrese bien su número de identidad ';
  }

  createForm(){
    this.createNurseForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
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

    this.createNurseForm.get('_id')?.disable();

    this.createNurseForm.get('typeDocument')?.valueChanges.subscribe(value => {
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

      this.createNurseForm.get('identityNumber')?.updateValueAndValidity();
      this.createNurseForm.get('passport')?.updateValueAndValidity();
      this.createNurseForm.get('idInternacional')?.updateValueAndValidity();

      this.getControl('identityNumber')?.setValue(null)
      this.getControl('passport')?.setValue(null)
      this.getControl('idInternacional')?.setValue(null)
    });

    this.getControl('typeDocument')?.patchValue('DUI')
  }

  getControl(field:string){
    return this.createNurseForm.get(field);
  }

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  async createNurse(){
    this.formSubmited = true;

    if(!this.nurseRoleId){
      this.alertsService.toastMixin('Aún se están cargando los datos, intenta de nuevo en un momento','warning',4000);
      return;
    }

    if(this.createNurseForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.usersService.createUser({...this.createNurseForm.value, roles:[this.nurseRoleId]}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createNurseForm.reset();
          this.formSubmited = false;
          this.getControl('typeDocument')?.patchValue('DUI')
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

  async editNurse(){
    this.formSubmited = true;

    if(!this.nurseRoleId){
      this.alertsService.toastMixin('Aún se están cargando los datos, intenta de nuevo en un momento','warning',4000);
      return;
    }

    if(this.createNurseForm.valid){
      if(!this.strongPassword && this.createNurseForm.value.password){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return;
      }

      await this.ngxSpinnerService.show('generalSpinner');

      this.usersService.editUser({...this.createNurseForm.value, roles:[this.nurseRoleId]}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.router.navigate(['/dashboard/enfermeras/ver-enfermeras'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  setEditNurse(){
    this.createNurseForm.get('_id')?.enable();

    this.createNurseForm.patchValue(this.userToEdit);

    this.getControl('identityNumber')?.setValue(this.userToEdit.identityNumber ?? null);
    this.getControl('passport')?.setValue(this.userToEdit.passport ?? null);
    this.getControl('idInternacional')?.setValue(this.userToEdit.idInternacional ?? null);

    this.createNurseForm.get('password')?.setValidators([]);
    this.createNurseForm.get('password')?.updateValueAndValidity();
  }

}
