import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Hours2I } from 'src/app/interfaces/hours.interface';
@Component({
  selector: 'app-select-hour',
  templateUrl: './select-hour.component.html',
  styles: [
  ]
})
export class SelectHourComponent implements OnInit {
  @Input() hours:Hours2I[] = [];
  @Input() appendTo:string = '';
  @Output() hourSelected:EventEmitter<Hours2I | null> = new EventEmitter<Hours2I | null>();
  hourModel:Hours2I | null = null;
  
  constructor() { }
  ngOnInit(): void {
  }
  selectHour(){
    this.hourSelected.emit(this.hourModel);
  }
  clear(){
    this.hourModel = null;
  }
}