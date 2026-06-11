import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserI } from 'src/app/interfaces/user.interface';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewAppointmentModalComponent } from 'src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component';
import { NewAppointmentFormsService } from '../../appointments-page/new-appointment-page/new-appointment-forms.service';

@Component({
  selector: 'app-medicos-in-line',
  templateUrl: './medicos-in-line.component.html',
  styleUrls: ['./medicos-in-line.component.scss']
})
export class MedicosInLineComponent implements OnInit {

  medicos:UserI[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;

  constructor(
    private medicosService: UsersService,
    private alertsService: AlertsService,
    private webSocketService: WebSocketService,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService
  ) { }

  ngOnInit(): void {
    this.getMedicos();

    this.webSocketService.onStatusUpdate().subscribe((data: any) => {
      const userFound = this.medicos.find(m => m._id === data.userId);
      if(userFound){
        userFound.statusMedico = data.status ?? data.statusMedico
      }
    });
  }

  getMedicos(){
    this.loading =true;
    this.medicosService.getMedicos(this.page,{}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.medicos = res.medicos;
        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

    openModalNewAppoinment(medico:UserI){
      if(medico.statusMedico === 'enLinea'){
        const modal = this.ngbModal.open(NewAppointmentModalComponent,{centered:true,size:'lg',scrollable:true, backdrop:'static'});
        this.newAppointmentFormsService.medicoDisponible$.next(medico)
      }
    }

}
