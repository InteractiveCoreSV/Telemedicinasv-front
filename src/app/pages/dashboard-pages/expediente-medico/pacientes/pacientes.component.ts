import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent  implements OnInit {
  
  pacientes:UserI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  filters:any={};
  search:string='';

  constructor(
    private usersService: UsersService,
    private alertsService: AlertsService,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  setUser(user:UserI | null){
    if(user){
      this.filters._id = user._id
      this.page = 1
      this.getUsers()
    }else{
      this.filters = {}
      this.getUsers()
    }
  }

  getUsers(){
    this.loading =true;

    this.usersService.getPatients(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.pacientes = res.patients;
        this.paginationDetails = res.paginationDetails;
        this.change.detectChanges()
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }
}
