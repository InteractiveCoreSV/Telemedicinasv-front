import { UserI } from "../auth/interfaces/user.interface";

export interface HoursI{
  label:string;
  value:number;
  status:boolean;
}

export interface Hours2I{
  _id?:string;
  idTemporal?:string;
  time:'afternoon' | 'morning',
  order:number;
  hours:string;
  day?: string,
  places?:number

  hourStart: HourSelect,
  hourEnd: HourSelect,

  medico?:UserI
  disabled?:boolean,

  new?:boolean
}


export interface HourDisableI{
  _id:string;
  places?:number;
  // fisioterapeuta?: FisioterapeutaI
}


export interface HourSelect{
  hour:number,
  minute:number,
  pm_am:string
}

export interface HorarioI{
  _id:string
  name:string,
  especialHorario:boolean,
  dates:[string];
  status:boolean,
}