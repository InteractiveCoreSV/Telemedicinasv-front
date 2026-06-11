import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedienteMedicoComponent } from './expediente-medico.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { DetalleExpedienteComponent } from './detalle-expediente/detalle-expediente.component';

const routes: Routes = [
  {
    path:'',
    component: ExpedienteMedicoComponent,
    data:{
      title:'Expedientes',
      breadcrumb:{
        title:'Expedientes Medicos',
        url:'/dashboard/expedientes'
      }
    },
    children:[
      {
        path:'pacientes',
        data:{
          title:'Pacientes',
          breadcrumb:{
            title:'Pacientes',
            url:'/dashboard/expedientes/pacientes'
          }
        },
        component: PacientesComponent
      },
      {
        path:'detalle-expediente/:_id',
        data:{
          title:'Detalle de expediente ',
          breadcrumb:{
            title:'Detalle',
            url:'/dashboard/expedientes'
          }
        },
        component: DetalleExpedienteComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteMedicoRoutingModule { }
