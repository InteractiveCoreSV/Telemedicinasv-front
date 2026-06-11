import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViewDetailAnsweredSurveyComponent } from '../../surveys/modals/view-detail-answered-survey/view-detail-answered-survey.component';
import { ViewAnswersSurveyComponent } from 'src/app/components/modals/view-answers-survey/view-answers-survey.component';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-report-for-survey',
  templateUrl: './report-for-survey.component.html',
  styleUrls: ['./report-for-survey.component.scss']
})
export class ReportForSurveyComponent implements OnInit,AfterViewInit,OnChanges {
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  
  loading:boolean = false

  results:any = []

  @Input() filters: any = {};
  @Input() rangeDates: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
      // rangeDates: this.getCurrentDayDateRange(),
    }

    this.startDate = null
    this.endDate = null

    // this.getData();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates;
        this.getData();
      }else {
        this.searchWithoutDates()
      }
      
    }
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

  async viewDetail(question:any){
    const modal = this.ngbModal.open(ViewAnswersSurveyComponent,{centered:true, size:'lg'});
    modal.componentInstance.question = question;
  }

  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getData();
  }

  searchWithoutDates(){
    this.startDate = null;
    this.endDate = null;
    this.changeDetectorRef.detectChanges()

    this.filters = {
      ...this.filters,
      rangeDates: {from:null,to:null}
    }
    
    this.btnCancelSearchByDates=false
    
    this.getData()
  }

  getCurrentDayDateRange(): { from: Date; to: Date } {
    const today = new Date();

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    return {
      from: startOfDay,
      to: endOfDay
    };
  }

  getData() {
    this.loading = true
    this.analyticsService.getSurveys(this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.results = [...res.surveys[0].selectionQuestions, ...res.surveys[0].textQuestions]
      })
    })
  }
  
}
