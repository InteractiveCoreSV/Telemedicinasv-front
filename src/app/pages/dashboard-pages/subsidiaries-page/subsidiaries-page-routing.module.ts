import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSubsidiaryResolver } from './resolvers/edit-subsidiary.resolver';
import { SubsidiariesPageComponent } from './subsidiaries-page.component';

const routes: Routes = [
  {
    path:'',
    component:SubsidiariesPageComponent,
    data:{
      title:'Sucursales',
      breadcrumb:{
        title:'Sucursales',
        url:'/dashboard/sucursales'
      }
    },
    children:[
      {
        path:'',
        loadChildren:()=>import('./all-subsidiaries/all-subsidiaries.module').then(m=>m.AllSubsidiariesModule)
      },
      {
        path:'nueva-sucursal',
        loadChildren:()=>import('./new-subsidiary/new-subsidiary.module').then(m=>m.NewSubsidiaryModule)
      },
      {
        path:'editar-sucursal/:idSubsidiary',
        data:{
          title:'Editar sucursal',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/ficha-medica/editar-ficha-medica'
          }
        },
        resolve:{
          subsidiary:EditSubsidiaryResolver
        },
        loadChildren:()=>import('./new-subsidiary/new-subsidiary.module').then(m=>m.NewSubsidiaryModule)
      },
      {
        path:'**',
        redirectTo:'/dashboard'
      }
    ]
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsidiariesPageRoutingModule { }
