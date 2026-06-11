import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AnswerI, SurveyI, QuestionI } from 'src/app/interfaces/survey.interface';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SurveysService } from 'src/app/services/survey.service';
import { UserI } from 'src/app/auth/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from 'src/app/services/appointments.service';
import { AppointmentI } from 'src/app/interfaces/appointment.interface';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.scss']
})
export class AnswerSurveyComponent implements OnInit, OnDestroy {
  @ViewChild('cdkStepper') stepperRegister!: NgStepperComponent;
  
  loading:boolean = true;
  survey!: SurveyI;

  initSurvey:boolean = false;
  endSurvey:boolean = false;

  subs:Subscription = new Subscription()
  
  userInfo!:UserI | null;

  @Input() surveyToUpdate!:string

  //mostrar preguntas
  labels:number[] = [];
  currentSlide:number = 0;

  patient!:string | undefined

  idAppointment!:string
  appointment!:AppointmentI

  completeSurveyAppointment:boolean = false

 constructor(
    private surveysService: SurveysService,
    private authService: AuthService,
    private alertService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit(): void {
    this.idAppointment = this.route.snapshot.queryParamMap.get('id') || '';
    this.getSurvey()
    if(this.idAppointment){
      this.getAppointment()
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAppointment(){
    this.loading = true;

    this.appointmentsService.getAppointmentByIdForSurvey(this.idAppointment).subscribe({
      next:((res:any)=>{
        this.appointment = res.appointment;
        if(this.appointment){
          this.validationAppointmentSurvey();
          this.patient = this.appointment.user._id
          this.getSurvey()

        }else {
          this.loading = false;
        }
      }),
      error:(e => {
        this.loading = false
        this.getSurvey()
      })
    })
  }

  validationAppointmentSurvey(){
    this.surveysService.validationAppointmentSurvey(this.appointment._id).subscribe({
      next:((res:any)=>{
        this.completeSurveyAppointment = res.completeSurveyAppointment;

        if(res.completeSurveyAppointment){
          this.loading = false
        }
      })
    })
  }

  getSurvey(){
    this.loading = true;

    this.surveysService.getSurveyForPatient().pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
    
        this.survey = res.survey;
        this.labels = Array.from({ length: this.survey.questions.length }, (_, i) => i + 1);
      })
    })
  }

  selectAnswer(preguntaIndex: number, respuestaIndex: number) {
    this.survey.questions[preguntaIndex].answer?.options?.forEach((respuesta, i) => {
      respuesta.select = i === respuestaIndex;
    });
  }
  
  setCurrentSlider(slide: any) {
    this.currentSlide = slide.selectedIndex;
  }

  nextStepperValidAnwer(pregunta: QuestionI) {
    const seleccionadas = pregunta.answer?.options?.filter(answer => answer.select === true).length;

    if (pregunta.answer?.type === 'Selección' && seleccionadas != 1) {
      this.alertService.toastMixin('Marque una respuesta para continuar.', 'warning');
      return
    } 

    if (pregunta.answer?.type === 'Entrada de texto' && !pregunta.answer?.enterText) {
      this.alertService.toastMixin('Ingrese su respuesta para continuar.', 'warning');
      return
    }   

    this.stepperRegister.next();

  }

  nextStepper() {
    this.initSurvey = true
  }

  prevStepper() {
    this.stepperRegister.previous();
  }

  prevViewSurvey() {
    this.initSurvey = false
  }

  goTo(step: number) {
    this.stepperRegister.selectedIndex = step;
  }

  completeSurvey(pregunta: QuestionI) {
    const seleccionadas = pregunta.answer?.options?.filter(answer => answer.select === true).length;

    if (pregunta.answer?.type === 'select' && seleccionadas != 1) {
      this.alertService.toastMixin('Marque una respuesta para continuar.', 'warning');
      return
    } 

    if (pregunta.answer?.type === 'Entrada de texto' && !pregunta.answer?.enterText && pregunta.answer.required === true) {
      this.alertService.toastMixin('Ingrese su respuesta para continuar.', 'warning');
      return
    }   

    this.ngxSpinnerService.show('generalSpinner')
    const data = {
      user: this.appointment.user._id,
      appointment:this.appointment._id,
      survey: this.survey._id,
      response: this.survey.questions,
      medico: this.appointment.medico._id
    }

    this.surveysService.completeSurvey(data).pipe(
      finalize(()=>{
        this.ngxSpinnerService.hide('generalSpinner')
      })
    ).subscribe({
      next:((res:any)=>{
        this.endSurvey = true
      })
    })
  }

}
