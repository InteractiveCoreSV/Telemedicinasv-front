import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { NewAppointmentFormsService } from 'src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { UsersService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';
import { Hours2I } from 'src/app/interfaces/hours.interface';
import { AppointmentRemisionComponent } from '../modals/appointments/appointment-remision/appointment-remision.component';
import { ServiceService } from 'src/app/services/service.service';
import { CategoryServiceI } from 'src/app/interfaces/service.interface';

interface UserConHour extends UserI {
  newHourDisponible: Hours2I; // 👈 campo extra que quieras
}

@Component({
  selector: 'app-medicos-in-line-lateral',
  templateUrl: './medicos-in-line-lateral.component.html',
  styleUrls: ['./medicos-in-line-lateral.component.scss']
})
export class MedicosInLineLateralComponent implements OnInit {

  medicos:UserConHour[]=[];
  loading:boolean =true;
  paginationDetails!: PaginationDetailsI;

  page:number = 1;
  filter:any={}

  medicosDisponibles:number = 0

  subs:Subscription = new Subscription()
  appointmeRemision!:AppointmentI

  typeAppointment!:string
  newVirtual:boolean = false
  categoriesServices:CategoryServiceI[] = []
  currentCategoriesServices!:CategoryServiceI

  constructor(
    private medicosService: UsersService,
    private alertsService: AlertsService,
    private webSocketService: WebSocketService,
    private ngbModal: NgbModal,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private appointmentsService: AppointmentsService,
    private categoriesServicesService: ServiceService,
  ) { }

  ngOnInit(): void {

    this.subs.add(
      this.appointmentsService.appointmentRemisionSelected$.subscribe(appointment => {
        if(appointment){
          
          this.appointmeRemision = appointment;
          this.currentCategoriesServices = this.appointmeRemision.typeAppoinment
          this.filter.citaInmediata = true;

          if(!appointment.typeAppoinment?.online){
            this.filter.subsidiary = appointment.subsidiary._id
            this.typeAppointment = 'Presencial';
          }

          this.getMedicos();
          this.getcategoriesServices();
        }else {
          this.getMedicos();
        }
      })
    )

    this.webSocketService.onStatusUpdate().subscribe((data: any) => {
      if(this.appointmeRemision){
          this.getMedicos()
      }else {
        const userFound = this.medicos.find(m => m._id === data.userId);
        if(userFound){
          userFound.statusMedico = data.status ?? data.statusMedico
        }
          this.medicos = this.medicos.sort((a:any, b:any) => 
            (a.statusMedico === 'enLinea' ? -1 : 1) - (b.statusMedico === 'enLinea' ? -1 : 1)
          );

        this.medicosDisponibles = this.medicos.filter(m =>  m.statusMedico === 'enLinea').length;
      }

    });
  }

  getcategoriesServices(){
     this.categoriesServicesService.getCategoriesServices(1,{status: 'true'}).subscribe({
      next:(res:any)=>{
        this.categoriesServices = res.serviceCategoris;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  allMedicos(){
    this.filter.citaInmediata = false;
    this.getMedicos()
  }

  getMedicos(){
    this.loading =true;
    this.medicosService.getMedicos(this.page,this.filter).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:(res:any)=>{
        this.medicos = res.medicos.sort((a:any, b:any) => 
          (a.statusMedico === 'enLinea' ? -1 : 1) - (b.statusMedico === 'enLinea' ? -1 : 1)
        );
        
        this.medicosDisponibles = this.medicos.filter(m =>  m.statusMedico === 'enLinea').length;

        this.paginationDetails = res.paginationDetails;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectTypeAppointment(type:string){
    this.filter.subsidiary = null
    this.newVirtual = true
    this.appointmeRemision.typeAppoinment = this.categoriesServices.filter(c => c._id && ['66f7518eb1f4cb4c06c13f6e','68489ef7113599a86acdd9f3'].includes(c._id))[0]

    if(type === 'Presencial'){
      this.filter.subsidiary = this.appointmeRemision.subsidiary._id
      this.newVirtual = false;
      this.appointmeRemision.typeAppoinment = this.currentCategoriesServices
    }

    this.getMedicos();
  }

  agendaInmediata(medico: UserConHour){
    this.appointmeRemision.medico = medico
    this.appointmeRemision.hour = medico.newHourDisponible
    this.appointmeRemision.subsidiary = medico.subsidiary ?? this.appointmeRemision.subsidiary
    this.appointmeRemision.dateAppointment = new Date().toISOString()
    this.appointmeRemision.status = 'pending_payment'
    this.appointmeRemision.remitida = true
    this.appointmeRemision.typePayment = 'pending_payment'

    const modalRefConfirm = this.ngbModal.open(AppointmentRemisionComponent,{centered:true,size:'lg',backdrop:'static'});
    modalRefConfirm.componentInstance.appointment = this.appointmeRemision
    modalRefConfirm.componentInstance.newVirtual = this.newVirtual
  }

async openModalNewAppoinment(medico: UserI | null) {

  // Seleccionamos el Offcanvas abierto
  const offcanvasEl = document.querySelector('.offcanvas.show');

  const openModal = async () => {
    try {
      const { NewAppointmentModalComponent } = await import(
        'src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component'
      );

      const modalRef = this.ngbModal.open(NewAppointmentModalComponent, {
        centered: true,
        size: 'lg',
        scrollable: true,
        backdrop: 'static'
      });

      // Pasamos el médico disponible al servicio
      this.newAppointmentFormsService.medicoDisponible$.next(medico);

      if(this.appointmeRemision){
        this.newAppointmentFormsService.remitida$.next(true);
      }
      // Esperamos el resultado del modal
      const result = await modalRef.result;
      if (result?.reload) {
        this.newAppointmentFormsService.totalAppointment$.next(0);
      }
    } catch { }
  };

  if (offcanvasEl) {
    // Listener solo si hay un offcanvas abierto
    const listener = async () => {
      await openModal();
      offcanvasEl.removeEventListener('hidden.bs.offcanvas', listener);
    };
    offcanvasEl.addEventListener('hidden.bs.offcanvas', listener);

    // Cerramos el offcanvas para que el listener se dispare
    (offcanvasEl as any).classList.remove('show');
  } else {
    // Abrimos directamente si no hay offcanvas
    await openModal();
  }
}





}
