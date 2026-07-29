import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectRoleComponent } from 'src/app/components/selects/select-role/select-role.component';
import { MenorEdadI, RoleI, UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { nanoid } from 'nanoid'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewMenorEdadComponent } from 'src/app/components/modals/new-menor-edad/new-menor-edad.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('signature')
  
  public signaturePad!: SignaturePadComponent;
  btnFirmDisable: boolean = true
  btnRehacerFirma: boolean = false
  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 1,
    canvasWidth: 280,
    canvasHeight: 170,
  };
  
  imgFirma!: File | null;

  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  @ViewChild(SelectRoleComponent) selectRoleComponent!:SelectRoleComponent;

  showPassword:boolean =false;

  role!:string | null

  createUserForm!:FormGroup;
  formSubmited:boolean = false;

  userToEdit: UserI = {} as UserI;

  imgsSello:File[] = []

  isMedico:boolean = false

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

  loading:boolean= false
  menoresDeEdad:MenorEdadI[]= []

  roleObjet!:RoleI | null

  especialidad!:string | null

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,  
    private usersService: UsersService,
    private alertsService: AlertsService,
    private ngbModal: NgbModal,
    private ngxSpinnerService: NgxSpinnerService,  
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo: UserI | null) => {
        if (userInfo) {
          this.isMedico = userInfo.roles?.[0]?.name === 'medico';

          if (!this.userToEdit._id && userInfo._id) {
            this.loadFullUserProfile(userInfo._id);
          }
        }
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  private loadFullUserProfile(userId: string): void {
    this.usersService.getUserById(userId).pipe(
      finalize(() => this.changeDetectorRef.detectChanges())
    ).subscribe({
      next: (res: any) => {
        this.userInfo = res.user;
        this.userToEdit = res.user;
        this.setEditUser();
        this.getMenoresDeEdad();
      }
    });
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  updateTypeDocument(item:any){
    this.getControl('typeDocument')?.setValue(item);
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
        this.menoresDeEdad = res.menoresDeEdad;
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

  getErrorMessageRole(){
    const roles = this.createUserForm.get('roles');
    if(roles?.hasError('required')){
      return 'Seleccione un rol para el usuario'
    }

    return ''
  }

  getErroridentityNumberMessage() {
    if (this.createUserForm.get('identityNumber')?.hasError('required')) {
      return 'El número de identidad  es requerido'
    }

    return 'Ingrese bien su número de identidad ';
  }

  createForm(){
    this.createUserForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      userName:[null,[]],
      names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      last_names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      typeDocument:['DUI',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []],
      password:['',[]],
      nameEmergency:['',[Validators.required]],
      phoneEmergency: ['', [Validators.required]],
      countryCodeEmergency: ['+503', [Validators.required]],
      COICodeEmergency: ['ESA', [Validators.required]],
      maskEmergency: ['0000 0000', [Validators.required]],
      roles:['',Validators.required],

      especialidad:['',[]],
    });

    this.createUserForm.get('_id')?.disable();

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
    });
  }

  getControl(field:string){
    return this.createUserForm.get(field);
  }
 
  async editUser(){
    this.formSubmited = true;

    if(this.createUserForm.valid){
      if(!this.strongPassword && this.createUserForm.value.password){
        this.alertsService.toastMixin('La contraseña no es segura','error');
        return ;
      }

      
      await this.ngxSpinnerService.show('generalSpinner');

      const userData = new FormData();
      const data = this.createUserForm.value;

      data.roles = [this.createUserForm.get('roles')?.value]

      userData.append('data',JSON.stringify(data));

      if(this.isMedico && this.userToEdit.firma == null){
        if( this.imgFirma  ){
          userData.append('imgFirma',this.imgFirma);
        }else {
          this.ngxSpinnerService.hide('generalSpinner')
          this.alertsService.toastMixin('La firma son necesaria para continuar','warning');
          return
        }
      }

      if(this.isMedico && this.userToEdit.sello === null){
        if( this.imgsSello.length > 0 ){
          userData.append('imgSello',this.imgsSello[0]);
        }else {
          this.ngxSpinnerService.hide('generalSpinner')
          this.alertsService.toastMixin('El sello es necesario para continuar','warning');
          return
        }
      }

      this.usersService.editMyAccount(userData).pipe(
        tap((res:any)=>{
          localStorage.setItem('x-access-token', res['token']);
        }),
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.userToEdit = res.userUpdate;
          this.authService.userInfo.next(res.userUpdate);
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    } else {
      console.log(this.createUserForm)
      this.alertsService.toastMixin('Debes completar todos los campos requeridos antes de guardar', 'warning');
    }
  }


  setEditUser(){
    this.createUserForm.get('_id')?.enable();

    this.createUserForm.patchValue(this.userToEdit);
    this.updateTypeDocument(this.userToEdit.typeDocument || 'DUI');
    this.createUserForm.get('roles')?.setValue(this.userToEdit.roles?this.userToEdit.roles[0]._id:null);
    this.role = this.userToEdit.roles?this.userToEdit.roles[0]._id:null
    this.createUserForm.get('password')?.setValidators([]);

    if(this.userToEdit.roles?.[0]) this.setRole(this.userToEdit.roles[0])

    this.especialidad = this.userToEdit.especialidad?._id ?? null
  }

  setRole(role:RoleI){
    this.roleObjet = role
    if(role.name === 'patient'){
      this.getControl('email')?.setValidators([Validators.email])
      this.createUserForm.get('email')?.updateValueAndValidity();
    }
      
  }

  changeSello(){
    this.userToEdit = { ...this.userToEdit, sello: null };
  }

  changeFirma(){
    this.userToEdit = { ...this.userToEdit, firma: null };
  }

  //firma digital
  cancelFirm() {
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    this.imgFirma = null
    this.btnFirmDisable = true
    this.signaturePad.on();
  }

  reacerFirma(){
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    this.imgFirma = null;
    this.btnFirmDisable = true;
    this.btnRehacerFirma = false;
    this.signaturePad.on();
  }
  
  aceptFirm() {
    var firmaBase64 = this.signaturePad.toDataURL()
    this.imgFirma = this.dataURLtoFile(firmaBase64,`firma-${this.userInfo?.names}-${this.userInfo?.last_names}-${nanoid()}` )
    this.signaturePad.off();
    this.btnFirmDisable = true;
    this.btnRehacerFirma = true;     
  }

  dataURLtoFile(dataurl:any, filename:any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  drawStart(event: MouseEvent | Touch) {
    this.btnFirmDisable = false
  }

  getErrorImgFirmaMessage(){
    if(this.imgFirma === undefined){
      return 'Signature is required'
    }
    return '';
  }
  // End firma digital

  setEspecialidad(especialidad:any){
    this.createUserForm.get('especialidad')?.setValue(especialidad)
    this.especialidad = especialidad
  }
}

