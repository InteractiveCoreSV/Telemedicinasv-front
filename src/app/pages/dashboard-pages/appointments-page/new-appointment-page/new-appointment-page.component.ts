import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgStepperComponent } from 'angular-ng-stepper';
import { LabelStepsI } from 'src/app/components/steps-labels/steps-labels.component';
import { NewAppointmentFormsService } from './new-appointment-forms.service';

@Component({
  selector: 'app-new-appointment-page',
  templateUrl: './new-appointment-page.component.html',
  styleUrls: ['./new-appointment-page.component.scss']
})
export class NewAppointmentPageComponent implements OnInit,AfterViewInit {
  @ViewChild('cdkStepper') stepperRegister!: NgStepperComponent;

  showStep3:boolean = false

  labels:LabelStepsI[] = [
    {
      label:'Tipo de cita',
      number:'1'
    },
    {
      label:'Usuario y Urgencia',
      number:'2'
    },
    {
      label:'Servicio, médico y fecha',
      number:'3'
    },
    {
      label:'Resumen',
      number:'4'
    }
  ];

  showStepper:boolean = false;

  currentSlide:number = 0;

  @Output() createUser:EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() appointmentRegistered:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public ngbActiveModal: NgbActiveModal,
    private newAppointmentFormsService: NewAppointmentFormsService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.showStepper = true;
      this.changeDetectorRef.detectChanges();
    },250)
  }

  setCurrentSlider(slide: any) {
    this.currentSlide = slide.selectedIndex;
  }

  nextStepper() {
    this.stepperRegister.next();
  }

  prevStepper() {
    this.stepperRegister.previous();
  }

  goTo(step: number) {
    this.stepperRegister.selectedIndex = step;
  }

  closeModal(){
    this.ngbActiveModal.close({reload:false});
    this.newAppointmentFormsService.medicoDisponible$.next(null);
  }
}
