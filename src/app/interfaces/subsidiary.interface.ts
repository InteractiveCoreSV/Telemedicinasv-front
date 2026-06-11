import { CordsI } from "./user.interface";
import { FileAWSI } from './files.interface';
import { HorarioI } from "./hours.interface";

export interface SubsidiaryI {
  _id?: string;
  name: string;
  description?: string;
  address: SubsidiaryAddressI;
  photos: FileAWSI[];
  status:boolean;
  consultorioMedico:boolean;
}

export interface SubsidiaryAddressI {
  department: string;
  municipality: string;
  address: string;
  cords: CordsI;
  aditionalInfo:string
}
