import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesSurveyRoutingModule } from './pages-survey-routing.module';
import { PagesSurveyComponent } from './pages-survey.component';
import { AnswerSurveyComponent } from './answer-survey/answer-survey.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    PagesSurveyComponent,
    AnswerSurveyComponent
  ],
  imports: [
    CommonModule,
    PagesSurveyRoutingModule,
    CdkStepperModule,
    NgStepperModule,
    ComponentsModule,
    FormsModule,
    NgbTooltipModule,
  ]
})
export class PagesSurveyModule { }
