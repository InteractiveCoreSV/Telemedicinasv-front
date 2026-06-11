import { Directive, AfterViewInit, Input, ElementRef, ContentChild, SimpleChanges, OnChanges } from '@angular/core';

declare const $: any;
import * as moment from 'moment';


@Directive({
  selector: '[daterangepicker]'
})
export class DaterangepickerDirective implements AfterViewInit, OnChanges {

  @Input() daterangepicker: 'predefined' | 'times' | 'normal' = 'predefined';
  @Input() rangeDate: any;
  @Input() rangesSelect: any;
  @Input() allTime: boolean = false;

  @ContentChild('predefinedPreview') predefinedPreview!: ElementRef;
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    moment.locale('es')
    switch (this.daterangepicker) {
      case 'predefined': {
        this.predefinedDates();
        break;
      }
      case 'normal': {
        var start = moment();
        var end = moment();
        $(this.elementRef.nativeElement).daterangepicker({
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             'All Time': [null, null]
          }
        });
        break;
      }
      case 'times':{
        $(this.elementRef.nativeElement).daterangepicker({
          timePicker: true,
          startDate: moment().startOf('hour'),
          endDate: moment().startOf('hour').add(32, 'hour'),
          locale: {
            format: 'M/DD hh:mm A'
          }
        });
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rangeDate'] && changes['rangeDate'].currentValue && this.predefinedPreview) {
          var start = this.rangeDate ? moment(this.rangeDate.from != 'Invalid date' ? this.rangeDate.from : null).startOf('month') : moment().startOf('month');
          var end =  this.rangeDate ? moment(this.rangeDate.to != 'Invalid date' ? this.rangeDate.to : null).endOf('month') : moment().endOf('month');

          if(this.rangesSelect && this.rangesSelect === 'day'){
            start = this.rangeDate ? moment(this.rangeDate.from != 'Invalid date' ? this.rangeDate.from : null).startOf('day') : moment().startOf('day');
            end =  this.rangeDate ? moment(this.rangeDate.to != 'Invalid date' ? this.rangeDate.to : null).endOf('day') : moment().endOf('day');
          }

        const predefinedPreview = this.predefinedPreview.nativeElement;
        $(predefinedPreview).html((start && start.isValid() ? start.format('MMM D') : 'Fecha') + ' - ' + (end && end.isValid() ?  end.format('MMM D, YYYY') : 'Fecha'));

    }
  }

  predefinedDates(){
    var start = this.rangeDate ? moment(this.rangeDate.from).startOf('month') : this.allTime === true ? null : moment().startOf('month');
    var end =  this.rangeDate ? moment(this.rangeDate.to).endOf('month') : this.allTime === true ? null : moment().endOf('month');

    if(this.rangesSelect && this.rangesSelect === 'day'){
      start = this.rangeDate ? moment(this.rangeDate.from).startOf('day') : this.allTime === true ? null : moment().startOf('day');
      end =  this.rangeDate ? moment(this.rangeDate.to).endOf('day') : this.allTime === true ? null : moment().endOf('day');
    }

   const predefinedPreview = this.predefinedPreview.nativeElement;
   function cb(start: any, end: any) {
     $(predefinedPreview).html((start && start._isValid ? start.format('MMM D') : 'Fecha') + ' - ' + (end && end._isValid ?  end.format('MMM D, YYYY') : 'Fecha'));
  }

   $(this.elementRef.nativeElement).daterangepicker({
     startDate: start,
     endDate: end,
     ranges: this.allTime ? {
      'Hoy': [moment(), moment()],
      'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
      'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
      'Este mes': [moment().startOf('month'), moment().endOf('month')],
      'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'El próximo mes': [ moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
      'Fecha': [null, null],
     } : 
     {
      'Hoy': [moment(), moment()],
      'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
      'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
      'Este mes': [moment().startOf('month'), moment().endOf('month')],
      'El mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'El próximo mes': [ moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
     }
   }, cb);

   cb(start, end);
 }
}
