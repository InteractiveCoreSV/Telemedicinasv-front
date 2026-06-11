import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';

import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { CategoryServiceI } from 'src/app/interfaces/service.interface';
import {  VideoConferenciaService } from 'src/app/services/video-conferencia.service';

@Component({
  selector: 'app-select-meeting-tool',
  templateUrl: './select-meeting-tool.component.html',
  styles: [
  ]
})
export class SelectMeetingToolComponent implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() meetingToolSelected!:string | null | undefined;

  meetingTool:CategoryServiceI[]=[];

  page:number=1;
  paginationDetails!:PaginationDetailsI;

  @Input()search!:string;
  @Input() manualSearch:boolean = false;

  searched:boolean =false;

  @Output() changemeetingTool:EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor(
    private meetingToolervice: VideoConferenciaService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {   
    this.getvideoConferencia();
  }

  getvideoConferencia(){
    this.loading = true;
    this.meetingToolervice.getVideoConferencias(1,'true').pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
          // this.beforeSearchmeetingTool = this.meetingTool;
          this.meetingTool = [];
        }

        this.meetingTool = this.meetingTool.concat(res.videoConferencias);
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

  selectedmeetingTool(){

    if(!this.meetingToolSelected && this.searched){
      this.searched = false;
    }

    this.changemeetingTool.emit(this.meetingToolSelected)
  }

  keydownInDropdown(event:any){

    if(event.keyCode ==13){
      if(this.ngSelectComponent.itemsList.filteredItems.length==0){
        this.page = 1;
        this.searched = true;
        this.getvideoConferencia();
      }
    }
    return false;
  }

  setSearch(ev:any){
    this.search = ev.term;
  }

  clear(){
    this.meetingToolSelected = null;
  }

  setDefaultValue(value:any){
    this.meetingToolSelected = value;
  }

  onScrollToEnd() {
    this.getvideoConferencia();
  }

}
