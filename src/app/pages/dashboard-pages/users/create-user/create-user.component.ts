import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SelectRoleComponent } from 'src/app/components/selects/select-role/select-role.component';
import { MenorEdadI, RoleI, UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NewMenorEdadComponent } from 'src/app/components/modals/new-menor-edad/new-menor-edad.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styles: [
  ]
})
export class CreateUserComponent implements OnInit {

  @ViewChild(SelectRoleComponent) selectRoleComponent!:SelectRoleComponent;

  showPassword:boolean =false;

  strongPassword:boolean =false;

  // optionsDatePicker:FlatpickrDefaultsInterface={
  //   altFormat: 'j F, Y',
  //   mode:'single',
  //   static:true
  // }
  role!:string | null
  roleObjet!:RoleI | null

  createUserForm!:FormGroup;
  formSubmited:boolean = false;

  userToEdit!:UserI;

  currentRole!:string

  isOpenDropdown:boolean = false;

  countries = [
    { countryCode: '+502', name: 'GUATEMALA', COICode: 'GUA', mask: '0000 0000' },
    { countryCode: '+503', name: 'EL SALVADOR', COICode: 'ESA', mask: '0000 0000' },
    { countryCode: '+507', name: 'PANAMÁ', COICode: 'PAN', mask: '0000 0000' },
    { countryCode: '+504', name: 'HONDURAS', COICode: 'HON', mask: '0000 0000' },
    { countryCode: '+505', name: 'NICARAGUA', COICode: 'NCA', mask: '0000 0000' },
    { countryCode: '+506', name: 'COSTA RICA', COICode: 'CRC', mask: '0000 0000' },
  ];

  loading:boolean= false

  menoresDeEdad:MenorEdadI[]= []
  habilitarMenores:boolean= false

  sowUserName:boolean= false

  typesDocuments: string[] = ['DUI','ID internacional','Pasaporte']

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private alertsService: AlertsService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private authService: AuthService ,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(user => {
      if(user && user.roles && user.roles.length > 0){
        this.currentRole = user.roles[0].name
      }
    })

    this.createForm();
    this.userToEdit = history.state?.user;

    if(this.userToEdit){
      console.log(this.userToEdit)
      this.setEditUser();
      this.getMenoresDeEdad()
    }
  }

  getErrorMessageEmail(){
    const email = this.createUserForm.get('email');
    if(email?.hasError('required')){
      return 'El email es requerido'
    }

    return 'El email es inválido'
  }

  getErrorMessageName(){
    const full_name = this.createUserForm.get('names');
    if(full_name?.hasError('required')){
      return 'El nombre es requerido'
    }

    return 'El nombre solo debe llevar espacios y letras'
  }

  getErrorMessagePhoneNumber(){
    const phone_number = this.createUserForm.get('phone_number');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
  }



  getErrorMessagePassword(){
    const password = this.createUserForm.get('password');
    if(password?.hasError('required')){
      return 'La contraseña es requerida'
    }

    return ''
  }

  getErrorMessagePhone(){
    const phone_number = this.createUserForm.get('phone');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
  }

  
  getErroridentityNumberMessage() {
    if (this.createUserForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad es requerido'
    }

    return 'Ingrese bien su número de identidad ';
  }
  

  getErrorMessageRole(){
    const roles = this.createUserForm.get('roles');
    if(roles?.hasError('required')){
      return 'Seleccione un rol para el usuario'
    }

    return ''
  }

  createForm(){
    this.createUserForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      email:[null,[Validators.required,Validators.email]],
      userName:[null,[]],
      names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      last_names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []],
      password:['',[Validators.required]],
      roles:['',Validators.required],
      nameEmergency:['',[Validators.required]],
      phoneEmergency: ['', [Validators.required]],
      countryCodeEmergency: ['+503', [Validators.required]],
      COICodeEmergency: ['ESA', [Validators.required]],
      maskEmergency: ['0000 0000', [Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],
    });

    this.createUserForm.get('_id')?.disable();

    if(this.currentRole === 'sac'){
      this.createUserForm.get('roles')?.disable();
      this.sowUserName = true;
      this.getControl('email')?.setValidators([Validators.email])
      this.createUserForm.get('email')?.updateValueAndValidity();
    }

    this.createUserForm.get('roles')?.valueChanges.subscribe(v => {
      const campos = [
        'nameEmergency',
        'phoneEmergency',
        'countryCodeEmergency',
        'COICodeEmergency',
        'maskEmergency'
      ];

      const idsSinEmergencia = [
        '66a7ed006502d3db82c5c97d',
        '66a7ed006502d3db82c5c97b',
        '684898922bf27c1d939e6273',
        '684898922bf27c1d939e6275'
      ];

      if (idsSinEmergencia.includes(v)) {
        campos.forEach(campo => {
          this.createUserForm.get(campo)?.clearValidators();
          this.createUserForm.get(campo)?.updateValueAndValidity();
        });
      } else {
        campos.forEach(campo => {
          this.createUserForm.get(campo)?.setValidators([Validators.required]);
          this.createUserForm.get(campo)?.updateValueAndValidity();
        });
      }
    });

    this.createUserForm.get('typeDocument')?.valueChanges.subscribe(value => {
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

      this.createUserForm.get('identityNumber')?.updateValueAndValidity();
      this.createUserForm.get('passport')?.updateValueAndValidity();
      this.createUserForm.get('idInternacional')?.updateValueAndValidity();

      this.getControl('identityNumber')?.setValue(null)
      this.getControl('passport')?.setValue(null)
      this.getControl('idInternacional')?.setValue(null)
    });

    this.getControl('typeDocument')?.patchValue('DUI')
  }

  getControl(field:string){
    return this.createUserForm.get(field);
  }

  setRole(role:RoleI | null){
    if(role){
      this.roleObjet = role
      if(role.name === 'patient'){
        this.getControl('email')?.setValidators([Validators.email])
        this.createUserForm.get('email')?.updateValueAndValidity();
      }else {
        this.notIdPatien(role)
      }
    }else {
      this.notIdPatien(null)
    }
  }

  notIdPatien(role:RoleI | null){
    this.roleObjet = role;
    this.getControl('email')?.setValidators([Validators.required,Validators.email])
    this.createUserForm.get('email')?.updateValueAndValidity();

    this.getControl('userName')?.setValue(null)
  }
  
  async createUser(){
    this.formSubmited = true;

    if(((this.roleObjet && this.roleObjet.name === 'patient' && (!this.getControl('email')?.value) || this.sowUserName === true) && !this.getControl('userName')?.value)){
      this.alertsService.toastMixin('Ingrese el correo electrónico o nombre de usuario','warning',4000);
      return
    }

    if(this.createUserForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      const roles = [this.createUserForm.get('roles')?.value];
      this.usersService.createUser({...this.createUserForm.value,roles}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createUserForm.reset();
          this.formSubmited = false;
          this.getControl('typeDocument')?.patchValue('DUI')

          this.selectRoleComponent.cleanSelect();
    },
        error:(e)=>{
          console.log(e)
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

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  async editUser(){
    this.formSubmited = true;

    if(this.roleObjet && this.roleObjet.name === 'patient' && (!this.getControl('email')?.value && !this.getControl('userName')?.value)){
      this.alertsService.toastMixin('Ingrese el correo electrónico o nombre de usuario','warning',4000);
      return
    }

    if(this.createUserForm.valid){
      if(!this.strongPassword && this.createUserForm.value.password){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }

      await this.ngxSpinnerService.show('generalSpinner');

      const roles = [this.createUserForm.get('roles')?.value];
      this.usersService.editUser({...this.createUserForm.value,roles}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createUserForm.reset();
          this.formSubmited = false;

          this.selectRoleComponent.cleanSelect();
          this.getControl('typeDocument')?.patchValue('DUI')

          
          this.router.navigate(['/dashboard/usuarios/ver-usuarios'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }


  setEditUser(){
    this.createUserForm.get('_id')?.enable();

    this.createUserForm.patchValue(this.userToEdit);

    // Re-aplicar campos de identidad porque el valueChanges de typeDocument los resetea a null
    this.getControl('identityNumber')?.setValue(this.userToEdit.identityNumber ?? null);
    this.getControl('passport')?.setValue(this.userToEdit.passport ?? null);
    this.getControl('idInternacional')?.setValue(this.userToEdit.idInternacional ?? null);

    this.createUserForm.get('roles')?.setValue(this.userToEdit.roles?this.userToEdit.roles[0]._id:null);
    this.role = this.userToEdit.roles?this.userToEdit.roles[0]._id:null

    this.setRole(this.userToEdit.roles ? this.userToEdit.roles[0] : null)
    
    this.createUserForm.get('password')?.setValidators([]);
  }

  
  openNewMenoDeEdad(menor?:MenorEdadI){
      const modal = this.ngbModal.open(NewMenorEdadComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});
  
      modal.componentInstance.userId = this.userToEdit._id
  
      if(menor){
        modal.componentInstance.edit = menor
      }
  
      modal.result.then((result)=>{
        if(result.reload){
          this.getMenoresDeEdad()
        }
      }).catch(()=>{})
      
    }
  
    getMenoresDeEdad(){
      this.loading =true;
      this.usersService.getMenoresDeEdad(this.userToEdit._id).pipe(
        finalize(()=>{
          this.loading = false;
        })
      ).subscribe({
        next:(res:any)=>{
          this.menoresDeEdad = res?.menoresDeEdad;
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      })
    }
  
    async deleteMenorEdad(idUser:any,nameMenor:string, idMenorEdad:any){
      const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar al menor de edad ${nameMenor}?`,'warning');
      if(result.isConfirmed){
          await this.ngxSpinnerService.show('generalSpinner');
        this.usersService.deleteMenorEdad(idUser,idMenorEdad).pipe(
          finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
        ).subscribe({
          next:(res:any)=>{
            this.getMenoresDeEdad();
          },
          error:(e)=>{
            console.log(e)
            this.alertsService.toastMixin(e['error']['message'],'error');
          }
        });
      }
    }
    
}
