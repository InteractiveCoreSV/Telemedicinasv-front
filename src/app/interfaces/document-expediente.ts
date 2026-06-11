import { FileAWSI } from "./files.interface";
import { UserI } from "./user.interface";

export interface ExpedienteI {
  _id?: string;
  name:string;
  comment:string;
  patient: UserI;
  userCreate: UserI;
  document:FileAWSI;
  typeDocument:string;
  category:string;

  createByFichaMedica:boolean,
  medico:string;
  firma:any;
  sello:any;

  createdAt:string;
  updatedAt:string;
}

export interface ExpedienteCRMI {
  email_doctor:string;
  dni_paciente:string;
  fecha_nacimiento:string;
  genero:string;
}

