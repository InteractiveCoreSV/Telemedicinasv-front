import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicosComponent } from './medicos.component';
import { AllMedicosComponent } from './all-medicos/all-medicos.component';
import { NewMedicoComponent } from './new-medico/new-medico.component';
import { MedicoGuard } from './guards/medicos.guard';
import { NewMedicoSolicitudComponent } from './new-medico-solicitud/new-medico-solicitud.component';
import { AllMedicoSolicitudComponent } from './all-medico-solicitud/all-medico-solicitud.component';
import { SolicitudMedicoGuard } from './guards/medico-silicitud.guard';
// import { MedicosInLineComponent } from './medicos-in-line/medicos-in-line.component';

const routes: Routes = [
  {
    path:'',
    component: MedicosComponent,
    data:{
      title:'Médicos',
      breadcrumb:{
        title:'Medicos',
        url:'/dashboard/medicos'
      }
    },
    children:[
      {
        path:'',
        data:{
          title:'Médicos',
          breadcrumb:{
            title:'Todos',
            url:'/dashboard/medicos'
          }
        },
        component: AllMedicosComponent
      },
      // {
      //   path:'medicos-status',
      //   data:{
      //     title:'Médicos en linea',
      //     breadcrumb:{
      //       title:'Médicos',
      //       url:'/dashboard/medicos-status'
      //     }
      //   },
      //   component: MedicosInLineComponent
      // },
      {
        path:'nuevo-medico',
        data:{
          title:'Nuevo médico',
          breadcrumb:{
            title:'Nuevo',
            url:'/dashboard/medicos/nuevo-medico'
          }
        },
        component: NewMedicoComponent
      },
      {
        path:'editar-medico',
        canActivate:[MedicoGuard],
        data:{
          title:'Editar médico',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/medicos/editar-medico'
          }
        },
        component: NewMedicoComponent
      },
      {
        path:'nueva-solicitud-medico',
        data:{
          title:'Nueva solicitud de médico',
          breadcrumb:{
            title:'Nuevo',
            url:'/dashboard/medicos/nueva-solicitud-medico'
          }
        },
        component: NewMedicoSolicitudComponent
      },
      {
        path:'editar-solicitud-medico',
        canActivate:[SolicitudMedicoGuard],
        data:{
          title:'Editar solicitud de médico',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/medicos/editar-solicitud-medico'
          }
        },
        component: NewMedicoSolicitudComponent
      },
      {
        path:'solicitudes-medico',
        data:{
          title:'Solicitudes para médico',
          breadcrumb:{
            title:'Solicitudes para médico',
            url:'/dashboard/medicos/solicitudes-medico'
          }
        },
        component: AllMedicoSolicitudComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicosRoutingModule { }
