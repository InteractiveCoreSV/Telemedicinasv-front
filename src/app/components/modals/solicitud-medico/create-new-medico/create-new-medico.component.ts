import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { S } from '@fullcalendar/core/internal-common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SolicitudMedicoI } from 'src/app/interfaces/solicitud-medico.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-new-medico',
  templateUrl: './create-new-medico.component.html',
  styleUrls: ['./create-new-medico.component.scss']
})
export class CreateNewMedicoComponent implements OnInit {

  showPassword:boolean =false;

  createMedicoForm!:FormGroup;
  formSubmited:boolean = false;

  @Input() solicitudMedico!: SolicitudMedicoI;
  
  arancerPerHour:any

  strongPassword = false;
  
  subsidiary!:any

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
  especialidad!:string | null

  constructor(
    private formBuilder: FormBuilder,
    private medicosService: UsersService,
    private alertsService: AlertsService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    public ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.setMedico();
    
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
      subsidiary:['',[Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],      numberColegio:['',[Validators.required]],
      numberRegistro:['',[Validators.required,Validators.pattern(/^\d{11}$/)]],
      arancerPerHour:['',[Validators.required]],
      nameEmergency:['',[]],
      phoneEmergency: ['', []],
      countryCodeEmergency: ['+503', []],
      COICodeEmergency: ['ESA', []],
      maskEmergency: ['0000 0000', []],
      especialidad:['',[]],

      clinicaMedica:[false,[Validators.required]],
      clinicaName:['',[Validators.required]],
      clinicaAddress:['',[Validators.required]],
      clinicaPhone:['',[Validators.required]],
    });

    this.createMedicoForm.get('_id')?.disable();

    this.createMedicoForm.get('clinicaName')?.disable();
    this.createMedicoForm.get('clinicaAddress')?.disable();
    this.createMedicoForm.get('clinicaPhone')?.disable();

    this.createMedicoForm.get('clinicaMedica')?.valueChanges.subscribe(valor => {
      if(valor === true){
        this.createMedicoForm.get('clinicaName')?.enable();
        this.createMedicoForm.get('clinicaAddress')?.enable();
        this.createMedicoForm.get('clinicaPhone')?.enable();
      }else {
        this.createMedicoForm.get('clinicaName')?.disable();
        this.createMedicoForm.get('clinicaAddress')?.disable();
        this.createMedicoForm.get('clinicaPhone')?.disable();
      }
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

   // Este método maneja la entrada de texto del campo
   formatArancerPerHourOnInput(event: any): void {
    let value = event.target.value;
    // Eliminar cualquier carácter no numérico, exceptuando el punto decimal
    value = value.replace(/[^0-9]/g, '');

    // Si el valor no tiene decimales, agregar ".00"
    if (value === '') {
      this.createMedicoForm.get('arancerPerHour')?.setValue('0.00');
      return;
    }
    const numericValue = parseFloat(value) / 100;

    // Actualizar el valor en el formulario
    this.arancerPerHour = numericValue.toFixed(2);

    const valueFloat = parseFloat(this.arancerPerHour);
    this.createMedicoForm.get('arancerPerHour')?.setValue(isNaN(valueFloat) ? 0.00 : valueFloat.toFixed(2));
  }

  setSubsidiary(subsidiary:any){
    this.createMedicoForm.get('subsidiary')?.setValue(subsidiary)
    this.subsidiary = subsidiary._id
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  setEspecialidad(especialidad:any){
    this.createMedicoForm.get('especialidad')?.setValue(especialidad)
    this.especialidad = especialidad
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
      this.medicosService.createUser({...this.createMedicoForm.value,roles,medico:true},this.solicitudMedico._id).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createMedicoForm.reset();
          this.formSubmited = false;
          this.especialidad = null;
          this.ngbActiveModal.close({reload:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  
  setMedico(){
    this.createMedicoForm.patchValue(this.solicitudMedico);
    this.especialidad = this.solicitudMedico.especialidad._id ?? null
    this.createMedicoForm.get('clinicaMedica')?.setValue(this.solicitudMedico.clinicaMedica ? this.solicitudMedico.clinicaMedica : false)
  }
}
