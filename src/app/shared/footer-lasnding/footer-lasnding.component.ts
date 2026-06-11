import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer-lasnding',
  templateUrl: './footer-lasnding.component.html',
  styleUrls: ['./footer-lasnding.component.scss']
})
export class FooterLasndingComponent implements OnInit{
  currentYear:number = new Date().getFullYear();
  redirectCreateRecruiter:any
  redirectCreateRecruiterRegister!:string

  portalUrl:string = environment.portalUrl


  constructor(

  ) { }

  ngOnInit(): void {
    this.redirectCreateRecruiter =  `${this.portalUrl}/dashboard`
    this.redirectCreateRecruiterRegister = `${this.portalUrl}/auth/register`
    
  }
}
