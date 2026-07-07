import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ViewDocumentComponent } from 'src/app/components/modals/appointments/view-document/view-document.component';
import { ViewExpedienteComponent } from 'src/app/components/modals/expedientes/view-expediente/view-expediente.component';
import { GenerateReferenciaComponent } from 'src/app/components/modals/ficha-medica/generate-referencia/generate-referencia.component';
import { GenerateTratamientoComponent } from 'src/app/components/modals/ficha-medica/generate-tratamiento/generate-tratamiento.component';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { CampoFichaMedicaI, SectionFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { MenorEdadI, UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UsersService } from 'src/app/services/user.service';
import { differenceInMinutes, format, parse } from 'date-fns';
import { ViewDetailAppointmentModalComponent } from 'src/app/components/modals/appointments/view-detail-appointment-modal/view-detail-appointment-modal.component';
import { ViewSummaryFichasMedicasComponent } from 'src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component';

@Component({
  selector: 'app-new-ficha-medica',
  templateUrl: './new-ficha-medica.component.html',
  styleUrls: ['./new-ficha-medica.component.scss']
})
export class NewFichaMedicaComponent {
  form!: FormGroup;
  fichaMedica:SectionFichaMedicaI[]= []
  fichaMedicaSectionWoman!:SectionFichaMedicaI
  idFichaMedica!:any;

  womanControles:any = []
  isWoman:boolean = false
  forSelectWoman:boolean | null = false

  formSubmited:boolean = false

  // Definimos la configuración del formulario
  formConfig:any ;
  formConfigWoman:any = {};

  loading:boolean = true;

  generatePdf:boolean = false;

  idAppointment!:any;
  appointment!:AppointmentI;

  age!:string;
  sexo!:string;
  address!:string

  medico!:UserI;

  estudios:any[] = []
  tratamientos:any[] = []

  fichaMedicaPdf: any;
 
  ngxSpinnerService = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  ngbModal = inject(NgbModal);

  alertsService = inject(AlertsService);
  appointmentsService = inject(AppointmentsService);
  authService = inject(AuthService);

  firma: any;
  sello:any

  constructor(
    private fb: FormBuilder,
    private fichaMendicaService: FichaMedicaService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.idAppointment = this.route.snapshot.paramMap.get('idAppointment');

    this.authService.getUserInfo().subscribe(user => {
      if(user){
        this.medico = user

        this.userService.getUserById(user._id!).subscribe({
          next: (res: any) => {
            const fullUser = res.user;
            this.medico = { ...this.medico, firma: fullUser.firma, sello: fullUser.sello };

            if (fullUser.firma?.location) {
              this.utilsService.getImageAsBase64(fullUser.firma.location).subscribe({
                next: (r: any) => { this.firma = r.img; },
                error: (e: any) => { console.error(e); }
              });
            }

            if (fullUser.sello?.location) {
              this.utilsService.getImageAsBase64(fullUser.sello.location).subscribe({
                next: (r: any) => { this.sello = r.img; },
                error: (e: any) => { console.error(e); }
              });
            }
          },
          error: (e: any) => { console.error(e); }
        });
      }
    })

    this.getAppointment()



  }

  async viewDetailAppointment(appointment:AppointmentI){
    const modal = this.ngbModal.open(ViewDetailAppointmentModalComponent,{centered:true, size:'lg'});
    modal.componentInstance.appointment = appointment;

    try {
      const result = await modal.result;

      if(result.close){
        // this.ngbActiveModal.close()
      } 
    } catch (error) {}

  }

  calcTimeAppointment(hourStart:any,dateStart:any){
    const hourDone:any =  new Date()
 
    const hourSave = format(hourDone, 'hh:mm a');

    const horaInicio = parse(hourStart, 'hh:mm aa', new Date(dateStart));
    const horaFin = parse(hourSave, 'hh:mm aa', new Date());

    const diferenciaEnMinutos = differenceInMinutes(horaFin, horaInicio);

    const horas = Math.floor(diferenciaEnMinutos / 60);
    const minutos = diferenciaEnMinutos % 60;

    // Creamos el texto de la diferencia
    let timeAppointmentText
    if (horas > 0 && minutos > 0) {
      timeAppointmentText = `${horas} horas  y ${minutos} minutos`;
    } else if (horas > 0) {
      timeAppointmentText = `${horas} horas `;
    } else if (minutos > 0) {
      timeAppointmentText = `${minutos} minutos`;
    } else {
      timeAppointmentText = '0 minutos';
    }

    const data = {
      timeAppointmentInMinute: Number(diferenciaEnMinutos),
      timeAppointmentText: timeAppointmentText,
      houdDone: horaFin,
      dateDone: new Date(),
      ...this.appointment.timeStatusInProgress
    }

    return data
  }

  async changeStatus(){
      let timeStatusInProgress:any = {}
  
      const ahora = new Date();

      const fechaActual = ahora.toISOString();
  
      const horaMilitar = format(ahora, 'HH');
  
      const hora12Horas = format(ahora, 'hh:mm a');
  
      timeStatusInProgress = {
        fechaActual:fechaActual,
        horaMilitar:horaMilitar,
        hora12Horas:hora12Horas
      }

      this.appointment.timeStatusInProgress = timeStatusInProgress
      
      this.formSubmited = true
      await this.ngxSpinnerService.show('generalSpinner');
      this.appointmentsService.changeStatusInProgress(this.idAppointment,'InProgress', timeStatusInProgress,this.appointment.medico._id).pipe(
            tap((res:any)=>{
              this.authService.updateToke(res['token'])
            }),
            finalize(async()=>{
              await this.ngxSpinnerService.hide('generalSpinner');
            })
          ).subscribe({
        next:((res:any)=>{
          this.alertsService.toastMixin(res.message,'success');
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }

  async getAppointment(){
    this.appointmentsService.getAppointmentById(this.idAppointment).subscribe({
      next:((res:any)=>{
        this.appointment = res.appointment;

        if(this.appointment.user.age && !this.appointment.underAge) this.age = this.appointment.user.age.toString()
        if(this.appointment.user.address) this.address = this.appointment.user.address

        if(this.appointment.underAge) this.forSelectWoman = null

        this.getFichaMedica()

        const terminalStatuses = ['InProgress', 'Completed', 'Refuse'];
        if(!terminalStatuses.includes(this.appointment.status)){
          this.changeStatus()
        }

      })
    })
  }

  getFichaMedica(){
    this.loading = true;

    this.fichaMendicaService.getFichaMedicaSections(this.appointment.underAge).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{

        this.idFichaMedica = res.fichaMedicaSections._id
        this.fichaMedica = res.fichaMedicaSections.sections ;
        this.fichaMedicaSectionWoman = res.fichaMedicaSections.seccionWoman
        
        this.formConfig = this.fichaMedica.reduce((config:any, fichaMedica) => {
          fichaMedica.campos.forEach((campo: CampoFichaMedicaI) => {
            config[campo.name] = { required: campo.required };

            if(campo.unidades.length === 1){
              config[campo.name + 'Unidades'] = { required: true,value:campo.unidades[0]};
            } else  if(campo.unidades.length > 0){
              config[campo.name + 'Unidades'] = { required: campo.required };
            } 
          });
          return config;
        }, {})

       
        this.buildForm();
      })
    })
  }

  openViewSummaryFichasMedicas(patient:any,menorEdad:any){   
    const modalRef = this.ngbModal.open(ViewSummaryFichasMedicasComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.idPaciente = patient;
    modalRef.componentInstance.menorSelect = menorEdad && menorEdad._id ? menorEdad : null;

    const infoPatient  = {
      user:this.appointment.user,
      underAge:this.appointment.underAge,
      idUnderAge:this.appointment.idUnderAge,
      nameUnderAge:this.appointment.nameUnderAge,
      birthdateUnderAge:this.appointment.birthdateUnderAge,
    }

    modalRef.componentInstance.infoPatient = infoPatient;

  }
  

  selectIsWoman(){
    if(this.forSelectWoman){
      this.addControlsWoman()
      this.isWoman = true
    }else {
      this.isWoman = false
      this.eliminarControlesForWoman()
    }
  }

  addControlsWoman(){
    this.fichaMedicaSectionWoman.campos.forEach((campo: CampoFichaMedicaI) => {

      this.formConfigWoman[campo.name] = { required: campo.required };

      if(campo.userCampo == 'procedimientos'){
        this.formConfigWoman[campo.name] = { 
          required: true, 
          value: campo.selectMultiple ? this.appointment.user.procedimientos : this.appointment.user.procedimientos ? this.appointment.user.procedimientos[0] : '' 
        };
      }

      if(campo.userCampo == 'planificacion'){
        this.formConfigWoman[campo.name] = { 
          required: true, 
          value: campo.selectMultiple ? this.appointment.user.planificacion : this.appointment.user.planificacion ? this.appointment.user.planificacion[0] : '' 
        };
      }
  
      if (campo.unidades.length === 1) {
        this.formConfigWoman[campo.name + 'Unidades'] = { required: true, value: campo.unidades[0] };
      } else if (campo.unidades.length > 0) {
        this.formConfigWoman[campo.name + 'Unidades'] = { required: campo.required };
      }
    });

    
    Object.keys(this.formConfigWoman).forEach((key) => {
      const controlConfig = this.formConfigWoman[key];
      const validators = [];

      // Si el campo es requerido, añadimos el validador 'required'
      if (controlConfig.required) {
        validators.push(Validators.required);
      }

      if (!this.form.contains(key)) {
        // Añadimos el nuevo control al formulario
        this.form.addControl(key, this.fb.control(controlConfig.value || null, validators));
        this.womanControles.push(key); // Guarda el nombre del control
      }
    });
  }

  eliminarControlesForWoman() {
    this.womanControles.forEach((controlName:any) => {
      if (this.form.contains(controlName)) {
        this.form.removeControl(controlName);
      }
    });
  
    // Limpiamos el arreglo después de eliminar los controles
    this.womanControles = [];
  }

  buildForm() {
    const controls:any = {};
    
    // Iteramos sobre el objeto de configuración para crear los controles
    Object.keys(this.formConfig).forEach((key) => {
      const controlConfig = this.formConfig[key];
      const validators = [];

      // Si el campo es requerido, añadimos el validador 'required'
      if (controlConfig.required) {
        validators.push(Validators.required);
      }

      // Añadimos el control al grupo de controles
      controls[key] = [controlConfig.value ? controlConfig.value : null , validators];
    });



    // Creamos el formulario con los controles dinámicamente
    this.form = this.fb.group(controls);

  }

  setValue(name:string,value:string){
    this.form.get(name)?.setValue(value)
  }

  async funtionChangeStatus(){
        console.log('changeStatusMedico')

    this.appointmentsService.changeStatus(this.appointment._id ?? '','Completed').pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    })
  }

  async onSubmit() {
    this.formSubmited = true

    if(this.form.valid && this.formSubmited &&this.age) {

      await this.ngxSpinnerService.show('generalSpinner');
      
      this.fichaMedica.map(section => {
        section.campos.map(campo => {
          if(campo.unidades.length > 0){
            campo.value =  `${this.form.get(campo.name)?.value} ${this.form.get(`${campo.name}Unidades`)?.value}`
          }else{
            campo.value = this.form.get(campo.name)?.value
          }
        })
      })

      if(this.fichaMedicaSectionWoman){
        this.fichaMedicaSectionWoman.campos.map(campo => {
          if(campo.unidades.length > 0){
            campo.value =  `${this.form.get(campo.name)?.value} ${this.form.get(`${campo.name}Unidades`)?.value}`
          }else{
            campo.value = this.form.get(campo.name)?.value
          }
        })
      }

      const documento = this.appointment.user.typeDocument === 'DUI' ? this.appointment.user.identityNumber :
                        this.appointment.user.typeDocument === 'Pasaporte' ? this.appointment.user.passport :
                        this.appointment.user.idInternacional

      const data = {
        idFichaMedica: this.idFichaMedica,
        underAge: this.appointment.underAge,
        sections:this.fichaMedica,
        seccionWoman:this.fichaMedicaSectionWoman,
        isWoman:this.isWoman,
        patient:this.appointment.underAge === true? this.appointment.idUnderAge : this.appointment.user._id,
        appointment: this.appointment._id,
        dateAppointment: this.appointment.dateAppointment,
        infoGeneral:{
          name: `${this.appointment.user.names} ${this.appointment.user.last_names}` ,
          phone: `${this.appointment.user.countryCode} ${this.appointment.user.phone}`,
          typeDocument: this.appointment.user.typeDocument,
          identityNumber:documento,
          address: this.address,
          age: this.age,
          sexo: this.sexo
        },
        tratamientos: this.tratamientos.map(({ nameDoc, id, description, generalInfo }: any) => ({ nameDoc, id, description, generalInfo })),
        estudios: this.estudios.map(({ nameDoc, id, description, generalInfo }: any) => ({ nameDoc, id, description, generalInfo })),
        firma: this.medico.firma,
        sello: this.medico.sello,
        timeAppointment: this.calcTimeAppointment(this.appointment.timeStatusInProgress?.hora12Horas, this.appointment.timeStatusInProgress?.fechaActual)
      }

      this.fichaMendicaService.saveFichaMedica(data).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:((res:any) => {
          this.alertsService.toastMixin(res.message,'success');
          const user = this.authService.userInfo.getValue();
          this.funtionChangeStatus();
          this.authService.changeStatusMedico(user?._id,'enLinea')
          this.router.navigate(['/dashboard/calendar'],{replaceUrl:true})
        }),
        error: (async e => {
          this.alertsService.toastMixin(e.error.message,'error');
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      })

    } else {
      this.alertsService.toastMixin('Complete todos los campos necesario','warning')
    }
  }

  formatPhoneNumber(phone: string): string {
    const phoneNumber = phone.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    return phoneNumber.replace(/(\d{1})(\d{3})(\d{4})/, '+($1) $2-$3');
  }

  formatDocument(document: string): string {
    const documentNumber = document.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    return documentNumber.replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3'); // Aplica el formato '0000-0000-00000'
  }

  async loadImageAsDataURL(url:any) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  async newestudio(estudio?:any){
    const modal = this.ngbModal.open(GenerateReferenciaComponent,{centered:true, size:'lg'});

    modal.componentInstance.medico = this.medico;
    modal.componentInstance.paciente = {
      name: `${this.appointment.user.names} ${this.appointment.user.last_names}`,
      age: this.age,
      underAge: this.appointment.underAge,
      nameUnderAge: this.appointment.nameUnderAge,
      birthdateUnderAge: this.appointment.birthdateUnderAge,
      idUnderAge: this.appointment.idUnderAge,
    };
    modal.componentInstance.subsidiary = this.appointment.typeAppoinment?.online === true
      ? 'Colonia Santa fe, contiguo al restaurante Tom-Mi'
      : `${this.appointment.subsidiary?.address?.department}, ${this.appointment.subsidiary?.address?.municipality}, ${this.appointment.subsidiary?.address?.address}`;
    modal.componentInstance.date = new Date();

    if(estudio) {
      modal.componentInstance.nameDoc = estudio.nameDoc;
      modal.componentInstance.description = estudio.description;
      modal.componentInstance.idEstudio = estudio.id;
    }


    try {
      const result = await modal.result;

      if(result){
        const index = this.estudios.findIndex(item => item.id === estudio?.id);
        if (index !== -1) {
          this.estudios[index] = result;
        }else {
          this.estudios.push(result)
        }
      }
    } catch (error) {console.log(error)}
  }

  deleteestudio(estudioId:string){
    this.estudios = this.estudios.filter(ref => ref.id != estudioId)
  }

  async newTratamiento(tratamiento?:any){
    const modal = this.ngbModal.open(GenerateTratamientoComponent,{centered:true, size:'lg'});

    modal.componentInstance.medico = this.medico
    modal.componentInstance.subsidiary = this.appointment.typeAppoinment?.online === true ? 'Colonia Santa fe, contiguo al restaurante Tom-Mi' : `${this.appointment.subsidiary.address.department}, ${this.appointment.subsidiary.address.municipality}, ${this.appointment.subsidiary.address.address}`
    modal.componentInstance.paciente = {
      name: `${this.appointment.user.names} ${this.appointment.user.last_names}`,
      age: this.age,
      underAge: this.appointment.underAge,
      nameUnderAge: this.appointment.nameUnderAge,
      birthdateUnderAge: this.appointment.birthdateUnderAge,
      idUnderAge: this.appointment.idUnderAge,
    }

    if(tratamiento) {
      modal.componentInstance.nameDoc = tratamiento.nameDoc
      modal.componentInstance.description = tratamiento.description
      modal.componentInstance.idTratamiento = tratamiento.id
      modal.componentInstance.subsidiary = tratamiento.subsidiary

    }

    try {
      const result = await modal.result;
      if(result){
        const index = this.tratamientos.findIndex(item => item.id === tratamiento?.id);
        if (index !== -1) {
          this.tratamientos[index]= result;
        }else {
          this.tratamientos.push(result)
        }

      }
    } catch (error) {}
  }

  deleteTratamiento(tratamientoId:string){
    this.tratamientos = this.tratamientos.filter(trat => trat.id != tratamientoId)
  }

  openModalViewDocument(url:string,key:string){
    const modal = this.ngbModal.open(ViewDocumentComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.url = url
    modal.componentInstance.typeDocument = 'pdf'
    modal.componentInstance.name = key
  }

  descargarPDF(pdfBlob:any,nameDoc:string): void {
    if (pdfBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${nameDoc}.pdf`;
      link.click();
    }
  }

  descargarTratamientoPDF(tratamiento: any): void {
    this.fichaMendicaService.previewDocumentPDF({
      category: 'Tratamiento',
      generalInfo: tratamiento.generalInfo,
      firma: this.medico.firma,
      sello: this.medico.sello,
      medico: this.medico,
    }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res.body], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tratamiento.nameDoc}.pdf`;
        link.click();
      },
      error: (e: any) => { this.alertsService.toastMixin('Error al generar el PDF', 'error'); }
    });
  }

  descargarEstudioPDF(estudio: any): void {
    this.fichaMendicaService.previewDocumentPDF({
      category: 'Estudio',
      generalInfo: estudio.generalInfo,
      firma: this.medico.firma,
      sello: this.medico.sello,
      medico: this.medico,
    }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res.body], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${estudio.nameDoc}.pdf`;
        link.click();
      },
      error: (e: any) => { this.alertsService.toastMixin('Error al generar el PDF', 'error'); }
    });
  }

  openViewExpediente(patient:any,menorEdad:any){   
    const modalRef = this.ngbModal.open(ViewExpedienteComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.idPaciente = patient;
    modalRef.componentInstance.menorSelect = menorEdad && menorEdad._id ? menorEdad : null;
  }
}
