import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoConferenciaComponent } from './video-conferencia.component';
import { AllVideoConferenciasComponent } from './all-video-conferencias/all-video-conferencias.component';
import { NewVideoConferenciaComponent } from './new-video-conferencia/new-video-conferencia.component';

const routes: Routes = [
  {
    path:'',
    component: VideoConferenciaComponent,
    data:{
      title:'Video conferencias',
      breadcrumb:{
        title:'Video conferencias',
        url:'/dashboard/video-conferencias'
      }
    },
    children:[
      {
        path:'',
        data:{
          title:'Todas las herramientas',
          breadcrumb:{
            title:'Herramientas',
            url:'/dashboard/video-conferencias'
          }
        },
        component: AllVideoConferenciasComponent
      },
      {
        path:'nueva-herramienta',
        data:{
          title:'Nueva herramienta',
          breadcrumb:{
            title:'Nueva herramienta',
            url:'/dashboard/video-conferencias/nueva-herramienta'
          }
        },
        component: NewVideoConferenciaComponent
      },
      // {
      //   path:'editar-medico',
      //   canActivate:[MedicoGuard],
      //   data:{
      //     title:'Editar médico',
      //     breadcrumb:{
      //       title:'Editar',
      //       url:'/dashboard/medicos/editar-medico'
      //     }
      //   },
      //   component: NewMedicoComponent
      // },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoConferenciaRoutingModule { }
