import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { NgxPermissionsModule, NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { finalize } from 'rxjs';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxMaskDirective } from 'ngx-mask';
import { Fancybox } from '@fancyapps/ui';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import { SelectDateAndHourModalComponent } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/select-date-and-hour-modal/select-date-and-hour-modal.component';
import { ConfirmReagendaCitaComponent } from '../confirm-reagenda-cita/confirm-reagenda-cita.component';
import { ViewExpedienteComponent } from '../../expedientes/view-expediente/view-expediente.component';
import { SelectServiceModalComponent } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/select-service-modal/select-service-modal.component';
import { ServiceI } from 'src/app/interfaces/service.interface';
import { PayAppointmentComponent } from '../pay-appointment/pay-appointment.component';
import { ViewHistoryChangesStatusComponent } from '../view-history-changes-status/view-history-changes-status.component';
import { ViewSummaryFichasMedicasComponent } from '../../ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component';


@Component({
  selector: 'app-view-detail-appointment-modal',
  templateUrl: './view-detail-appointment-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    PipesModule,
    NgxMaskDirective,
    FormsModule,
    NgxPermissionsModule,
    RouterModule,
    NgxPermissionsAllowStubDirective
],
  providers: [DatePipe,TitleCasePipe],

})
export class ViewDetailAppointmentModalComponent implements OnInit {

  appointment!: AppointmentI;

  date:any;
  hour:any;
  extraordinaria:any

  loading:boolean = true;

  idAppointment!:string

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private appointmentsService: AppointmentsService,
    private router: Router,
    private datePipe: DatePipe,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loading = true
    this.getAppointment()
  }

  getAppointment(){
    this.appointmentsService.getAppointmentById(this.appointment._id).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointment = res.appointment;
        this.idAppointment = this.appointment._id ? this.appointment._id : ''
      })
    })
  }

  iniciarConsulta() {
    this.router.navigate(['/dashboard/ficha-medica/nueva-ficha-medica', this.idAppointment]);
    this.ngbActiveModal.close({close:true})
  }

  viewAtt(src:any){
    new Fancybox(
      [
        {
          src: src,
          type: "image",
        },
      ]
    );
  }

  openModalSelectService(){
    const modal = this.ngbModal.open(SelectServiceModalComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    modal.componentInstance.category = this.appointment.typeAppoinment._id

    modal.componentInstance.servicesAppointment = this.appointment.service.map(s => s._id)
    modal.componentInstance.servicesSelected = this.appointment.service

    modal.result.then((result)=>{
      if(result.service){
        this.appointment.service.includes(result.service)
        const services:ServiceI[] = this.appointment.service
        this.appointment.total = 0; 
        services.forEach(s => {
          this.appointment.total = this.appointment.total + Number(s.price);
        });

        this.updateAppointment()
      }
    }).catch(()=>{})
    
  }

  async updateAppointment(){
    const data = {
      _id:this.appointment._id,
      total: this.appointment.total,
      service: this.appointment.service.map(s => s._id)
    }

    await this.ngxSpinnerService.show('generalSpinner');
    this.appointmentsService.updateAppointment(data).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.appointmentsService.updateAppointmets$.next(true)
        this.alertsService.toastMixin(res.message,'success');
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    })
  }

  remitirPaciente(appointment:AppointmentI){
    this.appointmentsService.appointmentRemisionSelected$.next(structuredClone(appointment));
  }
  
  async payRequest(){
    if(this.appointment.status === 'pending_payment'){
      const modal = this.ngbModal.open(PayAppointmentComponent,{centered:true});
      modal.componentInstance.status = this.appointment.status;
      modal.componentInstance.appointmentId = this.appointment._id;
      modal.componentInstance.virtual = this.appointment.typeAppoinment.online;
      modal.componentInstance.total = this.appointment.total;

      modal.result.then((result)=>{
        if(result?.reload){
          this.getAppointment()
        }
      });
      return
    }

  }

  openModalViewDocument(url:string,key:string){
    const modal = this.ngbModal.open(ViewDocumentComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.url = url
    modal.componentInstance.typeDocument = 'pdf'
    modal.componentInstance.name = key
  }

  openViewExpediente(patient:any,menorEdad:any){   
    const modalRef = this.ngbModal.open(ViewExpedienteComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.idPaciente = patient;
    modalRef.componentInstance.menorSelect = menorEdad && menorEdad._id ? menorEdad : null;
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
  
  dowloaderInfoAppointment(appointment: AppointmentI) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });
  
    const imagePath = 'assets/logos/telemedicina.png';
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const xMargin = 10;
    const lineSpacing = 7;
    const sectionSpacing = 16;
    const padding = 5;
    const pageBottomMargin = 20; // Define el margen inferior
  
    // Función para agregar imágenes con verificación de espacio
    const addImageWithCheck = (pdf:any, imageUrl:any, xPosition:any, yPosition:any, imgWidth:any, imgHeight:any, availableHeight:any) => {
      const imageBottom = yPosition + imgHeight;
  
      if (imageBottom > availableHeight) {
        pdf.addPage();
        yPosition = 20; // Restablece la posición inicial de la Y
      }
  
      pdf.addImage(imageUrl, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + lineSpacing; // Ajuste después de la Image
  
      return yPosition;
    };
  
    this.loadImageAsDataURL(imagePath).then((imageDataUrl: any) => {
      const imgWidth = 55;
      const imgHeight = 17;
      const xPositionImg = 152;
      const yPositionImg = 15;
  
      // Añadir Image de encabezado
      pdf.addImage(imageDataUrl, 'PNG', xPositionImg, yPositionImg, imgWidth, imgHeight);
  
      const currentDate = new Date();
      // Título "Ficha Médica"
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(46, 74, 118);
      pdf.setFontSize(25);
      pdf.text('Telemedicina Analiza El Salvador', 10, 25);
      pdf.setTextColor(103, 119, 136);
      pdf.setFontSize(12);
      pdf.text(`${this.datePipe.transform(currentDate, 'EEEE, MMMM d, y hh:mm a')}`, 10, 32);
  
      let yPos = 45; // Posición inicial en Y
  
      const addPageIfNeeded = () => {
        if (yPos + sectionSpacing > pageHeight - pageBottomMargin) {
          pdf.addPage();
          yPos = 20;
        }
      };
  
      // Línea de separación
      pdf.setLineWidth(0.5);
      addPageIfNeeded();
      pdf.line(xMargin, yPos - 10, pageWidth - xMargin, yPos - 10);
  
      // Título de la sección
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(46, 74, 118);
      const titleXPosition = pageWidth / 2;
      pdf.text('Cita Médica', titleXPosition, yPos, { align: 'center' });
      yPos += lineSpacing;
  
      // Configuración para los campos y valores
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
  
      // Posición de los títulos (campo) y los valores (valor), ambos alineados a la izquierda
      let campoXPosition = xMargin + padding; // Títulos alineados a la izquierda
      let valorXPosition = campoXPosition; // Los valores estarán alineados en el mismo lugar que los títulos
  
      //-------------- Campo 1: PASIENTE
      pdf.setTextColor(46, 74, 118);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Paciente:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setFont("helvetica", "normal");


      pdf.setTextColor(0, 0, 0);
      pdf.text(`Nombre:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text((appointment.user.names ?? '') + ' ' + (appointment.user.last_names ?? ''), valorXPosition, yPos - 1);
      yPos += lineSpacing;
      addPageIfNeeded();

      pdf.setTextColor(0, 0, 0);
      pdf.text(`Correo electrónico:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text(appointment.user.email ?? 'Sin correo registrado', valorXPosition, yPos - 1);
      yPos += lineSpacing;
      addPageIfNeeded();

      // Primera línea: títulos
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Teléfono:`, campoXPosition, yPos);
      pdf.text(`${appointment.user.typeDocument}:`, campoXPosition + 65, yPos);

      // Segunda línea: valores
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text(`${appointment.user.countryCode} ${appointment.user.phone}`, campoXPosition, yPos);

      if(appointment.user.typeDocument === 'DUI'){
        pdf.text(this.formatDocument(appointment.user.identityNumber ?? ''), campoXPosition + 65, yPos);
      }

      if(appointment.user.typeDocument === 'ID internacional'){
        pdf.text(appointment.user.idInternacional ?? '', campoXPosition + 65, yPos);
      }

      if(appointment.user.typeDocument === 'Pasaporte'){
        pdf.text(appointment.user.passport ?? '', campoXPosition + 65, yPos);
      }

      yPos += lineSpacing;
      addPageIfNeeded();
      //--------------

      //--------------
      if(appointment.underAge && appointment.nameUnderAge && appointment.birthdateUnderAge){
      pdf.setTextColor(46, 74, 118);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Datos del Menor de edad:`, campoXPosition, yPos);
      yPos += lineSpacing ;
      pdf.setFont("helvetica", "normal");

      // Primera línea: títulos
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Nombre:`, campoXPosition, yPos);
      pdf.text(`Fecha de nacimiento:`, campoXPosition + 115, yPos);

       // Segunda línea: valores
       yPos += lineSpacing;
       pdf.setTextColor(103, 119, 136);
       pdf.text(appointment.nameUnderAge ?? '', campoXPosition, yPos);

       const rawDateUnderAge: string = this.datePipe.transform(appointment.birthdateUnderAge, 'EEEE, MMMM d, y') ?? '';
       const capitalizedDayUnderAge = rawDateUnderAge ? rawDateUnderAge.charAt(0).toUpperCase() + rawDateUnderAge.slice(1) : '';
      pdf.text(capitalizedDayUnderAge, campoXPosition + 115, yPos - 1);

      //-------------

      yPos += lineSpacing;
      addPageIfNeeded();
    }
    //--------------

     //-------------- Campo 1: PASIENTE
     pdf.setTextColor(46, 74, 118);
     pdf.setFont("helvetica", "bold");
     pdf.text(`Contacto de emergencia:`, campoXPosition, yPos);
     yPos += lineSpacing;
     pdf.setFont("helvetica", "normal");

      // Primera línea: títulos
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Nombre:`, campoXPosition, yPos);
      pdf.text(`Teléfono:`, campoXPosition + 115, yPos);

       // Segunda línea: valores
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text(appointment.user.nameEmergency ?? '', campoXPosition, yPos);
      pdf.text(`${appointment.user.countryCodeEmergency ?? ''} ${appointment.user.phoneEmergency ?? ''}`.trim(), campoXPosition + 115, yPos - 1);

      //-------------

      yPos += lineSpacing;
      addPageIfNeeded();
     //--------------

      pdf.setTextColor(46, 74, 118);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Datos de la cita:`, campoXPosition, yPos);
      yPos += lineSpacing ;
      pdf.setFont("helvetica", "normal");

      pdf.setTextColor(0, 0, 0);
      pdf.text(`Estado de la cita:`, campoXPosition, yPos);
      pdf.text(`Nivel de urgencia:`, campoXPosition + 115, yPos);

       // Segunda línea: valores
       yPos += lineSpacing;
       pdf.setTextColor(103, 119, 136);
       pdf.text(this.statusName(appointment.status), campoXPosition, yPos);

      pdf.text(appointment.urgency ?? '', campoXPosition + 115, yPos - 1);

      //-------------

      yPos += lineSpacing;
      addPageIfNeeded();

      pdf.setTextColor(0, 0, 0);
      pdf.text(`Tipo de cita:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text(appointment.typeAppoinment?.name ?? '', valorXPosition, yPos - 1);
      yPos += lineSpacing;
      addPageIfNeeded();

      //-------------- Campo 3: Sucursal
      if(appointment && appointment.subsidiary){
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Sucursal:`, campoXPosition, yPos);
        yPos += lineSpacing;
        pdf.setTextColor(103, 119, 136);
        pdf.text(appointment.subsidiary.name , valorXPosition, yPos - 1);
        yPos += lineSpacing;
        addPageIfNeeded();
      }
      
      if(appointment && appointment.meetingTool){
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Aplicacion preferida para la cita:`, campoXPosition, yPos);
        yPos += lineSpacing;
        pdf.setTextColor(103, 119, 136);
        pdf.text(appointment.meetingTool.name , valorXPosition, yPos - 1);
        yPos += lineSpacing;
        addPageIfNeeded();
      }
      //--------------

         //-------------- Campo 3: cita referida
      if(appointment && appointment.referencedAppointment){
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Cita referida por parte de la clinica:`, campoXPosition, yPos);
        yPos += lineSpacing;
        pdf.setTextColor(103, 119, 136);
        pdf.text(appointment.referencedSubsidiary?.name ?? '', valorXPosition, yPos - 1);
        yPos += lineSpacing;
        addPageIfNeeded();
      }

      //-------------- Campo 4: Servicios
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Servicios:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);

      (appointment.service ?? []).forEach(s => {
        pdf.text(`- ${s.name ?? ''} ($ ${s.price ?? ''})`, valorXPosition, yPos - 1);
        yPos += lineSpacing;
        addPageIfNeeded();
      })
      //--------------

      //-------------- 
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Médico: ${appointment.medico?.especialidad?.name ?? ''}`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text((appointment.medico?.names ?? '') + ' ' + (appointment.medico?.last_names ?? ''), valorXPosition, yPos - 1);
      yPos += lineSpacing;
      addPageIfNeeded();
      //--------------

      //--------------
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Fecha y Hora:`, campoXPosition, yPos);
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      const rawDate: string = this.datePipe.transform(appointment.dateAppointment, 'EEEE, MMMM d, y') ?? '';
      let capitalizedDay = rawDate ? rawDate.charAt(0).toUpperCase() + rawDate.slice(1) : '';
      pdf.text(`${capitalizedDay} de ${appointment.hour?.hours ?? ''}`, valorXPosition, yPos);      yPos += lineSpacing;
      addPageIfNeeded();
      //--------------

      //-------------- Campo 4: Información de pago
      pdf.setTextColor(46, 74, 118);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Información de pago:`, campoXPosition, yPos);
      yPos += lineSpacing ;
      pdf.setFont("helvetica", "normal");

      // Primera línea: títulos
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Metodo de pago:`, campoXPosition, yPos);
      pdf.text(`Total pagado:`, campoXPosition + 90, yPos);

      // Segunda línea: valores
      yPos += lineSpacing;
      pdf.setTextColor(103, 119, 136);
      pdf.text(`${this.methodPayment(appointment.typePayment, appointment.status)}`, campoXPosition, yPos);
      pdf.text(`$${appointment.total}`, campoXPosition + 90, yPos);      
      yPos += lineSpacing;
      //--------------
      //--------------
  
      // Guardar el PDF
      pdf.save(`Cita | ${capitalizedDay} de ${appointment.hour?.hours ?? ''}`);
    });
  }

  methodPayment(typePayment:string, status:string): string {
    if(typePayment == 'cash'){
      return status === 'Completed' ? 'Pago en sucursal' : 'Pago pendiente en sucursal'
    }

    if(typePayment == 'insurance'){
      return 'Pago con aseguradora'
    }

    if(typePayment == 'transferencia'){
      return 'Pago por transferencia'
    }

    return 'Pago con tarjeta'
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

  formatDocument(document: string | number): string {
    const documentNumber = String(document).replace(/\D/g, '');
    return documentNumber.replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3');
  }

  formatPhoneNumber(phone: string | number): string {
    const phoneStr = phone.toString();
    if (phoneStr.startsWith("503") && phoneStr.length === 11) {
      return `+503 ${phoneStr.slice(3)}`;
    }

    if (phoneStr.length === 8) {
      return `+503 ${phoneStr}`;
    }

    return phoneStr; // Retorna el número sin formato si no cumple la condición
  }

  statusName(status:string){
    if(status == 'Reserved'){
      return `Reservada`;
    }

    if(status == 'Completed'){
      return `Completada`;
    }

    if(status == 'Refuse'){
      return `Cancelada`;
    }

    if(status == 'Confirmed'){
      return `Confirmada`;
    }

    if(status == 'Pending'){
      return `Pendiente`;
    }

    if(status == 'InProgress'){
      return `En Consulta`;
    }

    return '-';
  }

  async appintmentReprogramin(){

    const modalRef = this.ngbModal.open(SelectDateAndHourModalComponent,{centered:true,size:'lg',backdrop:'static'});
    modalRef.componentInstance.medico = this.appointment.medico._id;

    if(this.date){
      modalRef.componentInstance.dateSelectedForm = this.date;
    }

    modalRef.componentInstance.userID = this.appointment.user._id;

    if(this.appointment.subsidiary){
      modalRef.componentInstance.subsidiary = this.appointment.subsidiary._id
    }

    try {
      const {date} = await modalRef.result;
      if(date){
        this.date= date;

        const data = {
          typeAppoinment: this.appointment.typeAppoinment,
          meetingTool: this.appointment.meetingTool,

          user:this.appointment.user,

          underAge:this.appointment.underAge,
          idUnderAge:this.appointment.idUnderAge,
          nameUnderAge:this.appointment.nameUnderAge,
          birthdateUnderAge:this.appointment.birthdateUnderAge,

          urgency:this.appointment.urgency,

          subsidiary:this.appointment.subsidiary,

          service:this.appointment.service,
          medico: this.appointment.medico,
          dateAppointment: this.date.date,
          hour: this.date.hour,
    
          documentAppointment: this.appointment.documentAppointment,
          commentAppointment:this.appointment.commentAppointment,

          typePayment:this.appointment.typePayment,
          insurance: this.appointment.insurance,
          insuranceName:  this.appointment.insuranceName,
          imgComprobante:this.appointment.imgComprobante,

          total:this.appointment.total,

          status: this.appointment.typeAppoinment.online === true ? 'Pending' : 'Reserved',

    
          reprogramada:true,
          extraordinaria:this.date.extraordinaria,
        };

        this.ngbActiveModal.close()

        const modalRefConfirm = this.ngbModal.open(ConfirmReagendaCitaComponent,{centered:true,size:'lg',backdrop:'static'});
        modalRefConfirm.componentInstance.appointment = data
      }
    } catch (error) {
      console.log(error)
    }
  }

  async viewHistoriStatus(appointment:AppointmentI){

    const modalRef = this.ngbModal.open(ViewHistoryChangesStatusComponent,{centered:true,size:'md',backdrop:'static'});
    modalRef.componentInstance.history = appointment.historyStatus;
    modalRef.componentInstance.status = appointment.status;
    modalRef.componentInstance.typeCancel = appointment.typeCancel;
    modalRef.componentInstance.commentCancel = appointment.commentCancel;
    modalRef.componentInstance.motivoCancel = appointment.motivoCancel;

  }
}
