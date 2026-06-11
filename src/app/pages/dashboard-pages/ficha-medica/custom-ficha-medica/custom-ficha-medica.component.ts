import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { nanoid } from 'nanoid';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AddCampoFichaMedicaComponent } from 'src/app/components/modals/ficha-medica/add-campo-ficha-medica/add-campo-ficha-medica.component';
import { AddSectionFichaMedicaComponent } from 'src/app/components/modals/ficha-medica/add-section-ficha-medica/add-section-ficha-medica.component';
import { CampoFichaMedicaI, SectionFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { AlertsService } from 'src/app/services/alerts.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custom-ficha-medica',
  templateUrl: './custom-ficha-medica.component.html',
  styleUrls: ['./custom-ficha-medica.component.scss']
})
export class CustomFichaMedicaComponent implements OnInit{
  formFichaMedica:SectionFichaMedicaI[]= []
  formFichaMedicaSectionWoman!:SectionFichaMedicaI
  nameFinchaMedica!:string
  _idFinchaMedica!:string

  formSubmited:boolean = false;

  loading:boolean = false

  constructor(
    private ngbModal: NgbModal,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
    private fichaMendicaService: FichaMedicaService
  ) { }

  ngOnInit(): void {
    const fichamedicaId = history.state?.fichaMedica._id;

    this.getFichaMedica(fichamedicaId)

  }

  async newCampoModal(id?:string,woman:boolean = false,campo?:any,indexCampo?:number){
    const modal = this.ngbModal.open(AddCampoFichaMedicaComponent,{centered:true});
    modal.componentInstance.campo = campo;

    try {
      const result = await modal.result;
      if(result.campo){
        if(woman){
          if(campo){
            this.formFichaMedicaSectionWoman.campos[indexCampo?indexCampo:0] = result.campo;
          }else {
            this.formFichaMedicaSectionWoman.campos.push(result.campo);
          }

        }else{

          const index = this.formFichaMedica.findIndex(item => item.id === id);
          if (index !== -1) {
            if(campo){
              this.formFichaMedica[index].campos[indexCampo?indexCampo:0] = result.campo;
            }else {
              this.formFichaMedica[index].campos.push(result.campo);
            }
          } 

        }
      }
    } catch (error) {}
  }
  

  removeCampo(iSection:number,i:number){
    this.formFichaMedica[iSection].campos.splice(i, 1)
  }

  removeCampoSectionWoman(i:number){
    this.formFichaMedicaSectionWoman.campos.splice(i, 1)
  }

  async newSection(woman:boolean = false,section?:any,indexCampo?:number){
    const modal = this.ngbModal.open(AddSectionFichaMedicaComponent,{centered:true});
    modal.componentInstance.newSectionName = section?.name;
    modal.componentInstance.sectionOnlyWoman = section?.onlyWoman;


    try {
      const result = await modal.result;
      if(result.section){

        if(woman){

          if(section ){
            this.formFichaMedicaSectionWoman.name = result.section.newSectionName;
            this.formFichaMedicaSectionWoman.onlyWoman = result.section.sectionOnlyWoman;
          }

        }else {

          if(section && indexCampo){
            this.formFichaMedica[indexCampo].name = result.section.newSectionName;
            this.formFichaMedica[indexCampo].onlyWoman = result.section.sectionOnlyWoman;
  
          }else {
            this.formFichaMedica.push({
              id: nanoid(),
              name: result.section.newSectionName,
              onlyWoman: result.section.sectionOnlyWoman,
              position: this.formFichaMedica.length > 0 ? this.formFichaMedica[this.formFichaMedica.length - 1].position + 1: 1,
              campos: []
            });
          }

        }

      }
    } catch (error) {}
  }

  removeSection(iSection:number){
    this.formFichaMedica.splice(iSection, 1)
  }


  getFichaMedica(fichamedicaId:string){
    this.loading = true;
    this.fichaMendicaService.getFichaMedicaSectionsEdit(fichamedicaId).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.nameFinchaMedica = res.fichaMedicaSections.name;
        this._idFinchaMedica = res.fichaMedicaSections._id;

        this.formFichaMedica = res.fichaMedicaSections.sections ;
        if(res.fichaMedicaSections.seccionWoman){
          this.formFichaMedicaSectionWoman = res.fichaMedicaSections.seccionWoman
        }
      })
    })
  }


  async saveFichaMedicaSections(){
    await this.ngxSpinnerService.show('generalSpinner');

    this.fichaMendicaService.saveFichaMedicaSections({_id:this._idFinchaMedica, formFichaMedica:this.formFichaMedica,formFichaMedicaSectionWoman:this.formFichaMedicaSectionWoman}).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin(res.message,'success');
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      }
    })
  }

}
