import { EspecialidadI } from "./especialidad.interface";
import { FileAWSI } from "./files.interface";
import { SubsidiaryI } from "./subsidiary.interface";

export interface SolicitudMedicoI{
  _id?:string,
  names:string,
  last_names:string,
  status:string,
  phone:string,
  COICode:string,
  countryCode:string,
  mask:string,

  typeDocument: 'DUI' | 'Pasaporte' | 'ID internacional',
  identityNumber: string,
  passport: string,
  idInternacional: string,

  especialidad:EspecialidadI,
  numberColegio?: number,
  clinicaMedica: boolean,
  clinicaName?: string,
  clinicaAddress?: string,
  clinicaPhone?: string,
  createdAt:Date,

  userCreate:boolean
}