import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';

import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { CategoryServiceI, ServiceI } from 'src/app/interfaces/service.interface';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-select-services',
  templateUrl: './select-services.component.html',
  styles: [
  ]
})
export class SelectServiceComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() servicesSelected!:string | null | undefined;

  services:ServiceI[]=[];

  page:number=1;
  paginationDetails!:PaginationDetailsI;

  @Input()search!:string;
  @Input() manualSearch:boolean = false;

  searched:boolean =false;

  @Output() changeservices:EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(
    private servicesService: ServiceService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {   
    this.getservices();
  }

  getservices(){
    this.loading = true;
    this.servicesService.getServices(this.page).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
          // this.beforeSearchservices = this.services;
          this.services = [];
        }

        this.services = this.services.concat(res.services);
        this.paginationDetails = res.paginationDetails;

        if(this.paginationDetails.hasNextPage){
          this.page += this.page;
        }
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectedservices(){

    if(!this.servicesSelected && this.searched){
      this.searched = false;
    }

    this.changeservices.emit(this.servicesSelected)
  }

  keydownInDropdown(event:any){

    if(event.keyCode ==13){
      if(this.ngSelectComponent.itemsList.filteredItems.length==0){
        this.page = 1;
        this.searched = true;
        this.getservices();
      }
    }
    return false;
  }

  setSearch(ev:any){
    this.search = ev.term;
  }

  clear(){
    this.servicesSelected = null;
  }

  setDefaultValue(value:any){
    this.servicesSelected = value;
  }

  onScrollToEnd() {
    this.getservices();
  }

}
