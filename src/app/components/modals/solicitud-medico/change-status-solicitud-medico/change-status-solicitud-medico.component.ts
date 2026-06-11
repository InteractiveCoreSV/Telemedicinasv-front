import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SolicitudMedicoI } from 'src/app/interfaces/solicitud-medico.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SolicitudMedicoService } from 'src/app/services/solicitud-medico.service';

@Component({
  selector: 'app-change-status-solicitud-medico',
  templateUrl: './change-status-solicitud-medico.component.html',
  styleUrls: ['./change-status-solicitud-medico.component.scss'],
  standalone:true,
  imports:[
    FormsModule,
    NgxPermissionsModule,
    CommonModule,
  ]
})
export class ChangeStatusSolicitudMedicoComponent implements OnInit {

  @Input() status:string = '';
  @Input() medicoId:string = '';
  @Input() medico!:SolicitudMedicoI;

  optionSelected: string = '';

  formSubmited:boolean = false

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private medicosService: SolicitudMedicoService,
  ) { }

  ngOnInit(): void {
    this.optionSelected = this.status;
  }

  async changeStatus(){
    this.formSubmited = true

    this.formSubmited = true
    await this.ngxSpinnerService.show('generalSpinner');
    this.medicosService.changeStatus(this.medicoId,this.optionSelected).pipe(
      finalize(async()=>{
        await this.ngxSpinnerService.hide('generalSpinner');
      })
    ).subscribe({
      next:((res:any)=>{
        this.alertsService.toastMixin(res.message,'success');
        this.ngbActiveModal.close({reload:true});
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      })
    })
  }

}
