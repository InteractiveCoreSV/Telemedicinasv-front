import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SolicitudMedicoI } from 'src/app/interfaces/solicitud-medico.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SolicitudMedicoService } from 'src/app/services/solicitud-medico.service';

@Component({
  selector: 'app-new-medico-solicitud',
  templateUrl: './new-medico-solicitud.component.html',
  styleUrls: ['./new-medico-solicitud.component.scss']
})
export class NewMedicoSolicitudComponent implements OnInit {

  createMedicoForm!:FormGroup;
  formSubmited:boolean = false;

  medicoToEdit!: SolicitudMedicoI;

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
    private medicosService: SolicitudMedicoService,
    private alertsService: AlertsService,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private change: ChangeDetectorRef
  ) { }

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


  getErrorMessagePhone(){
    const phone_number = this.createMedicoForm.get('phone');
    if(phone_number?.hasError('required')){
      return 'El número de teléfono es requerido'
    }

    return ''
  }


  createForm(){
    this.createMedicoForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      last_names:['',[Validators.required,Validators.pattern(/^[a-zA-Z\u00C0-\u00FF ]*$/)]],
      phone:['',[Validators.required]],
      countryCode: ['+503', []],
      COICode: ['ESA', [Validators.required]],
      mask: ['0000 0000', []], 
      typeDocument:['',[Validators.required]],
      identityNumber: [null, [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:[null,[Validators.required]],
      idInternacional:[null,[Validators.required]],      
      numberColegio:[null,[Validators.required]],
      especialidad:['',[]],

      clinicaMedica:[false,[Validators.required]],
      clinicaName:['',[Validators.required]],
      clinicaAddress:['',[Validators.required]],
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


  async createMedico(){
    this.formSubmited = true;



    if(this.createMedicoForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.medicosService.newSolicitudMedico({...this.createMedicoForm.value}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin('','success');
          this.reset()
        },
        error:(e:any)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  async editMedico(){
    this.formSubmited = true;

    if(this.medicoToEdit.userCreate){
      this.alertsService.toastMixin('La información de esta solicitud ya no puede ser modificada, por que el médico ya fue registrado','warning');
      return
    }

    if(this.createMedicoForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.medicosService.editSolicitudMedico({...this.createMedicoForm.value}).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.createMedicoForm.reset();
          this.reset()
          this.router.navigate(['/dashboard/medicos/solicitudes-medico'],{replaceUrl:true})
        },
        error:(e:any)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  reset(){
    this.createMedicoForm.reset();
    this.getControl('clinicaMedica')?.patchValue(false)
    this.getControl('typeDocument')?.patchValue('DUI')
    this.getControl('COICode')?.patchValue('ESA')
    this.getControl('countryCode')?.patchValue('+503')
    this.getControl('mask')?.patchValue('0000 0000')
    this.change.detectChanges()
    this.formSubmited = false;
    this.especialidad = null
  }

  setEditMedico(){
    this.createMedicoForm.get('_id')?.enable();
    this.createMedicoForm.patchValue(this.medicoToEdit);
    this.createMedicoForm.get('clinicaMedica')?.setValue(this.medicoToEdit.clinicaMedica ? this.medicoToEdit.clinicaMedica : false)
    this.especialidad = this.medicoToEdit.especialidad._id ?? null
  }

  setEspecialidad(especialidad:any){
    this.createMedicoForm.get('especialidad')?.setValue(especialidad)
    this.especialidad = especialidad
  }
}

