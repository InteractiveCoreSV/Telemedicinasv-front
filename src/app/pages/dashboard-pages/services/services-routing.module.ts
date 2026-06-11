import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { AllServicesComponent } from './all-services/all-services.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';

const routes: Routes = [
  {
    path:'',
    component: ServicesComponent,
    data:{
      title:'Servicios',
      breadcrumb:{
        title:'Servicios',
        url:'/dashboard/servicios'
      }
    },
    children:[
      {
        path:'',
        data:{
          title:'Servicios',
          breadcrumb:{
            title:'Servicios',
            url:'/dashboard/servicios'
          }
        },
        component: AllServicesComponent
      },
      {
        path:'categorias',
        data:{
          title:'Gestion de categorías de servicios',
          breadcrumb:{
            title:'Categorías',
            url:'/dashboard/servicios/categorias'
          }
        },
        component: CategoriesComponent
      },
      {
        path:'sub-categorias',
        data:{
          title:'Gestion de sub categorías de servicios',
          breadcrumb:{
            title:'Sub Categorías',
            url:'/dashboard/servicios/sub-categorias'
          }
        },
        component: SubCategoriesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
