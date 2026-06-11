import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-select-medico',
  templateUrl: './select-medico.component.html',
  styleUrls: ['./select-medico.component.scss']
})
export class SelectMedicoComponent  implements OnInit {

  @ViewChild(NgSelectComponent) ngSelectComponent!:NgSelectComponent;
  @Input() employeeSelected!:string  | null;
  @Input() label:string = 'Seleccionar médico';
  @Input() styleSelect:any;
  @Input() formGroup!:UntypedFormGroup;
  @Input() appendTo:string = 'body'
  @Input() medicoDelete:boolean = false
  @Input() formControlNameEmployee!:string;

  @Output() changeEmployeeObject:EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() changeEmployee:EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() name:EventEmitter<string> = new EventEmitter<string>();

  paginationDetails!:PaginationDetailsI;
  loading:boolean = false;
  employees:UserI[]=[]
  beforeSearchEmployees:UserI[]=[]
  searched:boolean =false;
  page:number =1

  @Input() roles!:string[];
  

  constructor(
    private usersService:UsersService,
    private alertsService:AlertsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(){
    this.loading = true;
    this.usersService.getMedicos(this.page,{medicoDelete:this.medicoDelete}).pipe(
      finalize(()=>{
        this.loading=false;
      })
    )
      .subscribe({
        next:(res:any)=>{

          if(this.ngSelectComponent.itemsList.filteredItems.length==0 && this.searched){
            this.beforeSearchEmployees = this.employees;
            this.employees = [];
          }
          // console.log(res.data)
          this.employees = this.employees.concat(res.medicos);
          this.paginationDetails = res.paginationDetails;
          if(this.paginationDetails.hasNextPage){
            this.page += this.page;
          }
      }, error:(e:any)=>{
        console.log(e);
        this.alertsService.toastMixin(e['error']['message'],'error');
      }});
  }

  selectedEmployee(){
    if(!this.employeeSelected && this.searched){
      this.employees = this.beforeSearchEmployees;
      this.searched = false;
    }
    if(this.formGroup){
      this.formGroup.get(this.formControlNameEmployee)?.setValue(this.employeeSelected);
    }
    const employeeObject = this.employees.find((emp)=>emp._id == this.employeeSelected);
    this.changeEmployeeObject.emit(employeeObject)

    if(employeeObject){
      var name = employeeObject.names+' '+employeeObject.last_names+' ['+employeeObject.email+']';
      this.name.emit(name)
    };
    
    this.changeEmployee.emit(this.employeeSelected)

    // this.clear()
  }

  clear(){
    setTimeout(()=>{
      this.employeeSelected = null;
    },100)
    this.changeDetectorRef.detectChanges();
  }

  clearResults(){
    this.employees = [];
  }

}
