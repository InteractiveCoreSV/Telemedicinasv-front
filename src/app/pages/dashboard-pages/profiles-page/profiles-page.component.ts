import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-profiles-page',
  templateUrl: './profiles-page.component.html',
  styles: [
  ]
})
export class ProfilesPageComponent implements OnInit,OnDestroy {

  userInfo!:UserI ;
  subs:Subscription = new Subscription()

  constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private authService:AuthService,  
  ) { }

  ngOnInit(): void {

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI | null)=>{
        if(userInfo){
          this.userInfo = userInfo;
        }
        this.changeDetectorRef.detectChanges();
      })
    )
  }

    ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
