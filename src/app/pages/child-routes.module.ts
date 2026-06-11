import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DashboardPagesComponent } from './dashboard-pages/dashboard-pages.component';

const routes:Routes = [

  {
    path: 'dashboard',
    component:DashboardPagesComponent,
    canLoad:[NgxPermissionsGuard],
    data:{
      permissions:{
        only:['admin','patient','medico','sac'],
        redirectTo:'/auth'
      },
      
    },   
    loadChildren:()=>import('./dashboard-pages/dashboard-pages.module').then(m=>m.DashboardPagesModule),
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'/dashboard/calendar/appointments'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ChildRoutesModule { }
