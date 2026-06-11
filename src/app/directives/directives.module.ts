import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnfoldDirective } from './unfold.directive';
import { NavbarVerticalNavigationDirective } from './navbar-vertical-navigation.directive';
import { JsCircleDirective } from './js-circle.directive';
import { JsCounterDirective } from './js-counter.directive';
import { FileAttachDirective } from './file-attach.directive';
import { ClipboardDirective } from './clipboard.directive';
import { MaskedInputDirective } from './masked-input.directive';
import { Select2customDirective } from './select2custom.directive';
import { TogglePasswordDirective } from './toggle-password.directive';
import { ToggleSwitchDirective } from './toggle-switch.directive';
import { PwstrengthDirective } from './pwstrength.directive';
import { TagifyDirective } from './tagify.directive';
import { TagifyAvatarsDirective } from './tagify-avatars.directive';
import { QuillDirective } from './quill.directive';
import { QuantityCounterDirective } from './quantity-counter.directive';
import { FancyboxDirective } from './fancybox.directive';
import { FlatpickrDirective } from './flatpickr.directive';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { AddFieldDirective } from './add-field.directive';
import { CustomCheckboxCardInputDirective } from './custom-checkbox-card-input.directive';
import { ValidateDirective } from './validate.directive';
import { MenuNavbarDirective } from './menu-navbar.directive';
import { MegaMenuDirective } from './directivesTheme2/mega-menu.directive';
import { ShowAnimationDirective } from './directivesTheme2/show-animation.directive';
import { GoToDirective } from './directivesTheme2/go-to.directive';
import { AosDirective } from './directivesTheme2/aos.directive';
import { TypedjsDirective } from './directivesTheme2/typedjs.directive';
import { HeaderDirective } from './directivesTheme2/header.directive';
import { LeafletDirective } from './directivesTheme2/leaflet.directive';
import { InputFileDirective } from './input-file.directive';

@NgModule({
  declarations: [
    UnfoldDirective,
    NavbarVerticalNavigationDirective,
    JsCircleDirective,
    JsCounterDirective,
    FileAttachDirective,
    ClipboardDirective,
    MaskedInputDirective,
    Select2customDirective,
    TogglePasswordDirective,
    ToggleSwitchDirective,
    PwstrengthDirective,
    TagifyDirective,
    TagifyAvatarsDirective,
    QuillDirective,
    QuantityCounterDirective,
    FancyboxDirective,
    FlatpickrDirective,
    DaterangepickerDirective,
    AddFieldDirective,
    CustomCheckboxCardInputDirective,
    ValidateDirective,
    InputFileDirective,
    // Plantilla 2
    MenuNavbarDirective,
    MegaMenuDirective,
    ShowAnimationDirective,
    GoToDirective,
    AosDirective,
    TypedjsDirective,
    HeaderDirective,
    LeafletDirective,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    UnfoldDirective,
    NavbarVerticalNavigationDirective,
    JsCircleDirective,
    JsCounterDirective,
    FileAttachDirective,
    ClipboardDirective,
    MaskedInputDirective,
    Select2customDirective,
    TogglePasswordDirective,
    ToggleSwitchDirective,
    PwstrengthDirective,
    TagifyDirective,
    TagifyAvatarsDirective,
    QuillDirective,
    QuantityCounterDirective,
    FancyboxDirective,
    FlatpickrDirective,
    DaterangepickerDirective,
    AddFieldDirective,
    CustomCheckboxCardInputDirective,
    ValidateDirective,
    InputFileDirective,
    /// Plantilla 2
    MenuNavbarDirective,
    MegaMenuDirective,
    ShowAnimationDirective,
    GoToDirective,
    AosDirective,
    TypedjsDirective,
    HeaderDirective,
    LeafletDirective,
    MenuNavbarDirective,
  ]
})
export class DirectivesModule { }
