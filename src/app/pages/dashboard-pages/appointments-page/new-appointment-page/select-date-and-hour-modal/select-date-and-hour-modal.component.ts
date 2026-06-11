import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

import { HorarioI, Hours2I, HoursI } from 'src/app/interfaces/hours.interface';
import { Subscription, finalize } from 'rxjs';
import { HoursService } from 'src/app/services/hours.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvalidDatesService } from 'src/app/services/invalid-dates.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';

@Component({
  selector: 'app-select-date-and-hour-modal',
  templateUrl: './select-date-and-hour-modal.component.html',
  styleUrls: ['./select-date-and-hour-modal.component.scss']
})
export class SelectDateAndHourModalComponent implements OnInit,OnDestroy {

  loadingCalendar: boolean = true;

  currentDate:Date = dayjs().startOf('day').toDate();
  maxDate:Date = dayjs().add(3,'month').endOf('month').toDate();

  formDate!:FormGroup;

  hoursMorningMonday: Hours2I[] = [];
  hoursAfternoonMonday: Hours2I[] = [];

  hoursMorningTuesday: Hours2I[] = [];
  hoursAfternoonTuesday: Hours2I[] = [];

  hoursMorningWednesday: Hours2I[] = [];
  hoursAfternoonWednesday: Hours2I[] = [];

  hoursMorninThursday: Hours2I[] = [];
  hoursAfternoonThursday: Hours2I[] = [];

  hoursMorningFriday: Hours2I[] = [];
  hoursAfternoonFriday: Hours2I[] = [];

  hoursMorningSaturday: Hours2I[] = [];
  hoursAfternoonSaturday: Hours2I[] = [];

  hoursMorningSunday: Hours2I[] = [];
  hoursAfternoonSunday: Hours2I[] = [];

  invalidDates:string[] = [];

  formSubmited: boolean = false;

  dateSelected:any = '';

  daySelected: string = '';
  showHours: boolean = false;

  startOfMonth: Date = dayjs().startOf('month').toDate();
  endOfMonth: Date = dayjs().endOf('month').toDate();
  monthsValidate: string[] = [];

  openCalendarIn: Date = dayjs().toDate();

  subs:Subscription = new Subscription();

  calendar:HTMLElement | null = null;

  invalidHours:string[] = [];
  invalidHoursAdmin:string[] = [];
  invalidHoursAppointment:string[] = [];
  loadingHours:boolean = false;

  private unavailableCache = new Map<string, {invalidHours:string[], invalidHoursAdmin:string[], invalidHoursAppointment:string[]}>();

  @Input() dateSelectedForm:any = '';
  @Input() medico:any;
  @Input() subsidiary:any;
  @Input() userID:any;

  horariosEspeciales: HorarioI[] = []

  constructor(
    private formBuilder: FormBuilder,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private hoursService: HoursService,
    private alertsService: AlertsService,
    public ngbActiveModal: NgbActiveModal,
    private invalidDatesService: InvalidDatesService,
    private utilsService: UtilsService,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.getHours()

    this.resetAll();

    this.getInvalidDatesByMonth();

    setTimeout(() => {
      this.configButtonsCalendar();
    }, 500)

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getControl(name:string){
    return this.formDate.get(name)
  }

  createForm(){
    this.formDate = this.formBuilder.group({
      date:['',[Validators.required]],
      hour:['',[Validators.required]],
      // extraordinaria:[false,[Validators.required]]
    });

    Object.assign(this.newAppointmentFormsService.forms,{formDate:this.formDate})
  }


  setDateSelected(){
    this.formDate.get('date')?.setValue(this.dateSelected);
    dayjs.locale('en');
    this.daySelected = dayjs(this.dateSelected).format('dddd');
    
    this.getHoursUnavailable();
  }

  setDateAndHour(){
    this.formSubmited = true;
    if(this.formDate.valid){
      // validar fecha nueva con la selecionada en el servicio anterior
      
      this.dateSelectedForm = this.formDate.value
      this.dateSelectedForm.dayAppointment = this.daySelected

      this.ngbActiveModal.close({date:this.dateSelectedForm});
    }
  }


  configButtonsCalendar() {
    // ! Ya que la libreria no ofrece un evento que nos permita saber cuando cambia de mes, se accede de manera manual a los botones
    this.calendar = document.getElementById('calendar-client');

    if (this.calendar) {
      const prevButtonMonth = this.calendar.querySelector('button[aria-label="Previous month"]') as HTMLButtonElement;
      const nextButtonMonth = this.calendar.querySelector('button[aria-label="Next month"]') as HTMLButtonElement;

      prevButtonMonth.addEventListener('click', () => {
        this.startOfMonth = dayjs(this.startOfMonth).subtract(1, 'month').startOf('month').toDate();
        this.endOfMonth = dayjs(this.endOfMonth).subtract(1, 'month').endOf('month').toDate();
        this.dateSelected = '';
        this.showHours = false;
        this.getControl('hour')?.setValue('')
        this.getInvalidDatesByMonth();
      });

      nextButtonMonth.addEventListener('click', () => {
        this.startOfMonth = dayjs(this.startOfMonth).add(1, 'month').startOf('month').toDate();
        this.endOfMonth = dayjs(this.endOfMonth).add(1, 'month').endOf('month').toDate();
        this.dateSelected = '';
        this.showHours = false;
        this.getControl('hour')?.setValue('')
        this.getInvalidDatesByMonth();
      });
    }
  }

  filterDates(date:any){
    const formatDate = dayjs(date).format('YYYY-MM-DD');

    if (this.invalidDates.length == 0) {
      return true;
    }
    return !this.invalidDates?.includes(formatDate)
  }

  getInvalidDatesByMonth() {
    const monthToValidate = dayjs(this.startOfMonth).format('MM');

    if (!this.monthsValidate.includes(monthToValidate)) {
      this.removeListenerClick();
      this.loadingCalendar = true;

      this.invalidDatesService.getAllDatesByMonth(monthToValidate, this.medico, this.subsidiary).subscribe({
        next: ((res: any) => {
    
          this.monthsValidate.push(monthToValidate);

          res.invalidDates?.forEach((invalidDate: any) => {
            const invalidDates = this.utilsService.generateDates(invalidDate.dates.startDate, invalidDate.dates.endDate);
            this.invalidDates = [...this.invalidDates, ...invalidDates];
          });

          // !Idicamos en que fecha queremos que el calendario se inicie antes de mostrarlo nuevamente con ngif
          this.openCalendarIn = this.startOfMonth;

          this.loadingCalendar = false;
          setTimeout(()=>{
            this.configButtonsCalendar();
          },100)
        })
      })
    }
  }

  getHours() {

    this.hoursService.getHoursByMedicoSplited(this.medico).subscribe({
      next: ((res: any) => {
        // --------------------------------------------
        this.hoursMorningMonday = res.hoursMorningMonday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonMonday = res.hoursAfternoonMonday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorningTuesday = res.hoursMorningTuesday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonTuesday = res.hoursAfternoonTuesday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorningWednesday = res.hoursMorningWednesday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonWednesday = res.hoursAfternoonWednesday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorninThursday = res.hoursMorninThursday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonThursday = res.hoursAfternoonThursday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorningFriday = res.hoursMorningFriday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonFriday = res.hoursAfternoonFriday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorningSaturday = res.hoursMorningSaturday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonSaturday = res.hoursAfternoonSaturday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

        // --------------------------------------------
        this.hoursMorningSunday = res.hoursMorningSunday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });

        this.hoursAfternoonSunday = res.hoursAfternoonSunday.sort((a: any, b: any) => {
          const startTimeA = a.hours?.split(' - ')[0]?.replace(/\s/g, '');
          const startTimeB = b.hours?.split(' - ')[0]?.replace(/\s/g, ''); 

          const timeA = dayjs(startTimeA, 'h:mmA');
          const timeB = dayjs(startTimeB, 'h:mmA');

          return timeA.diff(timeB);
        });
        // --------------------------------------------

      })
    })
  }

  getHoursUnavailable(){
    this.showHours = false;
    this.loadingHours = true;
    this.getControl('hour')?.setValue('');

    const cacheKey = dayjs(this.dateSelected).format('YYYY-MM-DD');
    const cached = this.unavailableCache.get(cacheKey);

    if (cached) {
      this.invalidHours = cached.invalidHours;
      this.invalidHoursAdmin = cached.invalidHoursAdmin;
      this.invalidHoursAppointment = cached.invalidHoursAppointment;
      this.showHours = true;
      this.loadingHours = false;
      this.change.detectChanges();
      return;
    }

    this.hoursService.getHoursUnavailable(this.dateSelected,this.medico, this.formDate.value.extraordinaria, this.userID).subscribe({
      next:((res:any)=>{
        const result = {
          invalidHours: res.invalidHours,
          invalidHoursAdmin: res.invalidHoursAdmin,
          invalidHoursAppointment: [...(res.invalidHoursAppointment || []), ...(res.hoursInvaliIdsUser || [])]
        };
        this.unavailableCache.set(cacheKey, result);
        this.invalidHours = result.invalidHours;
        this.invalidHoursAdmin = result.invalidHoursAdmin;
        this.invalidHoursAppointment = result.invalidHoursAppointment;
        this.showHours = true;
        this.loadingHours = false;
        this.change.detectChanges();
      }),
      error:((e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
        this.loadingHours = false;
      })
    })
  }

  resetAll() {
    this.currentDate = dayjs().startOf('day').toDate();
    this.dateSelected = '';

    this.daySelected = '';
    this.showHours = false;

    this.monthsValidate = [];
    this.invalidDates = [];
    this.unavailableCache.clear();
    this.openCalendarIn = dayjs().toDate();
    this.getControl('hour')?.setValue('');
  }

  selectMonth(ev: any) {
    this.startOfMonth = dayjs(ev).startOf('month').toDate();
    this.endOfMonth = dayjs(ev).endOf('month').toDate();
    this.getInvalidDatesByMonth();
  }

  removeListenerClick() {
    if (this.calendar) {
      const prevButtonMonth = this.calendar.querySelector('button[aria-label="Mes anterior"]');
      const nextButtonMonth = this.calendar.querySelector('button[aria-label="Mes siguiente"]');
  
      if (prevButtonMonth) {
        const newButton = prevButtonMonth.cloneNode(true);
        prevButtonMonth.parentNode?.replaceChild(newButton, prevButtonMonth);
      }
  
      if (nextButtonMonth) {
        const newButton = nextButtonMonth.cloneNode(true);
        nextButtonMonth.parentNode?.replaceChild(newButton, nextButtonMonth);
      }
    }
  }
  



}
