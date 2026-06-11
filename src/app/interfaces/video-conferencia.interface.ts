import { FileAWSI } from "./files.interface";

export interface VideoConferenciaI{
  _id?: string;
  name: string;
  description?: string;
  img: FileAWSI;
  status:boolean;
}
