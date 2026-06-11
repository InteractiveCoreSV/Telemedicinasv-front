import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Subscription } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { InsuranceI } from 'src/app/interfaces/insurance';
import { AlertsService } from 'src/app/services/alerts.service';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'app-all-insurers',
  templateUrl: './all-insurers.component.html',
  styleUrls: ['./all-insurers.component.scss']
})
export class AllInsurersComponent implements OnInit {

  loading:boolean = false;
  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  insurers: InsuranceI[] = [];

  subs:Subscription = new Subscription();

  constructor(
  private insuranceService: InsuranceService,
  private alertsService: AlertsService,
  private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getinsurers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getinsurers(){
    this.loading = true;
    this.insuranceService.getInsurers('','',this.page).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{

        this.insurers = res.insurers;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  async deleteinsurance(idinsurance:string = ''){
    const {result} = await this.alertsService.confirmDialogWithModals('Info.','¿Deseas eliminar esta aseguradora?','error');

    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');

      this.insuranceService.deleteInsurance(idinsurance).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:((res:any)=>{
          this.alertsService.toastMixin(res.message,'success');
          this.getinsurers();
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }
  }

  async changeStatus(idInsurance:string,status:boolean){
    const {result} = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${status === true ? 'deshabilitar' : 'habilitar'} esta aseguradora?`,'error');

    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');

      this.insuranceService.changeStatus(idInsurance).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:((res:any)=>{
          this.alertsService.toastMixin(res.message,'success');
          this.getinsurers();
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }
  }
}
