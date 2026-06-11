import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { finalize } from 'rxjs';
import { InsuranceI } from 'src/app/interfaces/insurance';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'app-select-insurance',
  templateUrl: './select-insurance.component.html',
  styleUrls: ['./select-insurance.component.scss']
})
export class SelectInsuranceComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;

  loading:boolean = false;

  @Input() insuranceSelected!:string | null;

  @Input() formGroup!:FormGroup;

  insures:InsuranceI[]=[];

  @Input()search!:string;
  @Input() manualSearch:boolean = false;

  searched:boolean =false;

  @Output() changeInsurance:EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() changeInsuranceObject:EventEmitter<InsuranceI> = new EventEmitter<InsuranceI>();

  constructor(
    private insuranceService: InsuranceService,
    private alertsService: AlertsService
  ) { }

  ngOnInit(): void {
      this.getInsurance();
  }

  getInsurance(){
    this.loading = true;
    this.insuranceService.getInsurersForSelect().pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{

        if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
          this.insures = [];
        }

        this.insures = this.insures.concat(res.insurers);
      },
      error:(e:any)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectedInsurance(){
    if(!this.insuranceSelected && this.searched){
      this.searched = false;
    }

    this.changeInsurance.emit(this.insuranceSelected)
    const insuranceFine = this.insures.find(ins => ins._id === this.insuranceSelected)
    this.changeInsuranceObject.emit(insuranceFine)
  }

  clear(){
    this.insuranceSelected = null;
  }

  setDefaultValue(value:any){
    this.insuranceSelected = value;
  }

}
