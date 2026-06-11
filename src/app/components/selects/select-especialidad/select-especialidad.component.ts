import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { EspecialidadI } from 'src/app/interfaces/especialidad.interface';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-select-especialidad',
  templateUrl: './select-especialidad.component.html',
  styleUrls: ['./select-especialidad.component.scss']
})
export class SelectEspecialidadComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() especialidadSelected!:string | null | undefined;

  especialidades:EspecialidadI[]=[];

  page:number=1;
  paginationDetails!:PaginationDetailsI;

  @Input() search!:string;
  @Input() manualSearch:boolean = false;

  @Input() customClass!:string;

  searched:boolean =false;

  @Output() changeEspecialidad:EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(
    private especialidadService: EspecialidadService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {   
    this.getEspecialidades();
  }

  getEspecialidades(){
    this.loading = true;
    this.especialidadService.getEspecialidades(this.page).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        const nuevos = res.especialidades.filter((e: EspecialidadI) =>
          !this.especialidades.some(existing => existing._id === e._id)
        );

        this.especialidades = [...this.especialidades, ...nuevos];
        this.paginationDetails = res.paginationDetails;

        if (this.paginationDetails.hasNextPage) {
          this.page += 1;
        }

      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectedEspecialidades(){

    if(!this.especialidadSelected && this.searched){
      this.searched = false;
    }

    this.changeEspecialidad.emit(this.especialidadSelected)
  }

  keydownInDropdown(event:any){

    if(event.keyCode ==13){
      if(this.ngSelectComponent.itemsList.filteredItems.length==0){
        this.page = 1;
        this.searched = true;
        this.getEspecialidades();
      }
    }
    return false;
  }

  setSearch(ev:any){
    this.search = ev.term;
  }

  clear(){
    this.especialidadSelected = null;
  }

  setDefaultValue(value:any){
    this.especialidadSelected = value;
  }

  onScrollToEnd() {
    this.getEspecialidades();
  }

}
