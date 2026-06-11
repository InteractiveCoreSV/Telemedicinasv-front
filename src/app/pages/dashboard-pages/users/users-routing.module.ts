import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserGuard } from './guards/edit-user.guard';
import { UsersComponent } from './users.component';
import { ViewUsersComponent } from './view-users/view-users.component';

const routes: Routes = [
  {
    path:'',
    component:UsersComponent,
    data:{
      title:'Usuarios',
      breadcrumb:{
        title:'Usuarios',
        url:'/dashboard/usuarios'
      }
    },
    children:[
      {
        path:'crear-usuario',
        data:{
          title:'Registrar un usuario',
          breadcrumb:{
            title:'Registrar',
            url:'/dashboard/usuarios/crear-usuario'
          }
        },
        component:CreateUserComponent
      },
      {
        path:'editar-usuario',
        component:CreateUserComponent,
        data:{
          title:'Editar un usuario',
          breadcrumb:{
            title:'Editar',
            url:'/dashboard/usuarios/editar-usuario'
          }
        } 
        // canActivate:[EditUserGuard]
      },
      {
        path:'ver-usuarios',
        data:{
          title:'Todos los usuarios registrados',
          breadcrumb:{
            title:'Todos',
            url:'/dashboard/usuarios/ver-usuarios'
          }
        },
        component:ViewUsersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
