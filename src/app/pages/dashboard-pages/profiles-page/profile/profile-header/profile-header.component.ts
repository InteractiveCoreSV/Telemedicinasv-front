import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { UploadIMGService } from 'src/app/services/upload-img.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  perfilPhoto!:string | undefined;
  userInfo!:UserI | null;
  subs:Subscription = new Subscription()

  bannerTemp!:any;
  imgTemp!:any;

  bannerFile!:any;
  imgFile!:any;
  bannerProfile!:string | undefined;

  constructor(    
    private authService:AuthService,    
    private changeDetectorRef: ChangeDetectorRef,
    private ngxSpinnerService: NgxSpinnerService,
    private uploadIMGService:UploadIMGService,
    private alertsService: AlertsService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:UserI | null)=>{
        this.userInfo = userInfo;
        this.bannerProfile = this.userInfo?.bannerProfile;
        this.perfilPhoto = this.userInfo?.imageProfile;
        this.changeDetectorRef.detectChanges();
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  async saveBanner(){
    await this.ngxSpinnerService.show('generalSpinner');
    this.uploadIMGService.uploadBannerProfile(this.bannerFile).pipe(
      tap((res:any)=>{
        localStorage.setItem('x-access-token', res['token']);
      }),
      finalize(async()=> await this.ngxSpinnerService.hide('generalSpinner'))
    )
      .subscribe({
        next:(res:any)=>{
          this.authService.setRoles(res.token);
          this.bannerProfile = res.urlBannerProfile;
          this.alertsService.toastMixin(res.message,'success',2000);
          this.bannerFile=null;
          this.bannerTemp = null;

          // this.authService.userInfo.next(res.userUpdate)

        },error:(e:any)=>{
          this.alertsService.toastMixin('Ocurrió un error al cambiar el banner','error');
        }
      })
  }

  async savePhoto(){
    await this.ngxSpinnerService.show('generalSpinner');
    this.uploadIMGService.uploadPhoto(this.imgFile).pipe(
      tap((res:any)=>{
        localStorage.setItem('x-access-token', res['token']);
      }),
      finalize(async()=> await this.ngxSpinnerService.hide('generalSpinner'))
    )
      .subscribe({
        next:(res:any)=>{
          this.authService.setRoles(res['token']);
          this.perfilPhoto = res.imageProfile;
          this.imgFile = null;
          this.imgTemp = null;
          this.alertsService.toastMixin(res.message,'success',2000);

        },error:(e:any)=>{
          this.alertsService.toastMixin('Ocurrió un error al cambiar la imagen','error');
        }
      })
}




}
