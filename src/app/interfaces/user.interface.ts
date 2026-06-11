import { EspecialidadI } from "./especialidad.interface";
import { FileAWSI } from "./files.interface";
import { SubsidiaryI } from "./subsidiary.interface";

export interface UserI{
  _id?:string,
  email:string,
  userName:string,
  names:string,
  last_names:string,
  password?:string,
  roles?:RoleI[],
  status:boolean,
  addresses?:AddressI[],
  phone:string,
  COICode:string,
  countryCode:string,
  mask:string,
  dateBirthday:any,
  sexo:string,

  cursos:string,
  diplomas:string,

  nameEmergency:string,
  phoneEmergency:string,
  COICodeEmergency:string,
  countryCodeEmergency:string,
  maskEmergency:string,
  
  imageProfile?:string,
  bannerProfile?:string,
  google?:boolean;
  
  typeDocument: 'DUI' | 'Pasaporte' | 'ID internacional',
  identityNumber: string,
  passport: string,
  idInternacional: string,

  age:number,
  address:string,

  subsidiary?:SubsidiaryI
  sello:FileAWSI | null,
  firma:FileAWSI | null,

  numberColegio?: number,
  numberRegistro?: number,
  arancerPerHour?: number,
  clinicaMedica: boolean,
  clinicaName?: string,
  clinicaAddress?: string,
  clinicaPhone?: string,
  especialidad:EspecialidadI,
  especialidadInstitucion: string,
  especialidadYear: Date,
  yearStartedPracticing: Date,
  medicoScore:number
  ratings:number

  educacion:NameDateI[],
  subespecialidades:NameDateI[],


  createdAt:Date,

  statusMedico: string,

  deleted:boolean

  //mujeres
  procedimientos?: string[],
  planificacion?: string[],

  favoriteDoctors?: DavoriteDoctorsI[],
}

export interface RoleI{
  _id:string,
  name:string,
  nameEs:string
}

export interface DavoriteDoctorsI{
  doctorId:string,
  addedAt:Date,
}

export interface NameDateI{
  institucion:string,
  name:string,
  year:Date
}


export interface MenorEdadI{
  _id:string,
  name:string,
  birthdate:string,
  sexo:string,
}

export interface AddressI{
  first_name:string,
  last_name:string,
  company?:string,
  department:string,
  municipality?:string,
  address:string
  aditionalInfo?:string,
  primary:boolean,
  cords:CordsI;
}

export interface CordsI{
  lat:number;
  lng:number;
}

export interface PDFI{
  nombre:string;
  archivo:any;
}

