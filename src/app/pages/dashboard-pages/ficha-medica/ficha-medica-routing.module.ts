import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaMedicaComponent } from './ficha-medica.component';
import { AllFichasMedicasComponent } from './all-fichas-medicas/all-fichas-medicas.component';
import { NewFichaMedicaComponent } from './new-ficha-medica/new-ficha-medica.component';
import { FichaMedicaGuard } from './guards/ficha-medica.guard';
import { CustomFichaMedicaComponent } from './custom-ficha-medica/custom-ficha-medica.component';

const routes: Routes = [
  {
    path:'',
    component: FichaMedicaComponent,
    data:{
      title:'Ficha Medica',
      breadcrumb:{
        title:'Ficha Medica',
        url:'/dashboard/ficha-medica'
      }
    },
    children:[
      {
        path:'',
        data:{
          title:'Fichas medicas',
          breadcrumb:{
            title:'Fichas medicas',
            url:'/dashboard/ficha-medica'
          }
        },
        component: AllFichasMedicasComponent
      },
      {
        path:'nueva-ficha-medica/:idAppointment',
        data:{
          title:'Nueva ficha medica',
          breadcrumb:{
            title:'Nueva',
            url:'/dashboard/calendar'
          }
        },
        component: NewFichaMedicaComponent
      },
      {
        path:'editar-ficha-medica',
        canActivate:[FichaMedicaGuard],
        data:{
          title:'Editar ficha medica',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/ficha-medica/editar-ficha-medica'
          }
        },
        component: NewFichaMedicaComponent
      },
      {
        path:'personalizar-ficha-medica',
        data:{
          title:'Personalizar ficha medica',
          breadcrumb:{
            title:'Personalizar',
            url:'/dashboard/ficha-medica/personalizar-ficha-medica'
          }
        },
        component: CustomFichaMedicaComponent
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichaMedicaRoutingModule { }
