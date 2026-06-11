import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-dashboard',
  templateUrl: './footer-dashboard.component.html',
  styleUrls: ['./footer-dashboard.component.scss']
})
export class FooterDashboardComponent {
  currentYear:number = new Date().getFullYear();

}
