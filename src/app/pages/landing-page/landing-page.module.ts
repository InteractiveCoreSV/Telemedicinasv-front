import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from "../../shared/shared.module";
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    LandingPageComponent,
    HomeComponent,
    ServicesComponent,
    ContactanosComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    SharedModule,
    NgbModule
]
})
export class LandingPageModule { }
