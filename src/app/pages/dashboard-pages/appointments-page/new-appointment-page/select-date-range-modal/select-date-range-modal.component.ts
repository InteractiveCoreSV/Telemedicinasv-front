import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { InvalidDatesService } from 'src/app/services/invalid-dates.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-select-date-range-modal',
  templateUrl: './select-date-range-modal.component.html',
  styleUrls: ['./select-date-range-modal.component.scss']
})
export class SelectDateRangeModalComponent implements OnInit {

  @Input() minDate:Date = dayjs().startOf('day').toDate();
  @Input() date:Date | null = null;
  @Input() dateEnd:Date | null = null;
  // Si se pasan medico/subsidiary, se grisan en el calendario los días donde ese médico
  // ya tiene otra cita (mismo mecanismo que usaba el modal de reagendar). Sin ellos
  // (ej. al crear una cita nueva) el calendario no aplica ningún filtro.
  @Input() medico:any;
  @Input() subsidiary:any;

  dateSelected:Date[] | null = null;

  loadingCalendar:boolean = true;
  invalidDates:string[] = [];
  startOfMonth:Date = dayjs().startOf('month').toDate();
  monthsValidate:string[] = [];
  openCalendarIn:Date = dayjs().toDate();
  calendar:HTMLElement | null = null;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private invalidDatesService: InvalidDatesService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    if(this.date){
      this.dateSelected = this.dateEnd ? [this.date, this.dateEnd] : [this.date];
    }

    if(this.medico){
      this.getInvalidDatesByMonth();
      setTimeout(() => this.configButtonsCalendar(), 500);
    }else{
      this.loadingCalendar = false;
    }
  }

  onDateSelected(){
    this.date = this.dateSelected?.[0] ?? null;
    this.dateEnd = this.dateSelected?.[1] ?? null;
  }

  aceptar(){
    if(!this.date) return;
    this.ngbActiveModal.close({date:this.date, dateEnd:this.dateEnd});
  }

  filterDates(date:any){
    const formatDate = dayjs(date).format('YYYY-MM-DD');
    if(this.invalidDates.length == 0) return true;
    return !this.invalidDates.includes(formatDate);
  }

  getInvalidDatesByMonth(){
    const monthToValidate = dayjs(this.startOfMonth).format('MM');

    if(!this.monthsValidate.includes(monthToValidate)){
      this.removeListenerClick();
      this.loadingCalendar = true;

      this.invalidDatesService.getAllDatesByMonth(monthToValidate, this.medico, this.subsidiary).subscribe({
        next: ((res:any) => {
          this.monthsValidate.push(monthToValidate);

          res.invalidDates?.forEach((invalidDate:any) => {
            const invalidDates = this.utilsService.generateDates(invalidDate.dates.startDate, invalidDate.dates.endDate);
            this.invalidDates = [...this.invalidDates, ...invalidDates];
          });

          this.openCalendarIn = this.startOfMonth;
          this.loadingCalendar = false;
          setTimeout(() => this.configButtonsCalendar(), 100);
        })
      });
    }
  }

  selectMonth(ev:any){
    this.startOfMonth = dayjs(ev).startOf('month').toDate();
    this.getInvalidDatesByMonth();
  }

  configButtonsCalendar(){
    this.calendar = document.getElementById('calendar-client-range');

    if(this.calendar){
      const prevButtonMonth = this.calendar.querySelector('button[aria-label="Previous month"]') as HTMLButtonElement;
      const nextButtonMonth = this.calendar.querySelector('button[aria-label="Next month"]') as HTMLButtonElement;

      prevButtonMonth?.addEventListener('click', () => {
        this.startOfMonth = dayjs(this.startOfMonth).subtract(1,'month').startOf('month').toDate();
        this.getInvalidDatesByMonth();
      });

      nextButtonMonth?.addEventListener('click', () => {
        this.startOfMonth = dayjs(this.startOfMonth).add(1,'month').startOf('month').toDate();
        this.getInvalidDatesByMonth();
      });
    }
  }

  removeListenerClick(){
    if(this.calendar){
      const prevButtonMonth = this.calendar.querySelector('button[aria-label="Mes anterior"]');
      const nextButtonMonth = this.calendar.querySelector('button[aria-label="Mes siguiente"]');

      if(prevButtonMonth){
        const newButton = prevButtonMonth.cloneNode(true);
        prevButtonMonth.parentNode?.replaceChild(newButton, prevButtonMonth);
      }

      if(nextButtonMonth){
        const newButton = nextButtonMonth.cloneNode(true);
        nextButtonMonth.parentNode?.replaceChild(newButton, nextButtonMonth);
      }
    }
  }

}
