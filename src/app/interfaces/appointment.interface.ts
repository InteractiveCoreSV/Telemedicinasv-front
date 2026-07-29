import { FileAWSI } from "./files.interface";
import { Hours2I } from "./hours.interface";
import { InsuranceI } from "./insurance";
import { CategoryServiceI, ServiceI } from "./service.interface";
import { SubsidiaryI } from "./subsidiary.interface";
import { UserI } from './user.interface';
import { VideoConferenciaI } from "./video-conferencia.interface";

export interface AppointmentI{
  _id?:string;
  appointmentNumber:number;

  typeAppoinment:CategoryServiceI,
  meetingTool:VideoConferenciaI,
  link:string,

  referencedAppointment:boolean;
  referencedSubsidiary:SubsidiaryI;

  user?:UserI;
  externalPatient?:ExternalPatientI;
  underAge?:boolean,
  idUnderAge?:string,
  nameUnderAge?:string,
  birthdateUnderAge?:string,
  urgency:string;

  subsidiary:SubsidiaryI;
  patientAddress:string;
  diagnostico?:string;
  service:ServiceI[];
  medico?:UserI,
  externalMedico?:ExternalMedicoI;
  dateAppointment:string;
  dateAppointmentEnd?:string;
  hour?:Hours2I;
  documentAppointment:FileAWSI,
  duiImage?:FileAWSI;
  indicacionMedica?:FileAWSI;
  insuranceType?:'aseguradora' | 'particular';
  commentAppointment:string;
  total:number,

  status:  'Pending' | 'Reserved' | 'Confirmed' | 'Completed' | 'Refuse' | 'InProgress'  | 'pending_payment';
  timeStatusInProgress?:dateHourI;

  typePayment?:'tarjeta' | 'efectivo' | 'cheque' | 'transferencia'
  imgComprobante:FileAWSI,

  insurance?:InsuranceI,
  insuranceName?:string,

  typeCancel?:string;
  motivoCancel?:string;
  commentCancel?:string;
  dateAndHourCancel?:dateHourI;

  extraordinaria:boolean;
  reprogramada:boolean,
  remitida:boolean,

  dateAndHourChangeStatus?:Date;
  userChangeStatus?:any;

  historyStatus: HistoryStatusI[];
  
  createdAt:string;
}

export interface dateHourI {
  fechaActual:string,
  horaMilitar:string,
  hora12Horas:string
}

export interface HistoryStatusI {
  user:any,
  status:string,
  motivoCancel:string,
  dateChange:Date;
}

export interface ExternalPatientI {
  names:string;
  phone:string;
  countryCode:string;
  mask:string;
  typeDocument:'DUI' | 'ID internacional' | 'Pasaporte';
  document:string;
  email?:string;
}

export interface ExternalMedicoI {
  names:string;
  phone:string;
  countryCode:string;
  mask:string;
}