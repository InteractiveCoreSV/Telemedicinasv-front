import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StadisticsPageComponent } from './stadistics-page.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title:'Estadísticas',
      breadcrumb:{
        title:'Estadísticas',
        breadcrumb:{
          title:'Estadísticas',
          url:'/dashboard/estaditicas'
        }
      }
    },
    component:StadisticsPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StadisticsPageRoutingModule { }
