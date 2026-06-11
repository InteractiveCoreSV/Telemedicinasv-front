import { AppointmentI } from "./appointment.interface";
import { FileAWSI } from "./files.interface";
import { UserI } from "./user.interface";

export interface SurveyI {
  _id: string;
  title:string,
  subtitle:string,
  banner: FileAWSI,
  questions: QuestionI[],
  questionsDelete?: QuestionI[]
  titleAgradecimiento:string,
  subtitleAgradecimiento:string,
}

export interface QuestionI {
  _id?:string
  question: string,
  referentMedico:boolean,
  description?: string,
  answer?: AnswerI
}

export interface AnswerI {
  type:string
  options?: OptionAnswerI[],
  enterText: string,
  required:boolean,
  optionsDelete?: OptionAnswerI[]
}

export interface OptionAnswerI {
  _id?:string
  option: string,
  points:number,
  select: boolean
}


export interface AnswerSurveysI {
  _id: string;
  encuesta: SurveyI,
  appointment?: AppointmentI,
  user: UserI,
  response: QuestionI[],
  statusComplete:boolean,
  surveyNumber:number
}
