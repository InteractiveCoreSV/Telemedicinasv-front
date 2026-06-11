import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { NewDocumentExpedienteComponent } from 'src/app/components/modals/expedientes/new-document-expediente/new-document-expediente.component';
import { VewDocumentExpedienteComponent } from 'src/app/components/modals/expedientes/vew-document-expediente/vew-document-expediente.component';
import { ExpedienteI } from 'src/app/interfaces/document-expediente';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { MenorEdadI, UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';
import { ViewFichaMedicaComponent } from 'src/app/components/modals/ficha-medica/view-ficha-medica/view-ficha-medica.component';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CampoFichaMedicaI, SectionFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { UtilsService } from 'src/app/services/utils.service';
import { GenerateTratamientoComponent } from 'src/app/components/modals/ficha-medica/generate-tratamiento/generate-tratamiento.component';
import { HistoryUserCrmComponent } from 'src/app/components/modals/expedientes/history-user-crm/history-user-crm.component';
import { UpdateSexoBirthdayComponent } from 'src/app/components/modals/user/update-sexo-birthday/update-sexo-birthday.component';
import { ViewSummaryFichasMedicasComponent } from 'src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component';


@Component({
  selector: 'app-detalle-expediente',
  templateUrl: './detalle-expediente.component.html',
  styleUrls: ['./detalle-expediente.component.scss']
})
export class DetalleExpedienteComponent implements OnInit {
  
  userInfo!:UserI | null

  idPaciente!:string;
  paciente!:UserI;
  loading:boolean =true;
  
  loadingExpedientes:boolean = false;
  documentsExpediente:ExpedienteI[] = [];

  loadingFichasMedicas:boolean = false;
  fichasMedicas:any[] = [];

  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  menoresDeEdad: MenorEdadI[] = []
  menorSelect!:MenorEdadI | null;

  filters:any={};
  nameDocumment!:string;
  typingTimer: any

  category!: any
  folders:any[] = [
    {
      name: 'ficha_medica',
      nameEs:'Fichas Médicas'
    },
    {
      name: 'Examen',
      nameEs:'Examenes'
    },
    {
      name: 'Tratamiento',
      nameEs:'Tratamientos'
    },
    {
      name: 'Estudio',
      nameEs:'Estudios'
    },
    {
      name: 'Otro tipo de documento',
      nameEs:'Otros'
    },
  ]

  constructor(
    private usersService: UsersService,
    private alertsService: AlertsService,
    private route: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
    public sanitizer: DomSanitizer,
    private authService:AuthService,
    private fichaMedicaService: FichaMedicaService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private changeDetector:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const _id = params.get('_id'); 
      if(_id){
        this.idPaciente = _id
        this.getUser(_id);
        // this.getDocumentExpedientesUser()
      } 
    });

    this.userInfo = this.authService.userInfo.value

  }

  getUser(idUser:any){
    this.loading =true;

    this.usersService.getUserById(idUser).pipe(
      finalize(()=>{
        this.loading = false;
      })  
    ).subscribe({
      next:(res:any)=>{
        this.paciente = res.user;
        this.getMenoresDeEdad()

      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  getForSearch(){
    this.page = 1
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getDocumentExpedientesUser();
    }, 700);
  }

  getForExpediente(){
    if(this.category.name === 'ficha_medica'){
      this.getFichasMedicas();
    }else {
      this.getDocumentExpedientesUser();
    }
  }

  getDocumentExpedientesUser(){
    this.loadingExpedientes = true
    this.expedienteService.getDocumentExpedientesUser(this.menorSelect ? this.menorSelect._id : this.idPaciente,this.category.name, this.page,this.nameDocumment).pipe(
      finalize(()=>{
        this.loadingExpedientes = false;
      })  
    ).subscribe({
      next: ((res:any) => {
        this.documentsExpediente = res.documents
        this.paginationDetails = res.paginationDetails
      }),
      error: (error => {
        console.log(error)
      })
    })
  }

  getFichasMedicas(){
    this.loadingFichasMedicas = true
    this.fichaMedicaService.getFichaMedicasByPatient(this.menorSelect ? this.menorSelect._id : this.idPaciente, this.page,this.nameDocumment).pipe(
      finalize(()=>{
        this.loadingFichasMedicas = false;
      })  
    ).subscribe({
      next: ((res:any) => {
        this.fichasMedicas = res.documents
        this.paginationDetails = res.paginationDetails
      }),
      error: (error => {
        console.log(error)
      })
    })
  }

  getMenoresDeEdad(){
    // this.loading =true;
    this.usersService.getMenoresDeEdad(this.paciente?._id).pipe(
      finalize(()=>{
        // this.loading = false;
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

  getForMenorEdad(menor:MenorEdadI){
    this.resetExpediente()
    this.menorSelect = menor;
    const invoker = document.querySelector('[data-hs-unfold-target="#datatableFilterSubcategoriesSidebar"]') as HTMLElement;
    if (invoker) invoker.click();
  }

  resetExpediente(){
    this.menorSelect = null
    this.category = null
    this.documentsExpediente = []
    this.fichasMedicas = []
    this.changeDetector.detectChanges()
  }

  openModalNewDocumentExpediente(document?:ExpedienteI){
    const modal = this.ngbModal.open(NewDocumentExpedienteComponent,{centered:true,size:'md',scrollable:true});
    modal.componentInstance.user = this.menorSelect ? this.menorSelect._id : this.idPaciente

    if(document){
      modal.componentInstance.documentToEdit = document
    }

    modal.result.then((result)=>{
      if(result.reload && this.category){
        this.getDocumentExpedientesUser()
      }
    }).catch(()=>{})
  }

  openModalViewDocumentExpediente(document:ExpedienteI){
    const modal = this.ngbModal.open(VewDocumentExpedienteComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.url = document.document?.location
    modal.componentInstance.typeDocument = document.typeDocument
    modal.componentInstance.name = document.name
    modal.componentInstance.expedienteId = document._id
    modal.componentInstance.createByFichaMedica = document.createByFichaMedica
    modal.componentInstance.category = document.category


    if(document.comment){
      modal.componentInstance.comment = document.comment
    }
  }

  async openModalViewHistoryCRM(){
    if(!this.paciente.sexo || !this.paciente.identityNumber){
      const modal = this.ngbModal.open(UpdateSexoBirthdayComponent,{centered:true,scrollable:true});
      modal.componentInstance.pacienteId = this.paciente._id;
      modal.componentInstance.identityNumber = this.paciente.identityNumber;

      try {
        const result = await modal.result;
        if(result.update){
          this.paciente = result.paciente
          this.openHistory()
        }
      } catch (error) {}
    }else {
      this.openHistory()
    }
  }

  openViewSummaryFichasMedicas(){   
    const modalRef = this.ngbModal.open(ViewSummaryFichasMedicasComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.idPaciente = this.paciente._id;
    modalRef.componentInstance.menorSelect = this.menorSelect && this.menorSelect._id ? this.menorSelect : null;

    const infoPatient  = {
      user:this.paciente,
      underAge:this.menorSelect ? true : false,
      idUnderAge:this.menorSelect?._id,
      nameUnderAge:this.menorSelect?.name,
      birthdateUnderAge:this.menorSelect?.birthdate,
    }

    modalRef.componentInstance.infoPatient = infoPatient;
  }

  openHistory(){
    const modal = this.ngbModal.open(HistoryUserCrmComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.dni_paciente = this.paciente.identityNumber
    modal.componentInstance.fecha_nacimiento = this.paciente.dateBirthday
    modal.componentInstance.genero = this.paciente.sexo
  }

  async editTratamientoMedico(tratamiento?:any){
      const modal = this.ngbModal.open(GenerateTratamientoComponent,{centered:true, size:'lg', backdrop:'static'});

        const paciente = {
          name: tratamiento.generalInfo.name,
          age: tratamiento.generalInfo.age,
          underAge: tratamiento.generalInfoo?.underAge ? tratamiento.generalInfoo.underAge : false,
          nameUnderAge: tratamiento.generalInfo?.nameUnderAge ? tratamiento.generalInfo.nameUnderAge : null,
          birthdateUnderAge: tratamiento?.generalInfo.birthdateUnderAge ? tratamiento.generalInfo.birthdateUnderAge : null,
          idUnderAge: tratamiento.generalInfo?.idUnderAge ? tratamiento.generalInfo.idUnderAge : null,
        }
  
        modal.componentInstance.edit = true

        modal.componentInstance.paciente = paciente

        modal.componentInstance.nameDoc = tratamiento.name
        modal.componentInstance.description = tratamiento.generalInfo.description
        modal.componentInstance.idTratamiento = tratamiento._id
        modal.componentInstance.subsidiary = tratamiento.generalInfo.subsidiary
        modal.componentInstance.date = tratamiento.generalInfo.date

        modal.componentInstance.medicoName = tratamiento.medico
        modal.componentInstance.sello = tratamiento.sello.location
        modal.componentInstance.firma = tratamiento.firma.location

        modal.componentInstance.idTratamiento = tratamiento._id

  
      try {
        const result = await modal.result;
        if(result.reload){
          this.getDocumentExpedientesUser()
        }
      } catch (error) {}
    }
  

  openViewFichaMedicaComponent(fichaMedica:any){   
    const modalRef = this.ngbModal.open(ViewFichaMedicaComponent,{centered:true,size:'xl', scrollable:true});
    modalRef.componentInstance.fichaMedica = fichaMedica;
  }

  descargar(name:string,typeDocument:string,expedienteId:any, category:string,forFichaMedica:boolean = false,url?:string){
    if(forFichaMedica === true && category === 'Tratamiento'){
      if(url){
        this.expedienteService.downloadDocumentExpediente(url, `${name}.pdf`);
      }else{
        this.descargarTratamientoPDF(expedienteId);
      }
    }else if(forFichaMedica === true && category === 'Estudio'){
      if(url){
        this.expedienteService.downloadDocumentExpediente(url, `${name}.pdf`);
      }else{
        this.descargarEstudioPDF(expedienteId);
      }
    }else {
      this.expedienteService.downloadDocumentExpediente(url ?? '',`${name}.${typeDocument ==  'pdf' ? 'pdf' : typeDocument ==  'word' ? 'docx' :'png' }`);
    }
  }

  async descargarTratamientoPDF(expedienteId:any){
    await this.ngxSpinnerService.show('generalSpinner');
    this.expedienteService.generatePDFTratamiento(expedienteId).pipe(
      finalize(async() => await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = 'reporte_sprint.pdf';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) fileName = match[1];
        }
        if (!fileName.toLowerCase().endsWith('.pdf')) fileName += '.pdf';
        const blob = new Blob([res.body as Blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      },
      error:(e)=>{ console.log(e) }
    })
  }

  async descargarEstudioPDF(expedienteId:any){
    await this.ngxSpinnerService.show('generalSpinner');
    try {
      const token = this.authService.getToken() ?? '';
      const apiUrl = `${environment.urlApi}/documents-expediente/generatePDFEstudio?expedienteId=${expedienteId}`;
      const response = await fetch(apiUrl, { headers: { 'x-access-token': token } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'estudio.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
      }
      if (!fileName.toLowerCase().endsWith('.pdf')) fileName += '.pdf';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch(e) {
      console.error(e);
    } finally {
      await this.ngxSpinnerService.hide('generalSpinner');
    }
  }

  descargarFichaMedica(fichaMedica:any){
    let firma:any
    this.utilsService.getImageAsBase64(fichaMedica.firma?.location).subscribe(
      (res:any) => {
        firma = res.img;

        let sello:any
        this.utilsService.getImageAsBase64(fichaMedica.sello?.location).subscribe(
          (res:any) => {
              sello = res.img;

              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'letter'
              });
              
              const imagePath = 'assets/logos/telemedicina.png';
              const pageWidth = pdf.internal.pageSize.width;
              const pageHeight = pdf.internal.pageSize.height;
              const xMargin = 10;
              const lineSpacing = 8;
              const sectionSpacing = 10;
              const padding = 5;
              const pageBottomMargin = 20; // Define el margen inferior
              
              this.loadImageAsDataURL(imagePath).then((imageDataUrl:any) => {
                const imgWidth = 45;
                const imgHeight = 13;
                const xPositionImg = 155;
                const yPositionImg = 12;
              
                // Añadir imagen de encabezado
                pdf.addImage(imageDataUrl, 'PNG', xPositionImg, yPositionImg, imgWidth, imgHeight);
              
                // Título "Ficha Médica"
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(46, 74, 118);
                pdf.setFontSize(30);
                pdf.text('Ficha Médica', 10, 25);
              
                let yPos = 40; // Posición inicial en Y
          
                if (yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                  pdf.addPage();
                  yPos = 20;
                }
          
                 // Línea de separación
                 pdf.setDrawColor(46, 74, 118);
                 pdf.setLineWidth(0.5);
                 pdf.line(xMargin, yPos - 8, pageWidth - xMargin, yPos - 8);
             
                 // Título de la sección
                 pdf.setFontSize(16);
                 pdf.setFont("helvetica", "bold");
                 const titleXPosition = pageWidth / 2;
                 pdf.text('Datos generales', titleXPosition, yPos, { align: 'center' });
                 yPos += lineSpacing;
          
                 pdf.setFontSize(12);
                 pdf.setFont("helvetica", "normal");
           
                 //--------------
                 let campoXPosition = xMargin + padding;
                 let valorXPosition = pageWidth - xMargin - padding - 115;
          
                  pdf.setTextColor(46, 74, 118);
                  pdf.text(`Fecha de la cita:`, campoXPosition, yPos);
                  pdf.setTextColor(0, 0, 0);
                  pdf.text(`${this.datePipe.transform(fichaMedica.appointment.dateAppointment, 'MMMM d, y')} de ${fichaMedica.appointment.hour.hours}`, valorXPosition, yPos);
                  yPos += lineSpacing;
                 //--------------
          
                  if(fichaMedica.appointment.underAge === true){
                    //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(`Nombre del paciente (Menor edad):`, campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${fichaMedica.appointment.nameUnderAge}`, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------

                    //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(`Fecha de nacimiento:`, campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${this.datePipe.transform(fichaMedica.appointment.birthdateUnderAge, 'EEEE, MMMM d, y')}`, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------

                  //--------------
                    let sexoXPosition = valorXPosition + 30; 
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`Edad:`, sexoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      pdf.text(`${fichaMedica.infoGeneral.age}`, sexoXPosition + 30, yPos);
                      // yPos += lineSpacing;
                    //--------------

                    //--------------
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`Sexo:`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      pdf.text(`${fichaMedica.infoGeneral.sexo}`, valorXPosition - 40 , yPos);
                      yPos += lineSpacing;
                    //--------------
                  }

                                  
                  //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(fichaMedica.appointment.underAge ? 'Adulto responsable:' : 'Nombre del paciente:', campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${fichaMedica.infoGeneral.name}`, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------
                  
                  if(!fichaMedica.appointment.underAge){
                    //--------------
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`Edad:`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      pdf.text(`${fichaMedica.infoGeneral.age}`, valorXPosition, yPos);
                      yPos += lineSpacing;
                    //--------------
                  }
          
                  //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(`Teléfono:`, campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${fichaMedica.infoGeneral.phone}`, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------
          
                  //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(`${fichaMedica.infoGeneral.typeDocument ?? 'DUI'}:`, campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${this.formatDocument(fichaMedica.infoGeneral.identityNumber)}`, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------
          
                  //--------------
                    pdf.setTextColor(46, 74, 118);
                    pdf.text(`Dirección (Domicilio):`, campoXPosition, yPos);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(fichaMedica.infoGeneral.address, valorXPosition, yPos);
                    yPos += lineSpacing;
                  //--------------
          
                  yPos += sectionSpacing; 
          
                // ONLY WOMAN
                if(fichaMedica.isWoman){
                  if (yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                    pdf.addPage();
                    yPos = 20;
                  }
              
                  // Línea de separación
                  pdf.setDrawColor(46, 74, 118);
                  pdf.setLineWidth(0.5);
                  pdf.line(xMargin, yPos - 8, pageWidth - xMargin, yPos - 8);
              
                  // Título de la sección
                  pdf.setFontSize(16);
                  pdf.setFont("helvetica", "bold");
                  pdf.setTextColor(46, 74, 118);
                  const titleXPositionWoman = pageWidth / 2;
                  pdf.text(fichaMedica.seccionWoman.name, titleXPositionWoman, yPos, { align: 'center' });
                  yPos += lineSpacing;
              
                  fichaMedica.seccionWoman.campos.forEach((campo:CampoFichaMedicaI) => {
                    if (yPos + lineSpacing > pageHeight - pageBottomMargin) {
                      pdf.addPage();
                      yPos = 20;
                    }
              
                    const campoXPosition = xMargin + padding;
                    const valorXPosition = pageWidth - xMargin - padding - 60;
              
                    pdf.setFontSize(12);
                    pdf.setFont("helvetica", "normal");
              
                    if (campo.component === 'Entrada de texto' || campo.component === 'Selector opción multiple') {
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`${campo.name}`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      if(campo.selectMultiple){
                        campo.value.forEach((v:any) => {
                          pdf.text(v || '', valorXPosition, yPos);
                          yPos += lineSpacing;
                        });
                      }else{
                        pdf.text(campo.value || '', valorXPosition, yPos);
                        yPos += lineSpacing;
                      }

                    } else if (campo.component === 'Bloque de texto') {
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`${campo.name}:`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      const text = campo.value || '';
                      const textWidth = pageWidth - xMargin - padding * 4.5;
                      const textHeight = pdf.getTextDimensions(text, { maxWidth: textWidth }).h;
                      pdf.setFontSize(10);
                      pdf.text(text, campoXPosition, yPos + 5, { maxWidth: textWidth });
                      yPos += textHeight + 5;
                    }
                  });
              
                  yPos += sectionSpacing; 
                }
                
          
                (fichaMedica.sections as SectionFichaMedicaI[]).forEach((seccion) => {
                  if (yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                    pdf.addPage();
                    yPos = 20;
                  }
              
                  // Línea de separación
                  pdf.setDrawColor(46, 74, 118);
                  pdf.setLineWidth(0.5);
                  pdf.line(xMargin, yPos - 8, pageWidth - xMargin, yPos - 8);
              
                  // Título de la sección
                  pdf.setFontSize(16);
                  pdf.setFont("helvetica", "bold");
                  pdf.setTextColor(46, 74, 118);
                  const titleXPosition = pageWidth / 2;
                  pdf.text(seccion.name, titleXPosition, yPos, { align: 'center' });
                  yPos += lineSpacing;
              
                  seccion.campos.forEach((campo) => {
                    if (yPos + lineSpacing > pageHeight - pageBottomMargin) {
                      pdf.addPage();
                      yPos = 20;
                    }
              
                    const campoXPosition = xMargin + padding;
                    const valorXPosition = pageWidth - xMargin - padding - 60;
              
                    pdf.setFontSize(12);
                    pdf.setFont("helvetica", "normal");
              
                    if (campo.component === 'Entrada de texto' || campo.component === 'Selector opción multiple') {
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`${campo.name}`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      pdf.text(campo.value || '', valorXPosition, yPos);
                      yPos += lineSpacing;
                    } else if (campo.component === 'Bloque de texto') {
                      pdf.setTextColor(46, 74, 118);
                      pdf.text(`${campo.name}:`, campoXPosition, yPos);
                      pdf.setTextColor(0, 0, 0);
                      const text = campo.value || '';
                      const textWidth = pageWidth - xMargin - padding * 4.5;
                      const textHeight = pdf.getTextDimensions(text, { maxWidth: textWidth }).h;
                      pdf.setFontSize(10);
                      pdf.text(text, campoXPosition, yPos + 5, { maxWidth: textWidth });
                      yPos += textHeight + 8;
                    }
                  });
              
                  yPos += sectionSpacing; 
                });
          
                // estudioS
                if(yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                  pdf.addPage();
                  yPos = 20;
                }
                
                pdf.setFontSize(16);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(46, 74, 118); // Color de título
                pdf.text('Estudios', xMargin, yPos); // Cambia el título según tus necesidades
                yPos += lineSpacing;
                
                // Recorrer el array y agregar cada nombre en la lista
                if(fichaMedica.estudios && fichaMedica.estudios.length > 0){
                  fichaMedica.estudios.forEach((item:any) => {
                    if (yPos + lineSpacing > pageHeight - pageBottomMargin) {
                      pdf.addPage();
                      yPos = 20;
                    }
                  
                    pdf.setFontSize(12);
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(0, 0, 0); // Color de texto para los nombres
                    pdf.text(`- ${item.nameDoc}`, xMargin + padding, yPos); // Agregar el nombre con un guion
                    yPos += lineSpacing;
                  });
                }else {
                  pdf.setFontSize(12);
                  pdf.setFont("helvetica", "normal");
                  pdf.setTextColor(0, 0, 0); // Color de texto para los nombres
                  pdf.text(`No se agregaron estudios`, xMargin + padding, yPos); // Agregar el nombre con un guion
                  yPos += lineSpacing;
                }
              
                // TRATAMIENTPOS
                if(yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                  pdf.addPage();
                  yPos = 20;
                }        
                pdf.setFontSize(16);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(46, 74, 118); // Color de título
                pdf.text('Tratamientos', xMargin, yPos); // Cambia el título según tus necesidades
                yPos += lineSpacing;
                
                // Recorrer el array y agregar cada nombre en la lista
                if(fichaMedica.tratamientos && fichaMedica.tratamientos.length > 0){
                  fichaMedica.tratamientos.forEach((item:any) => {
                    if (yPos + lineSpacing > pageHeight - pageBottomMargin) {
                      pdf.addPage();
                      yPos = 20;
                    }
                  
                    pdf.setFontSize(12);
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(0, 0, 0); // Color de texto para los nombres
                    pdf.text(`- ${item.nameDoc}`, xMargin + padding, yPos); // Agregar el nombre con un guion
                    yPos += lineSpacing;
                  });
                }else {
                  pdf.setFontSize(12);
                  pdf.setFont("helvetica", "normal");
                  pdf.setTextColor(0, 0, 0); // Color de texto para los nombres
                  pdf.text(`No se agregaron tratamientos`, xMargin + padding, yPos); // Agregar el nombre con un guion
                  yPos += lineSpacing + 5;
                }
                
                // Definir las posiciones de las imágenes y el texto
                const selloWidth = 30;
                const selloHeight = 30;
                const firmaWidth = 60;
                const firmaHeight = 30;
                const nombreXPosition = xMargin + 70; // Posición para el nombre
                const selloXPosition = xMargin; // Posición del sello
                const firmaXPosition = pageWidth - xMargin - firmaWidth; // Posición de la firma (más a la derecha)
          
                // Sello del médico
                pdf.addImage(sello, 'PNG', selloXPosition, yPos, selloWidth, selloHeight);
                pdf.setFontSize(10);
                pdf.text('Sello', selloXPosition, yPos + selloHeight + 5); // Ajustar la posición para que quede debajo de la firma
          
                // Nombre del médico
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(0, 0, 0); // Color del texto del nombre
                pdf.text(`${fichaMedica.medico.names} ${fichaMedica.medico.last_names}`, nombreXPosition, yPos + selloHeight + 5); // El nombre se coloca debajo del sello
          
                // Etiqueta "Médico" debajo del nombre
                pdf.setFontSize(10);
                pdf.text('Médico', nombreXPosition, yPos + selloHeight + 10); // Ajustar la posición para que quede debajo del nombre
          
                // Firma del médico
                pdf.addImage(firma, 'PNG', firmaXPosition, yPos, firmaWidth, firmaHeight);
          
                // Etiqueta "Firma" debajo de la firma
                pdf.setFontSize(10);
                pdf.text('Firma', firmaXPosition, yPos + firmaHeight + 5); // Ajustar la posición para que quede debajo de la firma
          
                // Ajustar la posición de yPos para seguir con el contenido del PDF
                yPos += Math.max(selloHeight, firmaHeight) + 20; // Ajusta el espacio según el tamaño de las imágenes
          
                if (yPos + sectionSpacing > pageHeight - pageBottomMargin) {
                  pdf.addPage();
                  yPos = 20;
                }
              
                // Definir las posiciones para la imagen y el texto
                const imgWidthFooter = 50;
                const imgHeightFooter = 15;
                const xPositionImgFooter = xMargin; // Posición de la imagen a la izquierda
                const textXPositionFotter = pageWidth - xMargin - 60; // Posición del texto a la derecha
              
                // Añadir la misma imagen de encabezado
                pdf.addImage(imageDataUrl, 'PNG', xPositionImgFooter, yPos, imgWidthFooter, imgHeightFooter);
              
                // Añadir el texto a la derecha
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(46, 74, 118);
                pdf.text('Analiza Telemedicina El Salvador', textXPositionFotter, yPos + 8); // Ajusta la posición según sea necesario
              
                yPos += imgHeightFooter + 8; // Ajustar la posición para la siguiente línea
          
                // this.pdfBlob = pdf.output('blob') as Blob;
                pdf.save(fichaMedica.name ? fichaMedica.name : this.datePipe.transform(fichaMedica.createdAt, 'EEEE, MMMM d, y'));
          
              });

          },
          (error) => {
            console.error( error);
          }
        );

      },
      (error) => {
        console.error( error);
      }
    );

  }

  async deleteDocumentExpediente(idDocument:any){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar este documento del expediente?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.expedienteService.deleteDocumentExpediente(idDocument).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getDocumentExpedientesUser();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
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

  // formatPhoneNumber(phone: string): string {
  //   const phoneNumber = phone.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    
  //   // Formato: (+504) 7585 7585
  //   return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '+($1) $2 $3');
  // }
  

  formatDocument(document: string): string {
    const documentNumber = document.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    return documentNumber.replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3'); // Aplica el formato '0000-0000-00000'
  }

  async deleteFichaMedica(idFichaMedica:any){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta ficha médica del expediente?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.fichaMedicaService.deleteFichaMedica(idFichaMedica).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getFichasMedicas();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

}
