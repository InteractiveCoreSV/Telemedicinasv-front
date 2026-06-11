import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesPageRoutingModule } from './profiles-page-routing.module';
import { ProfilesPageComponent } from './profiles-page.component';
import { ProfileNavComponent } from './profile/profile-nav/profile-nav.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebardComponent } from './sidebard/sidebard.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgxMaskDirective } from 'ngx-mask';
import { ComponentsModule } from 'src/app/components/components.module';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    ProfilesPageComponent,
    ProfileNavComponent,
    ProfileHeaderComponent,
    ProfileComponent,
    SidebardComponent
  ],
  imports: [
    CommonModule,
    ProfilesPageRoutingModule,
    DirectivesModule,
    NgbModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskDirective,
    FormsModule,
    ComponentsModule,
    AngularSignaturePadModule,
    NgxPermissionsModule,
    PipesModule
  ]
})
export class ProfilesPageModule { }
