import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesSurveyComponent } from './pages-survey.component';
import { AnswerSurveyComponent } from './answer-survey/answer-survey.component';

const routes: Routes = [
  {
    path:'',
    component: PagesSurveyComponent,
    children:[
      {
        path:'',
        component: AnswerSurveyComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesSurveyRoutingModule { }
