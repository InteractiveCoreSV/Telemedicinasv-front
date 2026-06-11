// import { PDFI } from 'src/app/interfaces/user.interface';
import {RoleI} from './role.interface';

export interface UserI{
  _id?:string,
  email:string,
  names:string,
  dateBirthday: Date,
  last_names:string,
  password?:string,
  phone:string,
  roles?:RoleI[],
  status:boolean,
  createdAt:Date,
  imageProfile?:string,
  bannerProfile?:string,
  typeDocument: string,
  identityNumber: string,
  passport: string,
  idInternacional: string,
}


export interface UserExportReportI{
  _id?:string,
  email:string,
  names:string,
  dateBirthday: Date
  last_names:string,
  password?:string,
  phone:string,
  rolePrincipal:string,
  status:string,
  createdAt:Date,
  bannerProfile?:string,
  imageProfile?:string
}

