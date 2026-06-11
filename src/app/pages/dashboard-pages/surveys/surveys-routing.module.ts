import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveysComponent } from './surveys.component';
import { ViewAnsweredSurveysComponent } from './view-answered-surveys/view-answered-surveys.component';
import { ConfigSurveyComponent } from './config-survey/config-survey.component';

const routes: Routes = [
  {
    path:'',
    component: SurveysComponent,
    // data:{
    //   title:'Encuestas',
    //   breadcrumb:{
    //     title:'Encuestas',
    //     url:'/dashboard/encuestas'
    //   }
    // },
    children:[
      {
        path:'',
        data:{
          title:'Encuestas contestadas',
          breadcrumb:[
            {
              label:'Dashboard',
              url:'/'
            },
            {
              label:'Encuestas contestadas',
              url:'/dashboard/encuestas'
            }
          ]
        },
        component: ViewAnsweredSurveysComponent
      },
      {
        path:'formulario-encuesta',
        data:{
          title:'Formulario de encuesta',
          breadcrumb:[
            {
              label:'Dashboard',
              url:'/'
            },
            {
              label:'Formulario de encuesta',
              url:'/dashboard/encuestas/formulario-encuesta'
            }
          ]
        },
        component: ConfigSurveyComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveysRoutingModule { }
