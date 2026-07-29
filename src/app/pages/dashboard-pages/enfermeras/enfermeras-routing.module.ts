import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNurseComponent } from './create-nurse/create-nurse.component';
import { EnfermerasComponent } from './enfermeras.component';
import { ViewNursesComponent } from './view-nurses/view-nurses.component';

const routes: Routes = [
  {
    path:'',
    component:EnfermerasComponent,
    data:{
      title:'Enfermeras/os',
      breadcrumb:{
        title:'Enfermeras/os',
        url:'/dashboard/enfermeras'
      }
    },
    children:[
      {
        path:'crear-enfermera',
        data:{
          title:'Registrar una enfermera/o',
          breadcrumb:{
            title:'Registrar',
            url:'/dashboard/enfermeras/crear-enfermera'
          }
        },
        component:CreateNurseComponent
      },
      {
        path:'editar-enfermera',
        component:CreateNurseComponent,
        data:{
          title:'Editar una enfermera/o',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/enfermeras/editar-enfermera'
          }
        }
      },
      {
        path:'ver-enfermeras',
        data:{
          title:'Todas las enfermeras/os registradas',
          breadcrumb:{
            title:'Todas',
            url:'/dashboard/enfermeras/ver-enfermeras'
          }
        },
        component:ViewNursesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnfermerasRoutingModule { }
