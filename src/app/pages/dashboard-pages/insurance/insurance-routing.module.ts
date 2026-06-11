import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceComponent } from './insurance.component';
import { AllInsurersComponent } from './all-insurers/all-insurers.component';
import { NewInsuranceComponent } from './new-insurance/new-insurance.component';
import { InsuranceGuard } from './guards/insurance.guard';

const routes: Routes = [
  {
    path:'',
    component: InsuranceComponent,
    data:{
      title:'Aseguradoras',
      breadcrumb:{
        title:'Aseguradoras',
        url:'/dashboard/aseguradoras'
      }
    },
    children:[
      {
        path:'',
        data:{
          title:'Aseguradoras',
          breadcrumb:{
            title:'',
            url:'/dashboard/aseguradoras'
          }
        },
        component: AllInsurersComponent
      },
      {
        path:'nueva-aseguradora',
        data:{
          title:'Nueva Aseguradora',
          breadcrumb:{
            title:'Nueva',
            url:'/dashboard/aseguradoras/nueva-aseguradora'
          }
        },
        component: NewInsuranceComponent
      },
      {
        path:'editar-aseguradora',
        canActivate:[InsuranceGuard],
        data:{
          title:'Editar Aseguradora',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/aseguradoras/editar-aseguradora'
          }
        },
        component: NewInsuranceComponent
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
