import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardPagesComponent } from './dashboard-pages/dashboard-pages.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routesModule: Routes = [

  {
    path:'',
    // component:LandingPageComponent,
    loadChildren:()=>import('./landing-page/landing-page.module').then(m=>m.LandingPageModule)
  },
   {
    path:'auth',
    loadChildren:()=>import('../auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'dashboard',
    // component:DashboardPagesComponent,
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
    path: 'encuesta',
    loadChildren: () => import('./pages-survey/pages-survey.module').then(m => m.PagesSurveyModule)
  },
  {
    path:'**',
    pathMatch:'full',
    redirectTo:'/'
  }
];


// // --------------------------------------------------------------------- RUTAS PARA PORTAL ---------------------------------------------------------------------
// const routesDashboard: Routes = [
//   {
//     path:'auth',
//     loadChildren:()=>import('../auth/auth.module').then(m=>m.AuthModule)
//   },
//   {
//     path: 'dashboard',
//     component:DashboardPagesComponent,
//     canLoad:[NgxPermissionsGuard],
//     data:{
//       permissions:{
//         only:['admin','patient','medico','sac'],
//         redirectTo:'/auth'
//       },
//       breadcrumb:{
//         title:'Escritorio',
//         url:'/dashboard/calendar'
//       }
//     },   
//     loadChildren:()=>import('./dashboard-pages/dashboard-pages.module').then(m=>m.DashboardPagesModule),
//   },

//   {
//     path:'**',
//     pathMatch:'full',
//     redirectTo:'/dashboard/calendar'
//   }
// ];

// const hostname = (typeof window !== 'undefined' && typeof document !== 'undefined')? window.location.hostname:'';

// let routesModule:any;

// if (hostname === 'telemedicina-analiza.netlify.app' || hostname === 'localhost' || hostname === 'telemedicina-analiza.com') {
//   routesModule = routesLandingPage;
// }

// if (
//   hostname === 'portal-telemedicina-analiza.netlify.app' ||
//   hostname === 'portal.localhost' ||
//   hostname === 'portal.telemedicina-analiza.com'
// ) {
//   routesModule = routesDashboard;
// }

// if(!hostname){
//   routesModule = routesLandingPage;
// }

@NgModule({
  imports: [RouterModule.forChild(routesModule)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
