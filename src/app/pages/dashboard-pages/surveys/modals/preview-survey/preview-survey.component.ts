import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { ComponentsModule } from 'src/app/components/components.module';
import { QuestionI, SurveyI } from 'src/app/interfaces/survey.interface';

@Component({
  selector: 'app-preview-survey',
  templateUrl: './preview-survey.component.html',
  styleUrls: ['./preview-survey.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    CdkStepperModule,
    NgStepperModule,
    ComponentsModule,
    FormsModule,
    NgbTooltipModule
  ]
})
export class PreviewSurveyComponent implements OnInit {
  @ViewChild('cdkStepper') stepperRegister!: NgStepperComponent;
  

  @Input() survey!: SurveyI;

  newSurvey!: SurveyI;

  initSurvey:boolean = false;
  endSurvey:boolean = false;

  labels:number[] = [];
  currentSlide:number = 0;

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.newSurvey = structuredClone(this.survey);
    this.labels = Array.from({ length: this.newSurvey.questions.length }, (_, i) => i + 1);
  }

  selectAnswer(preguntaIndex: number, respuestaIndex: number) {
      this.newSurvey.questions[preguntaIndex].answer?.options?.forEach((respuesta, i) => {
        respuesta.select = i === respuestaIndex;
      });
    }
    
  setCurrentSlider(slide: any) {
    this.currentSlide = slide.selectedIndex;
  }

  nextStepperValidAnwer(pregunta: QuestionI) {
    this.stepperRegister.next();
  }

  nextStepper() {
    this.initSurvey = true
  }

  prevStepper() {
    this.stepperRegister.previous();
  }

  prevViewSurvey() {
    this.initSurvey = false
  }

  goTo(step: number) {
    this.stepperRegister.selectedIndex = step;
  }

  completeSurvey(pregunta: QuestionI) { 
    this.endSurvey = true
  }
}
