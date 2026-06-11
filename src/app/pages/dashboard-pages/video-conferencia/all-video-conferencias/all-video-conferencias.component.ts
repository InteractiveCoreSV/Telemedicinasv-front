import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { VideoConferenciaI } from 'src/app/interfaces/video-conferencia.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { VideoConferenciaService } from 'src/app/services/video-conferencia.service';

@Component({
  selector: 'app-all-video-conferencias',
  templateUrl: './all-video-conferencias.component.html',
  styleUrls: ['./all-video-conferencias.component.scss']
})
export class AllVideoConferenciasComponent implements OnInit {

  videoConferencia:VideoConferenciaI[]=[];
  loading:boolean =false;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  constructor(
    private videoConferenciaService: VideoConferenciaService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getvideoConferencia();
  }

  getvideoConferencia(){
    this.loading =true;
    this.videoConferenciaService.getVideoConferencias(this.page).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.videoConferencia = res.videoConferencias;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatusVideoConferencia(idVideoConferencia:any,currentStatus:boolean){
    // const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} este médico?`,'warning');
    // if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');
      this.videoConferenciaService.changeStatus(idVideoConferencia).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getvideoConferencia();
        },
        error:(e)=>{
          console.log(e)
          this.getvideoConferencia();
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    // }
  }

  async deleteVideoConferencia(idVideoConferencia:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar esta video conferencia?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.videoConferenciaService.deleteVideoConferencia(idVideoConferencia).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getvideoConferencia();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }


  clearFilters(){
    this.getvideoConferencia()
  }

}
