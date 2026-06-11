import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styles: [
  ]
})
export class ConfirmEmailComponent implements OnInit {

  urlTree:any;
  token:any;
  successConfirm!:Boolean;
  loading:Boolean = true;
  message:String='';
  constructor(
    private router:Router,
    private authService:AuthService,
    private ngxSpinnerService: NgxSpinnerService
  ) {

  }

  ngOnInit(): void {
    this.urlTree = this.router.parseUrl(this.router.url);
    this.token = this.urlTree.queryParams['token'];
    this.sendCodeToAPI();
  }

  async sendCodeToAPI(){
    this.loading=true;
    await this.ngxSpinnerService.show('generalSpinner');
    this.authService.confirmEmail(this.token).pipe(
      finalize(async ()=>{
        this.ngxSpinnerService.hide('generalSpinner')
      })
    ).subscribe({
      next:(res:any)=>{
        this.loading=false;
        this.successConfirm = res.ok;


      },error:(e:any)=>{
        this.loading=false;
        this.successConfirm = e.error.ok;
        this.message = e.error.message;

      }
    })
  }

}
