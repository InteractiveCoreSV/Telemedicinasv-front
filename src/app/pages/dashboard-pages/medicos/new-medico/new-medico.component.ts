import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { strict } from 'assert';
import * as dayjs from 'dayjs';

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
  
  arancerPerHour:any

  strongPassword = false;
  
  subsidiary!:any
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
    this.agregarSubespecialidad();
    this.agregarEducacion();
    // this.changeDetectorRef.detectChanges()

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
      subsidiary:['',[Validators.required]],
      typeDocument:['',[Validators.required]],
      identityNumber: ['', [Validators.required,Validators.pattern(/^[0-9]+$/)]],
      passport:['',[Validators.required]],
      idInternacional:['',[Validators.required]],      numberColegio:['',[Validators.required]],
      numberRegistro:['',[Validators.required,Validators.pattern(/^\d{11}$/)]],
      arancerPerHour:['',[Validators.required]],
      especialidad:['',[]],
      especialidadInstitucion:['',[]],
      especialidadYear:['',[]],
      cursos:['',[]],
      diplomas: ['', []],

      phoneEmergency: ['', []],
      nameEmergency:['',[]],
      countryCodeEmergency: ['+503', []],
      COICodeEmergency: ['ESA', []],
      maskEmergency: ['0000 0000', []],

      clinicaMedica:[false,[Validators.required]],
      clinicaName:['',[Validators.required]],
      clinicaAddress:['',[Validators.required]],
      clinicaPhone:['',[Validators.required]],

      yearStartedPracticing:['',[Validators.required]],

      educacion: this.formBuilder.array([]),
      // especialidades: this.formBuilder.array([]),
      subespecialidades: this.formBuilder.array([]),
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

  //edicacion
  get educacion(): FormArray {
    return this.createMedicoForm.get('educacion') as FormArray;
  }

  newEducacion(): FormGroup {
    return this.formBuilder.group({
      institucion: ['', Validators.required],
      year: ['', [Validators.required]]
    });
  }

  agregarEducacion() {
    this.educacion.push(this.newEducacion());
  }

  eliminarEducacion(index: number) {
    this.educacion.removeAt(index);
  }

  //Subespecialidad
  get subespecialidades(): FormArray {
    return this.createMedicoForm.get('subespecialidades') as FormArray;
  }

  newSubespecialidad(): FormGroup {
    return this.formBuilder.group({
      name: ['', []],
      year: ['', []],
      institucion: ['', []]
    });
  }

  agregarSubespecialidad() {
    this.subespecialidades.push(this.newSubespecialidad());
  }

  eliminarSubespecialidad(i: number) {
    this.subespecialidades.removeAt(i);
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
    if (!subsidiary) return;
    this.createMedicoForm.get('subsidiary')?.setValue(subsidiary);
    this.subsidiary = subsidiary._id;
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
          this.subsidiary = null
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
    this.createMedicoForm.get('clinicaMedica')?.setValue(this.medicoToEdit.clinicaMedica ? this.medicoToEdit.clinicaMedica : false)
    this.getControl('password')?.setValidators([])
    this.createMedicoForm.get('password')?.updateValueAndValidity();

    this.subsidiary = this.medicoToEdit.subsidiary?._id
    this.especialidad = this.medicoToEdit.especialidad?._id ?? null

    if(this.medicoToEdit.educacion && this.medicoToEdit.educacion.length > 0){
      this.cargarEducacion(this.medicoToEdit.educacion);
    }

    if(this.medicoToEdit.subespecialidades && this.medicoToEdit.subespecialidades.length > 0){
      this.cargarSubespecialidades(this.medicoToEdit.subespecialidades);
    }

    this.changeDetectorRef.detectChanges();
  }

  cargarEducacion(educacion: any[]) {
    const formArray = this.createMedicoForm.get('educacion') as FormArray;
    formArray.clear();
    if (!educacion || educacion.length === 0) return;

    educacion.forEach(e => {
      formArray.push(this.formBuilder.group({
        institucion: [e.institucion, [Validators.required]],
        year: [e.year, [Validators.required]]
      }));
    });
        this.changeDetectorRef.detectChanges();

  }

  cargarSubespecialidades(subs: any[]) {
    const formArray = this.createMedicoForm.get('subespecialidades') as FormArray;
    formArray.clear();

    if (!subs || subs.length === 0) return;

    subs.forEach(s => {
      formArray.push(this.formBuilder.group({
        name: [s.name, []],
        institucion: [s.institucion, []],
        year: [new Date(s.year), []]
      }));
    });
  }



  changeDateEnter(value: string, item: any) {

    if (!value) {
      return;
    }

    if (value.length !== 10) {
      return;
    }

    const [day, month, year] = value.split('/');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);

    if (!isNaN(date.getTime())) {
      item.get('year')?.setValue(date, { emitEvent: false });
    }
  }

  changeDateCalendar(value: any, item: any) {
    if (!value) return;

    const formatted = dayjs(value).format('DD/MM/YYYY');

    // Actualiza el input de máscara visualmente:
    item.get('year')?.setValue(value, { emitEvent: false });

    // También puedes guardar el string si lo prefieres:
    // item.get('year')?.setValue(formatted);
  }

  changeDateEnterForm(value: string, item: string) {

    if (!value) {
      return;
    }

    if (value.length !== 10) {
      return;
    }


    const [day, month, year] = value.split('/');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    if (!isNaN(date.getTime())) {
      this.createMedicoForm.get(item)?.setValue(date, { emitEvent: false });
      this.changeDetectorRef.detectChanges();
    }
  }

  changeDateCalendarForm(value: any, item: any) {
    if (!value) return;

    this.createMedicoForm.get(item)?.setValue(value, { emitEvent: false });
    this.changeDetectorRef.detectChanges()
  }

}
