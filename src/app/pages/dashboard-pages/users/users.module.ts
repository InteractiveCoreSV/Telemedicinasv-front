import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { UsersComponent } from './users.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FlatpickrModule } from 'angularx-flatpickr';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    CreateUserComponent,
    UsersComponent,
    ViewUsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    NgbModule,
    // FlatpickrModule
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskDirective,
    NgxPermissionsModule
  ]
})
export class UsersModule { }
