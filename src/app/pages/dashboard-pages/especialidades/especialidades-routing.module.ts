import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialidadesComponent } from './especialidades.component';

const routes: Routes = [
  {
    path:'',
    component:EspecialidadesComponent,
    data:{
      title:'Especialidades',
      breadcrumb:{
        title:'Especialidades',
        url:'/dashboard/especialidades'
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialidadesRoutingModule { }
