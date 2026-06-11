import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AnswerI, QuestionI, SurveyI } from 'src/app/interfaces/survey.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SurveysService } from 'src/app/services/survey.service';
import { CustomTextSurveyComponent } from '../modals/custom-text-survey/custom-text-survey.component';
import { AddQuestionComponent } from '../modals/add-question/add-question.component';
import { AddAnswerComponent } from '../modals/add-answer/add-answer.component';
import { ChangeBannerComponent } from '../modals/change-banner/change-banner.component';
import { SelectEditMessageComponent } from '../modals/select-edit-message/select-edit-message.component';
import { PreviewSurveyComponent } from '../modals/preview-survey/preview-survey.component';

@Component({
  selector: 'app-config-survey',
  templateUrl: './config-survey.component.html',
  styleUrls: ['./config-survey.component.scss']
})
export class ConfigSurveyComponent implements OnInit{
  survey!:SurveyI

  formSubmited:boolean = false;

  loading:boolean = false

  constructor(
    private ngbModal: NgbModal,
    private ngxSpinnerService: NgxSpinnerService,
    private alertsService: AlertsService,
    private surveysService: SurveysService
  ) { }

  ngOnInit(): void {
    this.getSurvey()

  }

  selectAnswer(preguntaIndex: number, respuestaIndex: number) {
    this.survey.questions[preguntaIndex].answer?.options?.forEach((respuesta, i) => {
      respuesta.select = i === respuestaIndex;
    });
  }

  async selectCustomMessagesModal(){
    const modal = this.ngbModal.open(SelectEditMessageComponent,{centered:true, backdrop:'static'});

    modal.componentInstance.survey = this.survey

    try {
      const result = await modal.result;
      if(result.data){
        this.survey = result.survey       
      }
    } catch (error) {}
  }

  async openChangeBannerModal(){
    const modal = this.ngbModal.open(ChangeBannerComponent,{centered:true, backdrop:'static'});

    modal.componentInstance.surveyId = this.survey._id
    modal.componentInstance.banner = this.survey.banner

    try {
      const result = await modal.result;
      if(result.banner){
        this.survey.banner = result.banner       
      }
    } catch (error) {}
  }

  async previewSurveyModal(){
    const modal = this.ngbModal.open(PreviewSurveyComponent,{centered:true});

    modal.componentInstance.survey = this.survey
  }

  async newQuestionModal(preguntaIndex?:number,question?:QuestionI,edit?:boolean){
    const modal = this.ngbModal.open(AddQuestionComponent,{centered:true});

    modal.componentInstance.surveyId = this.survey._id

    if(question){
      modal.componentInstance.question = question
    }

    try {
      const result = await modal.result;
      if(result.data){
        if(edit === true ){
          this.survey.questions[preguntaIndex ? preguntaIndex : 0].question = result.data.question 
          this.survey.questions[preguntaIndex ? preguntaIndex : 0].description = result.data.description   
          this.survey.questions[preguntaIndex ? preguntaIndex : 0].referentMedico = result.data.referentMedico   

        }else {
          this.survey.questions.push({
            question: result.data.question,      
            description:  result.data.description,
            referentMedico: result.referentMedico
          })
        }
                
      }
    } catch (error) {}
  }
 
  async addAnswerModal(preguntaIndex:number,isForDoctor:boolean,answer?:AnswerI){
    const modal = this.ngbModal.open(AddAnswerComponent,{centered:true});

    modal.componentInstance.surveyId = this.survey._id
    modal.componentInstance.isForDoctor = isForDoctor

    if(answer){
      modal.componentInstance.answer = answer
    }

    try {
      const result = await modal.result;
      if(result.data){
        this.survey.questions[preguntaIndex].answer = {...result.data} 
      }
    } catch (error) {}
  }

  deleteQuestion(index: number): void {
    const removed:QuestionI = this.survey.questions.splice(index, 1)[0]; // quita el elemento del arreglo
    if (removed && removed._id) {
      if(this.survey.questionsDelete && this.survey.questionsDelete.length > 0 && removed._id){
        this.survey.questionsDelete?.push(removed);
      }else {
        this.survey.questionsDelete = [removed];
      }
    }
  }


  getSurvey(){
    this.loading = true;
    this.surveysService.getSurvey().pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.survey = res.survey ;

      })
    })
  }

  async saveSurvey(){

    let validSurvay:boolean =   true

    this.survey.questions.forEach(question => {
      if(!question.answer){
        validSurvay = false
      } else {
        question.answer.options?.forEach(option => {
            if (!option._id) {
              delete option._id;
            }
        })
      }
    })

   if(!validSurvay){
      this.alertsService.toastMixin('Todas la preguntas deben contener configurada su respuesta','warning')
      return
   }

    await this.ngxSpinnerService.show('generalSpinner');

    this.surveysService.saveSurvey(this.survey).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.survey = res.survey
        this.alertsService.toastMixin(res.message,'success');
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      }
    })
  }

}
