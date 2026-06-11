import { UserI } from "./user.interface";

export interface SectionFichaMedicaI {
  id: string;
  name:string;
  position: number;
  onlyWoman:boolean;
  campos: CampoFichaMedicaI[]
}

export interface CampoFichaMedicaI {
  id: string;
  name:string;
  position: number;
  type:string;
  component:string;
  unidades:string[];
  optionsSelect:string[];
  selectMultiple?:boolean;
  placeholder:string;
  width:number;
  required:boolean;
  value:any;
  notEdit?:string,
  userCampo?:string
}







