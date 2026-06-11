import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPagesRoutingModule } from './dashboard-pages-routing.module';
import { DashboardPagesComponent } from './dashboard-pages.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { SplashScreenModule } from 'src/app/components/splash-screen/splash-screen.module';
import { FichaMedicaComponent } from './ficha-medica/ficha-medica.component';
import { HomeRComponent } from './home-r/home-r.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DashboardPagesComponent,
    FichaMedicaComponent,
    HomeRComponent
  ],
  imports: [
    CommonModule,
    DashboardPagesRoutingModule,
    NgxPermissionsModule,
    SharedModule,
    ComponentsModule,
    SplashScreenModule,
    PipesModule,
    NgbPaginationModule
  ]
})
export class DashboardPagesModule { }
