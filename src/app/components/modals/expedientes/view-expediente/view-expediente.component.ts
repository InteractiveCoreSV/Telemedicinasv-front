import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { NewDocumentExpedienteComponent } from 'src/app/components/modals/expedientes/new-document-expediente/new-document-expediente.component';
import { VewDocumentExpedienteComponent } from 'src/app/components/modals/expedientes/vew-document-expediente/vew-document-expediente.component';
import { ExpedienteI } from 'src/app/interfaces/document-expediente';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { MenorEdadI, UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import { Fancybox } from '@fancyapps/ui';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';
import { ViewFichaMedicaComponent } from 'src/app/components/modals/ficha-medica/view-ficha-medica/view-ficha-medica.component';
import { ViewSummaryFichasMedicasComponent } from '../../ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component';
import { UpdateSexoBirthdayComponent } from '../../user/update-sexo-birthday/update-sexo-birthday.component';
import { HistoryUserCrmComponent } from '../history-user-crm/history-user-crm.component';


@Component({
  selector: 'app-view-expediente',
  templateUrl: './view-expediente.component.html',
  styleUrls: ['./view-expediente.component.scss']
})
export class ViewExpedienteComponent implements OnInit {
  
  userInfo!:UserI | null

  @Input() idPaciente!:string;
  @Input() menorSelect!:MenorEdadI;

  paciente!:UserI;
  loading:boolean =true;
  
  loadingExpedientes:boolean = false;
  documentsExpediente:ExpedienteI[] = [];

  loadingFichasMedicas:boolean = false;
  fichasMedicas:any[] = [];

  paginationDetails!: PaginationDetailsI;

  page:number = 1;

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
    public ngbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
    this.getUser(this.idPaciente);

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
        this.descargarEstudioPDF(expedienteId, name);
      }
    }else {
      this.expedienteService.downloadDocumentExpediente(url ?? '',`${name}.${typeDocument ==  'pdf' ? 'pdf' : typeDocument ==  'word' ? 'docx' :'png' }`);
    }
  }

  async descargarEstudioPDF(expedienteId:any, name:string){
    await this.ngxSpinnerService.show('generalSpinner');
    try {
      const token = this.authService.getToken() ?? '';
      const apiUrl = `${environment.urlApi}/documents-expediente/generatePDFEstudio?expedienteId=${expedienteId}`;
      const response = await fetch(apiUrl, { headers: { 'x-access-token': token } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `${name}.pdf`;
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

    descargarOther(url:string,name:string,typeDocument:string){

      this.expedienteService.downloadDocumentExpediente(url ?? '',`${name}.${typeDocument ==  'pdf' ? 'pdf' : typeDocument ==  'word' ? 'docx' :'png' }`);
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
        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      },
      error:(e)=>{ console.log(e) }
    })
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

  openHistory(){
    const modal = this.ngbModal.open(HistoryUserCrmComponent,{centered:true,size:'xl',scrollable:true});
    modal.componentInstance.dni_paciente = this.paciente.identityNumber
    modal.componentInstance.fecha_nacimiento = this.paciente.dateBirthday
    modal.componentInstance.genero = this.paciente.sexo
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
