import { FileAWSI } from "./files.interface";

export interface CategoryServiceI {
  _id?: string;
  name: string;
  description?: string;
  photo: FileAWSI;
  status:boolean;
  online:boolean;
}

export interface SubCategoryServiceI {
  _id?: string;
  name: string;
  description?: string;
  category:CategoryServiceI[];
  status:boolean;
  services?:ServiceI[]
}

export interface ServiceI {
  _id?: string;
  name: string;
  description?: string;
  status:boolean;
  price:number;
  category:CategoryServiceI[];
  subCategory?:SubCategoryServiceI;
}
