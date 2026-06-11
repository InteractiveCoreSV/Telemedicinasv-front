import { Component, Input, OnInit } from '@angular/core';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';

@Component({
  selector: 'app-subsidiary-card',
  templateUrl: './subsidiary-card.component.html',
  styles: [
  ]
})
export class SubsidiaryCardComponent implements OnInit {

  @Input() subsidiary?:SubsidiaryI;

  constructor() { }

  ngOnInit(): void {
  }

}
