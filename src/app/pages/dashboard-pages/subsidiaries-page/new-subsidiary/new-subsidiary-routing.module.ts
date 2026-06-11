import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSubsidiaryComponent } from './new-subsidiary.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title:'Nueva sucursal',
      breadcrumb:{
        title:'Nueva',
        url:'/dashboard/sucursales/nueva-sucursal'
      }
    },
    component:NewSubsidiaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewSubsidiaryRoutingModule { }
