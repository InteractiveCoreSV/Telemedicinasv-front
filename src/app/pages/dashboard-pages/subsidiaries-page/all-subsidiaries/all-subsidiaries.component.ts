import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { SubsidiaryService } from 'src/app/services/subsidiary.service';
import { ReloadsDataService } from 'src/app/services/reloads-data.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-all-subsidiaries',
  templateUrl: './all-subsidiaries.component.html',
  styles: [
  ]
})
export class AllSubsidiariesComponent implements OnInit,OnDestroy {

  loading:boolean = false;
  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  subsidiaries:SubsidiaryI[] = [];

  subs:Subscription = new Subscription();

  constructor(
  private subsidiaryService: SubsidiaryService,
  private reloadsDataService: ReloadsDataService,
  private alertsService: AlertsService,
  private ngxSpinnerService: NgxSpinnerService,
  private ngbModal: NgbModal,

  ) { }

  ngOnInit(): void {
    this.getSubsidiaries();
    this.subs.add(
      this.reloadsDataService.reloadSubsidiaries.subscribe({
        next:((reload)=>{
          if(reload){
            this.getSubsidiaries();
          }
        })
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSubsidiaries(){
    this.loading = true;
    this.subsidiaryService.getSubsidiaries(this.page,{all:true}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.subsidiaries = res.subsidiaries;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  async deleteSubsidiary(idSubsidiary:string = ''){
    const {result} = await this.alertsService.confirmDialogWithModals('Info.','¿Deseas eliminar esta sucursal?','error');

    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');

      this.subsidiaryService.deleteSubsidiary(idSubsidiary).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:((res:any)=>{
          this.alertsService.toastMixin(res.message,'success');
          this.getSubsidiaries();
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }
  }

  async changeStatus(idSubsidiary:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} esta sucursal?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.subsidiaryService.changeStatus(idSubsidiary).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getSubsidiaries();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

}
