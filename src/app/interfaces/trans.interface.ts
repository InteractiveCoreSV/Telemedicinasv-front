import { AppointmentI } from "./appointment.interface";
import { UserI } from "./user.interface";
// import { OrderI } from "./order.interface";

export interface TransactionsI{
  _id:string;
  patient: UserI;
  data: DataTransI;
  cliente_Trans_Referencia: string;
  appointmentID?:AppointmentI,
  createdAt:string;
}

export interface DataTransI{
  TotalAmount:string;
  RRN:string
}