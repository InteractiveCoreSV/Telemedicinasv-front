import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxRolesService } from 'ngx-permissions';
import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { WebSocketService } from 'src/app/services/web-socket.service';

declare const $:any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {


  perfilPhoto!:string | undefined;
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  constructor(
    public router: Router,
    private authService:AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocketService: WebSocketService,
    private ngxRolesService: NgxRolesService
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI | null)=>{
        if(userInfo){
          this.userInfo = userInfo;
          this.perfilPhoto = this.userInfo?.imageProfile;
          this.changeDetectorRef.detectChanges();

          if(this.ngxRolesService.getRole('medico')){
            this.webSocketService.medicoConnect(userInfo._id, 'medico');
          }

        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  signout(){
    this.authService.logout()
  }

  hideModal(){
    $('#accountNavbarDropdown').modal('hide')
  }

}
