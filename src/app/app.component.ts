import { Component, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private utilsService: UtilsService, 
    private authService:AuthService
  ){}

  ngOnInit(): void {
    this.utilsService.setData();
    this.authService.load();
  }
}