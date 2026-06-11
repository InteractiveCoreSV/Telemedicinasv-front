import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {

  redirectCreateRecruiter:any
  redirectCreateRecruiterRegister!:string

  portalUrl:string = environment.portalUrl

  private subscription!: Subscription;

  constructor(
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
   this.redirectCreateRecruiter =  `${this.portalUrl}/dashboard`
  this.redirectCreateRecruiterRegister = `${this.portalUrl}/auth/register`
    // if (hostname === 'localhost')

    this.subscription = this.utilsService.scrollEvent$.subscribe((elementId) => {
      this.scroll(elementId);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private scroll(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}