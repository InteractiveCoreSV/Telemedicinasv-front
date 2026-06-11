import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HourSelect } from 'src/app/interfaces/hours.interface';

@Component({
  selector: 'app-select-hour-bloque',
  templateUrl: './select-hour-bloque.component.html',
  styleUrls: ['./select-hour-bloque.component.scss']
})
export class SelectHourBloqueComponent implements OnInit {
  hours: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  minutes: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
  pm_am: string[] = ['AM','PM']

  @Input() hourSelect!:number;
  @Input() minuteSelect!: number;
  @Input() pm_amSelect!:string;

  @Output() hourComplete:EventEmitter<HourSelect> = new EventEmitter<HourSelect>();

  constructor() { }

  ngOnInit(): void {
  }

  selectHourComplete(){
    if(this.hourSelect  && this.pm_amSelect){
      const hour = {
        hour:this.hourSelect,
        minute:this.minuteSelect,
        pm_am:this.pm_amSelect
      }
      
      this.hourComplete.emit(hour);

    }
  }

}
