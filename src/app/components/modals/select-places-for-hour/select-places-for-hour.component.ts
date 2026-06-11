import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Hours2I } from 'src/app/interfaces/hours.interface';
import { ParseDay } from 'src/app/pipes/parse-day.pipe';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-select-places-for-hour',
  templateUrl: './select-places-for-hour.component.html',
  styleUrls: ['./select-places-for-hour.component.scss']
})
export class SelectPlacesForHourComponent implements OnInit {


  @Input() hour!:Hours2I;
  @Input() subsidiary!:string;


  formSubmited:boolean = false
  places!:number

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
  }

  async closeModal(){
    this.formSubmited = true
    if(this.places && this.places >= 0){
      const   parseDay = new ParseDay();

      const {result} = await this.alertsService.confirmDialogWithModals('Asignación de espacios.',`Se asignaran ${this.places} espacios para la sucursal ${this.subsidiary} ${parseDay.transform(this.hour.day, true)} en el horario de ${this.hour.hours}`,'info');

      if(result.isConfirmed){
        this.ngbActiveModal.close({places:this.places})
      }

    }else {
      this.alertsService.toastMixin('Selecione la cantidad de cubiculos diponibles','info',4000)
    }
  }

}
