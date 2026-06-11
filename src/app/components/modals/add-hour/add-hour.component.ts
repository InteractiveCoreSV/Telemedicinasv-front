import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HourSelect, Hours2I } from 'src/app/interfaces/hours.interface';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-add-hour',
  templateUrl: './add-hour.component.html',
  styleUrls: ['./add-hour.component.scss']
})
export class AddHourComponent implements OnInit {

  @Input() hour!:Hours2I;

  formSubmited:boolean = false
  places!:number

  hourStart!:HourSelect;
  hourEnd!:HourSelect;

  cupos!:number

  @Input() forEspecialDay:boolean = false;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
  }

  completeHour(hour:HourSelect,start:boolean){
    if(start){
      this.hourStart = hour
    }else {
      this.hourEnd = hour
    }
  }

  selectOrder(hour:number,pm_am:string){
    let order:number = 0
    switch (hour) {
      case 12:
        order = pm_am === 'AM' ? 0 : 12;
        // if(pm_am == 'AM')
        break
      case 1:
        order = pm_am === 'AM' ? 1 : 13;
        break
      case 2:
        order = pm_am === 'AM' ? 2 : 14;
        break
      case 3:
        order = pm_am === 'AM' ? 3 : 15;;
        break
      case 4:
        order = pm_am === 'AM' ? 4 : 16;;
        break
      case 5:
        order = pm_am === 'AM' ? 5 : 17;
        break
      case 6:
        order = pm_am === 'AM' ? 6 : 18;
        break
      case 7:
        order = pm_am === 'AM' ? 7 : 19;;
        break
      case 8:
        order = pm_am === 'AM' ? 8 : 20;;
        break
      case 9:
        order = pm_am === 'AM' ? 9 : 21;;
        break
      case 10:
        order = pm_am === 'AM' ? 10 : 22;
        break
      case 11:
        order = pm_am === 'AM' ? 11 : 23;
        break    
      default:
        // Bloque de código
    }

    return order
  }

  async closeModal(){
    this.formSubmited = true

    if(this.forEspecialDay && !this.cupos){
      this.alertsService.toastMixin('Ingrese la catidad de cupos disponibles', 'error');
      return;
    }

    if(this.hourStart && this.hourEnd){

      const startMinute = this.hourStart.minute>=1 && this.hourStart.minute<=9 ? `0${this.hourStart.minute}`: this.hourStart.minute;
      const endMinute = this.hourEnd.minute>=1 && this.hourEnd.minute<=9 ? `0${this.hourEnd.minute}`: this.hourEnd.minute;

      this.hour = {
        time: this.hourStart.pm_am == 'AM' ? 'morning' : 'afternoon',
        order: this.selectOrder(this.hourStart.hour,this.hourStart.pm_am),
        hours: `${this.hourStart.hour}:${startMinute ? startMinute : '00'}${this.hourStart.pm_am} - ${this.hourEnd.hour}:${endMinute ? endMinute : '00'}${this.hourEnd.pm_am}`,
        hourStart: this.hourStart,
        hourEnd: this.hourEnd
      }

      this.ngbActiveModal.close({hour:this.hour, cupos:this.cupos})
    }else {
      this.alertsService.toastMixin('Ingrese las horas', 'error');

    }
  }

}
