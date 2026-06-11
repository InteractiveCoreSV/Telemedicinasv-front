import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSubsidiariesComponent } from './all-subsidiaries.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title:'Todas las sucursales',
      breadcrumb:{
        title:'Todas',
        url:'/dashboard/sucursales'
      }
    },
    component:AllSubsidiariesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSubsidiariesRoutingModule { }
