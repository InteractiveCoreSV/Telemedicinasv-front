import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveysRoutingModule } from './surveys-routing.module';
import { SurveysComponent } from './surveys.component';
import { ViewAnsweredSurveysComponent } from './view-answered-surveys/view-answered-surveys.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewDetailAnsweredSurveyComponent } from './modals/view-detail-answered-survey/view-detail-answered-survey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigSurveyComponent } from './config-survey/config-survey.component';
import { CustomTextSurveyComponent } from './modals/custom-text-survey/custom-text-survey.component';
import { PreviewTextSurveyComponent } from './modals/preview-text-survey/preview-text-survey.component';
import { AddQuestionComponent } from './modals/add-question/add-question.component';
import { AddIntructionsComponent } from './modals/add-intructions/add-intructions.component';
import { AddAnswerComponent } from './modals/add-answer/add-answer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangeBannerComponent } from './modals/change-banner/change-banner.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { SelectEditMessageComponent } from './modals/select-edit-message/select-edit-message.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FlatpickrModule } from 'angularx-flatpickr';


@NgModule({
  declarations: [
    SurveysComponent,
    ViewAnsweredSurveysComponent,
    ViewDetailAnsweredSurveyComponent,
    ConfigSurveyComponent,
    CustomTextSurveyComponent,
    PreviewTextSurveyComponent,
    AddQuestionComponent,
    AddIntructionsComponent,
    AddAnswerComponent,
    ChangeBannerComponent,
    SelectEditMessageComponent,
  ],
  imports: [
    CommonModule,
    SurveysRoutingModule,
    ComponentsModule,
    NgbPaginationModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTooltipModule,
    PipesModule,
    FlatpickrModule
  ]
})
export class SurveysModule { }
