import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadsDataService {

  reloadServices:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  reloadSubsidiaries:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  reloadCategoriesServices:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}
