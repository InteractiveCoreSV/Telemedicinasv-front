import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export interface LabelStepsI{
  label:string;
  number?:string;
}

@Component({
  selector: 'app-steps-labels',
  templateUrl: './steps-labels.component.html',
  styleUrls: ['./steps-labels.component.scss']
})
export class StepsLabelsComponent implements OnInit {
  @Input() encuesta:boolean = false;
  @Input() labelsEncuesta:number[] = [];

  @Input() labels:LabelStepsI[] = [];
  @Input() textColorClass:string = 'text-white';

  @Input() currentStep:number = 0;

  @Output() clickOnStep:EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  click(step:number){
    this.clickOnStep.emit(step);
  }
}
