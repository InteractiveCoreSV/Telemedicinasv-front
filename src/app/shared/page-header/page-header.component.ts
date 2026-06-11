import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';
import { PageHeaderService } from 'src/app/services/page-header.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, OnDestroy {

  breadcrumbs$!:Observable<any[]>;
  pageTitle$!:Observable<any>;
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  constructor(
    private pageHeaderService: PageHeaderService, 
    public location:Location,
    private authService:AuthService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.breadcrumbs$ = this.pageHeaderService.breadcrumbs$;
    this.pageTitle$ = this.pageHeaderService.titlePage$;

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI | null)=>{
        if(userInfo){
          this.userInfo = userInfo;
         }
      })
    )

    // this.webSocketService.onStatusUpdate().subscribe((data: any) => {
    //   console.log('Estado actualizado desde servidor:', data);
    // });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
