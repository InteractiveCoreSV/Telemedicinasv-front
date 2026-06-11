import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { nanoid } from 'nanoid';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { UserI } from 'src/app/auth/interfaces/user.interface';
import { AddHourComponent } from 'src/app/components/modals/add-hour/add-hour.component';
import { HorarioI, Hours2I } from 'src/app/interfaces/hours.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { HoursService } from 'src/app/services/hours.service';

interface BloqueAgrupado {
  start: string;
  end: string;
  days: DayI[];
}

interface DayI {
  name: string;
  new:boolean,
  idHour?:string | null
}

@Component({
  selector: 'app-new-horario-for-doctor',
  templateUrl: './new-horario-for-doctor.component.html',
  styleUrls: ['./new-horario-for-doctor.component.scss']
})
export class NewHorarioForDoctorComponent implements OnInit {

  daysList:DayI[] = [
    {name:'Monday',new:false},
    {name:'Tuesday',new:false},
    {name:'Wednesday',new:false},
    {name:'Thursday',new:false},
    {name:'Friday',new:false},
    {name:'Saturday',new:false},
    {name:'Sunday',new:false}, 
  ];

  windowsWidth:number=0;

  hours:Hours2I[] = [];
  hoursToEditNew:Hours2I[] = []
  hoursToEditDelete:string[] = []
  deleteForBlock:string[] = []
  idsToDelete:string[] = []

  hoursForView:BloqueAgrupado[] = []
  hoursForViewDelete:BloqueAgrupado[] = []

  @Input() doctor!:UserI

  constructor(
    private formBuilder:FormBuilder,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private horarioService: HoursService,
    private router: Router,
    private changes:ChangeDetectorRef,
    private ngbModal:NgbModal,
    private hoursService:HoursService,
    public ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.windowsWidth = innerWidth;

    this.getHours();

  }

  @HostListener('window:resize')
  onResize(){
    this.windowsWidth = window.innerWidth;
    this.changes.detectChanges();
  }

  getHours(){
    this.hoursService.getHoursByDoctor(this.doctor._id ? this.doctor._id : '').subscribe({
      next:((res:any)=>{
        this.hours = res.hours;
        this.hoursForView = this.getBloquesAgrupadosDesdeHoras()
        this.changes.detectChanges();
      })
    })
  }

getBloquesAgrupadosDesdeHoras(): BloqueAgrupado[] {
  const mapa: { [hours: string]: BloqueAgrupado } = {};

  this.hours.forEach(h => {
    const key = h.hours;
    const [start, end] = h.hours.split(' - ');

    if (!mapa[key]) {
      mapa[key] = { start, end, days: [] };
    }

    if (h.day && !mapa[key].days.some(d => d.name === h.day)) {
      mapa[key].days.push({ name: h.day, new: h.new ?? false,idHour: h._id ? h._id: null});
    }
  });

  return Object.values(mapa).sort((a, b) => {
    return this.convertToMinutes(a.start) - this.convertToMinutes(b.start);
  });
}

// Esta función convierte "8:30AM" o "10:15PM" a minutos totales desde medianoche
convertToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return 0;

  let [_, hStr, mStr, meridian] = match;
  let hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10);

  if (meridian === 'PM' && hour !== 12) hour += 12;
  if (meridian === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
}


toggleDay(bloque: BloqueAgrupado, dia: string, event: any) {
  const isChecked = event.target.checked;

  const existeEnBloque = bloque.days.find(d => d.name === dia);

  // Si el checkbox fue marcado (checked = true)
  if (isChecked) {
    // ¿Estaba previamente en la lista de eliminados?
    const bloqueEliminado = this.hoursForViewDelete.find(hd =>
      hd.days.some(d => d.name === dia && d.idHour && this.idsToDelete.includes(d.idHour))
    );

    if (bloqueEliminado) {
      const diaRestaurar = bloqueEliminado.days.find(d => d.name === dia);

      if (diaRestaurar && diaRestaurar.idHour) {
        // Quitar de listas de eliminación
        this.hoursForViewDelete = this.hoursForViewDelete.filter(hd =>
          !hd.days.some(d => d.idHour === diaRestaurar.idHour)
        );
        this.idsToDelete = this.idsToDelete.filter(id => id !== diaRestaurar.idHour);

        // Restaurar el día al bloque
        bloque.days = [...bloque.days, diaRestaurar].sort((a, b) =>
          this.daysList.findIndex(d => d.name === a.name) - this.daysList.findIndex(d => d.name === b.name)
        );
      }
    } else {
      // No existía antes, simplemente agregar nuevo
      bloque.days = [...bloque.days, { name: dia, new: true }].sort((a, b) =>
        this.daysList.findIndex(d => d.name === a.name) - this.daysList.findIndex(d => d.name === b.name)
      );
    }

    return;
  }

  // Si el checkbox fue desmarcado (checked = false)
  if (existeEnBloque) {
    const forDelete = bloque.days.filter(d => d.name === dia);
    bloque.days = bloque.days.filter(d => d.name !== dia);

    if (forDelete[0]?.idHour && forDelete[0]?.new === false) {
      // Marcar para eliminar
      this.idsToDelete.push(forDelete[0].idHour);

      this.hoursForViewDelete.push({
        ...bloque,
        days: forDelete,
      });
    }
  }
}

  async saveHorarioForDoctor() {
    if (!this.hoursForView || this.hoursForView.length === 0) {
      this.alertsService.toastMixin('Para poder guardar el horario debe ingresar al menos una hora', 'error');
      return;
    }

    const bloquesFinales: Hours2I[] = [];

    this.hoursForView.forEach((bloque, index) => {
      bloque.days.forEach(day => {
        if(day.new === true){
          bloquesFinales.push({
            hourStart: this.toHourObj(bloque.start),
            hourEnd: this.toHourObj(bloque.end),
            hours: `${bloque.start} - ${bloque.end}`,
            day:day.name,
            time: this.definirJornada(bloque.start),
            order: this.definirOrder(bloque.start),
            medico: this.doctor
         });
        }
      });
    });

    const data = {
      hoursNew: bloquesFinales,
      hoursDelete: [...this.idsToDelete,...this.deleteForBlock]
    };

    await this.ngxSpinnerService.show('generalSpinner');

    this.horarioService.saveHorarioForDoctor(data).pipe(
      finalize(async () => await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next: (res: any) => {
        this.alertsService.toastMixin(res['message'], 'success');
        this.ngbActiveModal.close();
      },
      error: (e) => {
        this.alertsService.toastMixin(e['error']['message'], 'error');
      }
    });
  }

  definirJornada(start: string): 'morning' | 'afternoon' {
    const parts = start.toUpperCase().split(/(AM|PM)/);
    const time = parts[0].trim();      // Ej: "05:15"
    const modifier = parts[1];          // "AM" o "PM"
    const hour = parseInt(time.split(':')[0], 10);

    let hour24 = hour;

    if (modifier === 'PM' && hour !== 12) {
      hour24 += 12;
    } else if (modifier === 'AM' && hour === 12) {
      hour24 = 0;
    }

    return hour24 < 12 ? 'morning' : 'afternoon';
  }


      
  definirOrder(start: string): number {
    const parts = start.toUpperCase().split(/(AM|PM)/);
    const time = parts[0].trim();  // Ej: "05:15"
    const modifier = parts[1];      // "AM" o "PM"

    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (modifier === 'PM' && hour !== 12) {
      hour += 12;
    } else if (modifier === 'AM' && hour === 12) {
      hour = 0;
    }

    // Convertimos minutos a decimal para orden correcto
    return hour + minutes / 60;
  }

  toHourObj(timeStr: string): { hour: number; minute: number; pm_am: string } {
    const parts = timeStr.toUpperCase().split(/(AM|PM)/);
    const time = parts[0].trim(); // Ej: "05:15"
    let modifier = parts[1];       // "AM" o "PM"

    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Si no viene AM/PM, asumimos AM
    if (!modifier) {
      modifier = 'AM';
    }

    // Convertir a 24 horas para facilitar el cálculo (opcional)
    let hour24 = hour;
    if (modifier === 'PM' && hour !== 12) {
      hour24 += 12;
    } else if (modifier === 'AM' && hour === 12) {
      hour24 = 0;
    }

    // Convertir de nuevo a 12 horas
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;

    // Determinar AM o PM
    const pm_am = hour24 >= 12 ? 'PM' : 'AM';

    return {
      hour: hour12,
      minute,
      pm_am
    };
  }



  async newHour( hour?:Hours2I){
    const modal = this.ngbModal.open(AddHourComponent,{centered:true});
    modal.componentInstance.title = 'Add'

    if(hour){
      modal.componentInstance.title = 'Edit'
      modal.componentInstance.toEdit = hour
    }

    try {
      const result = await modal.result;
      if(result.hour){
        const hourFind = this.hours.filter(hourFind => 
          hourFind.order == result.hour.order && hourFind.hours == result.hour.hours 
        )

        if(hourFind.length > 0) {
          this.alertsService.toastMixin('Esta hora ya existe','warning',3000)
          return
        }

        const idTemporal = nanoid()

        this.hours = [...this.hours ,{...result.hour, day:null, idTemporal: idTemporal,medico: this.doctor._id,new:true}]
        this.hoursForView = this.getBloquesAgrupadosDesdeHoras()

        this.changes.detectChanges()
      }
    } catch (error) {}
  }

  deleteHour(bloque: BloqueAgrupado,index:number) {
    bloque.days.forEach(d => {
      if(d.idHour){
        this.deleteForBlock.push(d.idHour)
      }
    })

    this.hoursForView.splice(index, 1);
    this.hours = this.hours.filter(h => h._id && !this.deleteForBlock.includes(h._id))

  }
 
 
  
}

