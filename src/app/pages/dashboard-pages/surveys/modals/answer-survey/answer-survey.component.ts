import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AnswerI, SurveyI, QuestionI } from 'src/app/interfaces/survey.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { NgStepperComponent, NgStepperModule } from 'angular-ng-stepper';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveysService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    CdkStepperModule,
    NgStepperModule,
    ComponentsModule,
    FormsModule,
    NgbTooltipModule
  ]
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

 constructor(
    public ngbActiveModal: NgbActiveModal,
    private surveysService: SurveysService,
    private authService: AuthService,
    private alertService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI|null)=>{
        if(userInfo){
          this.getSurvey();
          this.patient = userInfo._id
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSurvey(){
    this.loading = true;

    this.surveysService.getSurvey().pipe(
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

    if (pregunta.answer?.type === 'Entrada de texto' && !pregunta.answer?.enterText) {
      this.alertService.toastMixin('Ingrese su respuesta para continuar.', 'warning');
      return
    }   

    this.ngxSpinnerService.show('generalSpinner')
    const data = {
      surveyToUpdate:this.surveyToUpdate,
      survey: this.survey._id,
      response: this.survey.questions
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

  closeSurvey(){
    this.ngbActiveModal.close({complete:true})
  }
}
