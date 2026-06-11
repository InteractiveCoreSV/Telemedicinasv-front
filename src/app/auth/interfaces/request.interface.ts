import { UserI } from "./user.interface";

export interface RequestI{
  _id?:string,
  user:UserI,
  requestType:string,
  description:string,
  comments:string,
  references:PhotoRequestI[],
  createdAt:Date,
}
interface PhotoRequestI{
  location:string,
  key:string
}
