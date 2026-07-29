import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { RoleI, UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-view-nurses',
  templateUrl: './view-nurses.component.html',
  styles: [
  ]
})
export class ViewNursesComponent implements OnInit {
  public isCollapsed = true;
  nurses:UserI[]=[];
  loading:boolean = true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any = {};
  nurseRoleId!:string;

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getNurseRole();
  }

  getNurseRole(){
    this.rolesService.getAllRoles().subscribe({
      next:(res:any)=>{
        const roles:RoleI[] = res.roles;
        const nurseRole = roles.find(role => role.name === 'nurse');
        this.nurseRoleId = nurseRole ? nurseRole._id : '';
        this.filters.role = this.nurseRoleId;
        this.getNurses();
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  getNurses(){
    this.loading = true;
    this.usersService.getUsers(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.nurses = res.users;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  clearFilters(){
    this.filters = {role:this.nurseRoleId};
    this.getNurses();
  }

  async changeStatusNurse(idNurse:string,currentStatus:boolean){
    const {result} = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} esta enfermera/o?`,'warning');
    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');
      this.usersService.changeStatus(idNurse).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getNurses();
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

}
