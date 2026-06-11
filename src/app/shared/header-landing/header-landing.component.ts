import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-landing',
  templateUrl: './header-landing.component.html',
  styleUrls: ['./header-landing.component.scss']
})
export class HeaderLandingComponent implements OnInit {

  redirectCreateRecruiter:any
  redirectCreateRecruiterRegister:any
  portalUrl:string = environment.portalUrl

  selectMenu:string = 'inicio'

  constructor(
    public router: Router,
    private utilsService: UtilsService

  ) { }

  ngOnInit(): void {
    this.redirectCreateRecruiter =  `${this.portalUrl}/dashboard`
    this.redirectCreateRecruiterRegister = `${this.portalUrl}/auth/register`
  }

  onButtonClick(elementId: string): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(()=> {
          this.utilsService.emitScrollEvent(elementId);
        },500)
      });
    } else {
      this.utilsService.emitScrollEvent(elementId);
    }
    
    this.selectMenu = elementId
  }
}
