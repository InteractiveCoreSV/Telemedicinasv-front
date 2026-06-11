import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SectionFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { MenorEdadI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';

@Component({
  selector: 'app-view-summary-fichas-medicas',
  templateUrl: './view-summary-fichas-medicas.component.html',
  styleUrls: ['./view-summary-fichas-medicas.component.scss']
})
export class ViewSummaryFichasMedicasComponent implements OnInit {

  @Input() idPaciente!:string;
  @Input() menorSelect!:MenorEdadI;
  @Input() infoPatient!:any;

  age:number = 0

  fichaMedicaSections:SectionFichaMedicaI[] = []
  seccionWoman!:SectionFichaMedicaI
  isWomam:boolean = false;

  loading:boolean = true;
  // appointments:any[] = [];
  summaryFichaMedica:any[] = [];
  colors = ['#f8d7da', '#d1ecf1', '#d4edda', '#fff3cd', '#e2e3e5'];


  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  filters:any = {};
  private summaryValueCache = new WeakMap<any, {
    sections: Map<string, Map<string, any>>,
    woman: Map<string, any>
  }>();

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private fichaMedicaService: FichaMedicaService,    
    private expedienteService: ExpedienteService,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.getSummaryFichaMedica()
  }

  async viewDetailFichaMedica(fichaMedicaId:string){


  }

  getSummaryFichaMedica(){
    this.loading = true;
    this.filters.idPaciente = this.menorSelect ? this.menorSelect._id : this.idPaciente;
    this.filters.underAge = this.menorSelect ? true: false;

    this.fichaMedicaService.getSummaryFichaMedicasByPatient(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.fichaMedicaSections = res.fichaMedicaSections.sections
        this.seccionWoman = res.fichaMedicaSections.seccionWoman
        this.summaryFichaMedica = res.fichasMedicas;
        this.summaryValueCache = new WeakMap();

        if(this.summaryFichaMedica.length > 0){
          this.isWomam = this.menorSelect ? false : this.summaryFichaMedica[0].isWoman
          this.age =  this.summaryFichaMedica[0].infoGeneral.age
        }

        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  private buildSummaryCache(summary: any) {
    const sections = new Map<string, Map<string, any>>();

    for (const section of summary?.sections ?? []) {
      const camposMap = new Map<string, any>();
      for (const campo of section?.campos ?? []) {
        camposMap.set(campo?.name, campo?.value ?? '');
      }
      sections.set(section?.name, camposMap);
    }

    const woman = new Map<string, any>();
    for (const campo of summary?.seccionWoman?.campos ?? []) {
      woman.set(campo?.name, campo?.value ?? '');
    }

    const cache = { sections, woman };
    this.summaryValueCache.set(summary, cache);
    return cache;
  }

  private getSummaryCache(summary: any) {
    let cache = this.summaryValueCache.get(summary);
    if (!cache) {
      cache = this.buildSummaryCache(summary);
    }
    return cache;
  }

  getCampoValue(summary: any, sectionName: string, campoName: string) {
    return this.getSummaryCache(summary).sections.get(sectionName)?.get(campoName) ?? '';
  }

  getCampoWomanValue(summary: any, campoName: string) {
    return this.getSummaryCache(summary).woman.get(campoName) ?? '';
  }

  trackBySummary(_index: number, summary: any) {
    return summary?._id ?? _index;
  }

  trackBySection(_index: number, section: any) {
    return section?.name ?? _index;
  }

  trackByCampo(_index: number, campo: any) {
    return campo?.name ?? _index;
  }

  trackByTratamiento(_index: number, tratamiento: any) {
    return tratamiento?.id ?? tratamiento?.nameDoc ?? _index;
  }


  descargar(name:any,idFichaMedica:any,tratamientoId:string, category:string,url?:string){
    if(category === 'Tratamiento'){
      this.descargarTratamientoPDF(idFichaMedica,tratamientoId)
    }else {
      this.expedienteService.downloadDocumentExpediente(url ?? '',`${name}.pdf`);
    }
  }

  async descargarTratamientoPDF(idFichaMedica:string,tratamientoId:string){
    await this.ngxSpinnerService.show('generalSpinner');

    this.fichaMedicaService.generatePDFTratamiento(idFichaMedica,tratamientoId).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })  
    ).subscribe({
      next:(res:any)=>{
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = '';

   if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }


}