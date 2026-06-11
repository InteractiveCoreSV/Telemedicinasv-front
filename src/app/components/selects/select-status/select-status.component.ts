import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-status',
  templateUrl: './select-status.component.html',
})
export class SelectStatusComponent implements OnInit {

  @Input() appendTo:string = '';

  allStatus:any[] = [
    {
      name:'Pending',
      nameEs:'Pendiente'
    },
    {
      name:'Reserved',
      nameEs:'Reservada'
    },
    {
      name:'Confirmed',
      nameEs:'Confirmada'
    },
    {
      name:'Completed',
      nameEs:'Completada'
    },
    {
      name:'Refuse',
      nameEs:'Cancelada'
    }
  ];


  statusSelected:any = null;
  @Output() private statusSelectedEv:EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

  selectedstatus(){
    this.statusSelectedEv.emit(this.statusSelected);
  }

  clear(){
    this.statusSelected = null;
  }

}
