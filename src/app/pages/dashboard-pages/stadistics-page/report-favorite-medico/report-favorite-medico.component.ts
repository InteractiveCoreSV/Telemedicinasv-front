import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilsService } from 'src/app/services/utils.service';

declare const $: any; // declare jQuery

@Component({
  selector: 'app-report-favorite-medico',
  templateUrl: './report-favorite-medico.component.html',
  styleUrls: ['./report-favorite-medico.component.scss']
})
export class ReportFavoriteMedicoComponent implements OnInit,AfterViewInit,OnChanges {
  @ViewChild('datePickerFavorite') datePickerRef!: ElementRef;

  loading:boolean = false

  results:any[] = []

  @Input() filters: any = {};
  @Input() rangeDates: any = {};

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  typingTimer: any

  sortedData: any[] = [];
  sortDirection: { [key: string]: boolean } = {
    totalFavorites: true,
    names: false,
  };

  constructor(
    private analyticsService: AnalyticsService,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
    }

    this.startDate = null
    this.endDate = null
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDates'] ) {
      if (changes['rangeDates'].currentValue.from) {
        this.filters.rangeDates = this.rangeDates
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

  getForSearch(){
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Iniciar un nuevo temporizador
    this.typingTimer = setTimeout(() => {
      this.getData();
    }, 500);
  }

  getData() {
    this.loading = true
    this.analyticsService.getReportFavoriteMedico(this.filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: ((res: any) => {
        this.results = res.data
      })
    })
  }

  sortTable(column: string): void {
    const isAscending = this.sortDirection[column];
    this.filters.sortBy = column;
    this.filters.isAscending = isAscending;
    this,this.getData()
    this.sortDirection[column] = !isAscending;
  }

  exportToExcel(){     
    const dataExport:any = []

    this.results.forEach((r:any, ) => {
        dataExport.push({
          medicoName: `${r.names} ${r.last_names}`,
          totalFavorites: r.totalFavorites,
        })
    })

    const columnWidths = [{ wch: 40 }, { wch: 30 }];
    const forHeader = ['Medico','Veces registrado como favorito']
    
    const title = `Médicos Favoritos`

    this.utilsService.exportAsExcel(dataExport, 'R - Médicos Favoritos',forHeader,columnWidths,title );
  }

  formateDate(date:any){
    let formattedDate:any = this.datePipe.transform(date, 'EEEE d MMMM y');
    return formattedDate
  }
}
