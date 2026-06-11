import { Hours2I } from './hours.interface';
import { SubsidiaryI } from './subsidiary.interface';
export interface InvalidDatesI{
  _id?:string;
  dates:{
    startDate:string;
    endDate:string;
  };
  allDay:boolean;
  hoursMorning:Hours2I[];
  hoursAfternoon:Hours2I[];
  subsidiaries:SubsidiaryI[];
  status:boolean;
}
