import { Component, HostListener, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styles: [
  ]
})
export class ViewUsersComponent implements OnInit {
  public isCollapsed = true;
  users:UserI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';
  roleSelected:string ='';

  windowWidth:number =0;

  countUsers:any[] = []

  constructor(
    private usersService: UsersService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.getOnlyCounterCLient();
    this.windowWidth = window.innerWidth;
  }

  getUsers(){
    this.loading =true;
    this.usersService.getUsers(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.users = res.users;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  async changeStatusUser(idUser:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas ${currentStatus?'desactivar':'activar'} este usuario?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.usersService.changeStatus(idUser).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getUsers();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  async deleteUser(idUser:string,currentStatus:boolean){
    const {result}  = await this.alertsService.confirmDialogWithModals('Info.',`¿Deseas eliminar este usuario?`,'warning');
    if(result.isConfirmed){
        await this.ngxSpinnerService.show('generalSpinner');
      this.usersService.deleteUser(idUser).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.getUsers();
        },
        error:(e)=>{
          console.log(e)
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }


  clearFilters(){
    this.filters = {}
    this.getUsers()
  }

  @HostListener('window:resize')
  onResize(){
    this.windowWidth = window.innerWidth;
  }

  getOnlyCounterCLient(force: boolean = false) {
    this.usersService.getCounterUser('', this.filters,false).subscribe({
      next: ((res: any) => {
        if(res.roleUser === 'sac'){
          this.countUsers.push({name: 'Pacientes',count: res.patient, color: '#1D70B7'});
        }else {
          this.countUsers.push({name: 'Pacientes',count: res.patient, color: '#1D70B7'});
          this.countUsers.push({name: 'Administradores',count: res.admin, color: '#2e9e2e'});
          this.countUsers.push({name: 'Médicos',count: res.medico, color: '#2e9e23'});
          this.countUsers.push({name: 'SAC',count: res.sac, color: '#d3383d'});
        }
        
      })
    })
  }


  exportToExcel(){
    this.ngxSpinnerService.show('generalSpinner');
    this.usersService.getPatientsForExport(this.filters).subscribe({
      next:(res:any)=>{
        const users = res.users;
        const dataExport:any = []

        users.forEach((user: UserI) => {
            dataExport.push({
              names: user.names,
              last_names: user.last_names,
              age: user.age,
              phone: user.phone,
              email: user.email,
            })
        })

        const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 30 }, { wch: 40 }];
        const forHeader = ['Nombres','Apellidos','Edad','Teléfono','Correo']
        
        const title = `Pacientes Telemedicina Analiza El Salvador`

        this.utilsService.exportAsExcel(dataExport, title,forHeader,columnWidths,title );
        this.ngxSpinnerService.hide('generalSpinner');
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }
}
