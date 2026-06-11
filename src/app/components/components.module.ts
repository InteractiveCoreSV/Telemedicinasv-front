import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { NotResultsTableComponent } from './not-results-table/not-results-table.component';
import { LoadingTableComponent } from './loading-table/loading-table.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AutocompleteGoogleComponent } from './autocomplete-google/autocomplete-google.component';
import { GooglemapLocationComponent } from './googlemap-location/googlemap-location.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDepartment2Component } from './selects/select-address-pickup/select-department2/select-department2.component';
import { SelectMunicipality2Component } from './selects/select-address-pickup/select-municipality2/select-municipality2.component';
import { SelectAddressPickupComponent } from './selects/select-address-pickup/select-address-pickup.component';
import { SelectHourComponent } from './selects/select-hour/select-hour.component';
import { SelectPlacesForHourComponent } from './modals/select-places-for-hour/select-places-for-hour.component';
import { PipesModule } from '../pipes/pipes.module';
import { AddHourComponent } from './modals/add-hour/add-hour.component';
import { SelectSubsidiaryComponent } from './selects/select-subsidiary/select-subsidiary.component';
import { SelectHourBloqueComponent } from './selects/select-hour-bloque/select-hour-bloque.component';
import { NewCategoryComponent } from './modals/services/new-category/new-category.component';
import { NewSubCategoryComponent } from './modals/services/new-sub-category/new-sub-category.component';
import { NewServiceComponent } from './modals/services/new-service/new-service.component';
import { SelectSubCategoryServiceComponent } from './selects/select-sub-category-service/select-sub-category-service.component';
import { SelectCategoryServiceComponent } from './selects/select-category-services/select-category-services.component';
import { StepsLabelsComponent } from './steps-labels/steps-labels.component';
import { SearchsUsersComponent } from './searchs/searchs-users/searchs-users.component';
import { SubsidiaryCardComponent } from './cards/subsidiary-card/subsidiary-card.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxMaskDirective } from 'ngx-mask';
import { RegisterUserComponent } from './modals/register-user/register-user.component';
import { NewHorarioForDoctorComponent } from './modals/new-horario-for-doctor/new-horario-for-doctor.component';
import { SelectRoleComponent } from './selects/select-role/select-role.component';
import { InsertLinkVideoconferenciaComponent } from './modals/appointments/insert-link-videoconferencia/insert-link-videoconferencia.component';
import { NewDocumentExpedienteComponent } from './modals/expedientes/new-document-expediente/new-document-expediente.component';
import { DropzoneOnlyOneComponent } from './dropzone-only-one/dropzone-only-one.component';
import { VewDocumentExpedienteComponent } from './modals/expedientes/vew-document-expediente/vew-document-expediente.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SelectCategoryDocumentExpedienteComponent } from './selects/select-category-document-expediente/select-category-document-expediente.component';
import { SelectMedicoComponent } from './selects/select-medico/select-medico.component';
import { SelectStatusComponent } from './selects/select-status/select-status.component';
import { SelectInsuranceComponent } from './selects/select-insurance/select-insurance.component';
import { ViewDocumentComponent } from './modals/appointments/view-document/view-document.component';
import { AddCampoFichaMedicaComponent } from './modals/ficha-medica/add-campo-ficha-medica/add-campo-ficha-medica.component';
import { AddSectionFichaMedicaComponent } from './modals/ficha-medica/add-section-ficha-medica/add-section-ficha-medica.component';
import { RouterModule } from '@angular/router';
import { GenerateTratamientoComponent } from './modals/ficha-medica/generate-tratamiento/generate-tratamiento.component';
import { GenerateReferenciaComponent } from './modals/ficha-medica/generate-referencia/generate-referencia.component';
import { DirectivesModule } from '../directives/directives.module';
import { ViewFichaMedicaComponent } from './modals/ficha-medica/view-ficha-medica/view-ficha-medica.component';
import { ViewExpedienteComponent } from './modals/expedientes/view-expediente/view-expediente.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { DoughnutHalfComponent } from './charts/doughnut-half/doughnut-half.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { SelectMeetingToolComponent } from './selects/select-meeting-tool/select-meeting-tool.component';
import { TermsAndConditionsComponent } from './modals/terms-and-conditions/terms-and-conditions.component';
import { NewMenorEdadComponent } from './modals/new-menor-edad/new-menor-edad.component';
import { ConfirmReagendaCitaComponent } from './modals/appointments/confirm-reagenda-cita/confirm-reagenda-cita.component';
import { SelectCategoryServiceForSubcategoryComponent } from './selects/select-category-services-for-subcategory/select-category-services-for-subcategory.component';
import { ChangeToMedicoTratamientoComponent } from './modals/expedientes/change-to-medico-tratamiento/change-to-medico-tratamiento.component';
import { SelectServiceComponent } from './selects/select-services/select-services.component';
import { ChangeStatusSolicitudMedicoComponent } from './modals/solicitud-medico/change-status-solicitud-medico/change-status-solicitud-medico.component';
import { CreateNewMedicoComponent } from './modals/solicitud-medico/create-new-medico/create-new-medico.component';
import { MedicosInLineLateralComponent } from './medicos-in-line-lateral/medicos-in-line-lateral.component';
import { ViewAnswersSurveyComponent } from './modals/view-answers-survey/view-answers-survey.component';
import { SelectEspecialidadComponent } from './selects/select-especialidad/select-especialidad.component';
import { AppointmentRemisionComponent } from './modals/appointments/appointment-remision/appointment-remision.component';
import { PayAppointmentComponent } from './modals/appointments/pay-appointment/pay-appointment.component';
import { ViewHistoryChangesStatusComponent } from './modals/appointments/view-history-changes-status/view-history-changes-status.component';
import { HistoryUserCrmComponent } from './modals/expedientes/history-user-crm/history-user-crm.component';
import { UpdateSexoBirthdayComponent } from './modals/user/update-sexo-birthday/update-sexo-birthday.component';
import { ViewSummaryFichasMedicasComponent } from './modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component';
import { ViewTextComponent } from './modals/view-text/view-text.component';
import { ViewDetailMedicoProfileComponent } from './modals/view-detail-medico-profile/view-detail-medico-profile.component';
import { SelectTypePaymmentComponent } from './selects/select-type-paymment/select-type-paymment.component';

let components = [
  PasswordStrengthComponent,
  NotResultsTableComponent,
  LoadingTableComponent,
  DropzoneComponent,
  DropzoneOnlyOneComponent,
  AutocompleteGoogleComponent,
  GooglemapLocationComponent,
  StepsLabelsComponent,
  MedicosInLineLateralComponent,

  //MODALS
  SelectPlacesForHourComponent,
  AddHourComponent,
  SelectSubsidiaryComponent,
  RegisterUserComponent,
  NewCategoryComponent,
  NewSubCategoryComponent,
  NewServiceComponent,
  InsertLinkVideoconferenciaComponent,
  NewDocumentExpedienteComponent,
  VewDocumentExpedienteComponent,
  NewHorarioForDoctorComponent,
  ViewDocumentComponent,
  AddCampoFichaMedicaComponent,
  AddSectionFichaMedicaComponent,
  GenerateTratamientoComponent,
  GenerateReferenciaComponent,
  ViewFichaMedicaComponent,
  ViewExpedienteComponent,
  ConfirmReagendaCitaComponent,
  
  //SELECTS
  SelectAddressPickupComponent,
  SelectDepartment2Component,
  SelectMunicipality2Component,
  SelectHourComponent,
  SelectHourBloqueComponent,
  SelectCategoryServiceComponent,
  SelectCategoryServiceForSubcategoryComponent,
  SelectServiceComponent,
  SelectSubCategoryServiceComponent,
  SelectSubCategoryServiceComponent,
  SelectRoleComponent,
  SelectCategoryDocumentExpedienteComponent,
  SelectMedicoComponent,
  SelectStatusComponent,
  SelectInsuranceComponent,
  SelectMeetingToolComponent,
  SelectEspecialidadComponent,
  SelectTypePaymmentComponent,

  //SEARCHS
  SearchsUsersComponent,

  //CARDS
  SubsidiaryCardComponent,

  //Charts
  LineChartComponent,
  DoughnutHalfComponent,
  BarChartComponent
]

@NgModule({
  declarations: [
    components,
    TermsAndConditionsComponent,
    NewMenorEdadComponent,
    ChangeToMedicoTratamientoComponent,
    CreateNewMedicoComponent,
    ViewAnswersSurveyComponent,
    AppointmentRemisionComponent,
    PayAppointmentComponent,
    ViewHistoryChangesStatusComponent,
    HistoryUserCrmComponent,
    UpdateSexoBirthdayComponent,
    ViewSummaryFichasMedicasComponent,
    ViewTextComponent,
    ViewDetailMedicoProfileComponent,
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    AutocompleteLibModule,
    NgxPermissionsModule,
    NgxMaskDirective,
    NgxDocViewerModule,
    RouterModule,
    DirectivesModule,
    NgbPaginationModule,
    NgbModule,
    NgChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports:[
    components
  ]
})
export class ComponentsModule { }
