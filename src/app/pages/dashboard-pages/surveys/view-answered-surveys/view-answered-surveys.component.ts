import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { finalize } from 'rxjs';
import { ViewDetailAnsweredSurveyComponent } from '../modals/view-detail-answered-survey/view-detail-answered-survey.component';
import { AnswerSurveysI } from 'src/app/interfaces/survey.interface';
import { SurveysService } from 'src/app/services/survey.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-view-answered-surveys',
  templateUrl: './view-answered-surveys.component.html',
  styleUrls: ['./view-answered-surveys.component.scss']
})
export class ViewAnsweredSurveysComponent implements OnInit,AfterViewInit {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  loading:boolean = true;
  answerSurveys:AnswerSurveysI[] = [];

  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  filters:any = {};

  typingTimer: any

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;
  
  constructor(
    private ngbModal: NgbModal,
    private surveysServices: SurveysService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentDayDateRange(),
    }

    this.startDate = this.filters.rangeDates.from
    this.endDate = this.filters.rangeDates.to

    this.getAnsweredSurvey()
  }

  ngAfterViewInit() {
    const datePicker = $(this.datePickerRef.nativeElement);

    datePicker.on('apply.daterangepicker', (ev: any, picker: any) => {
      if (picker?.startDate && picker?.endDate) {
        this.startDate = picker.startDate.format('YYYY-MM-DD');
        this.endDate = picker.endDate.format('YYYY-MM-DD');
        this.changeFilters();
        this.btnCancelSearchByDates = true;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

   changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getAnsweredSurvey();
  }

  searchWithoutDates(){
    this.filters = {
      ...this.filters,
      rangeDates: this.getCurrentDayDateRange(),
    }
    this.btnCancelSearchByDates=false
    
    this.changeDetectorRef.detectChanges()
    this.getAnsweredSurvey()
  }


  getCurrentDayDateRange(): { from: Date; to: Date } {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      from: startOfMonth,
      to: endOfMonth
    };
  }


  getForSearch(){
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getAnsweredSurvey();
    }, 700);
  }

  getAnsweredSurvey(){
    this.loading = true;
    
    this.surveysServices.getAnsweredSurvey(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{

        this.answerSurveys = res.answerSurveys;
        this.paginationDetails = res.paginationDetails;
      })
    })
  }

  viewDetailSurvey(survey:AnswerSurveysI){
    const modal = this.ngbModal.open(ViewDetailAnsweredSurveyComponent,{centered:true,scrollable:true});
    modal.componentInstance.survey = survey;

  }

}
