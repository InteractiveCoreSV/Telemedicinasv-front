import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './header/account/account.component';
import { DirectivesModule } from '../directives/directives.module';
import { HeaderVerifyEmailComponent } from './header-verify-email/header-verify-email.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HeaderLandingComponent } from './header-landing/header-landing.component';
import { PipesModule } from '../pipes/pipes.module';
import { FooterDashboardComponent } from './footer-dashboard/footer-dashboard.component';
import { FooterLasndingComponent } from './footer-lasnding/footer-lasnding.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    PageHeaderComponent,
    AccountComponent,
    HeaderVerifyEmailComponent,
    HeaderLandingComponent,
    FooterDashboardComponent,
    FooterLasndingComponent,
  ],
  imports: [
    CommonModule,
    // NgDynamicBreadcrumbModule,
    RouterModule,
    DirectivesModule,
    NgxPermissionsModule,
    PipesModule,
    ComponentsModule
  ],
  exports:[
    SidebarComponent,
    HeaderComponent,
    PageHeaderComponent,
    // NgDynamicBreadcrumbModule,
    HeaderVerifyEmailComponent,
    HeaderLandingComponent,
    FooterDashboardComponent,
    FooterLasndingComponent
  ]
})
export class SharedModule { }
