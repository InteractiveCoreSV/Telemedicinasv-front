import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from 'rxjs';
import { FileAWSI } from 'src/app/interfaces/files.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SurveysService } from 'src/app/services/survey.service';


@Component({
  selector: 'app-change-banner',
  templateUrl: './change-banner.component.html',
  styleUrls: ['./change-banner.component.scss']
})
export class ChangeBannerComponent implements OnInit {

  @Input() surveyId!: string;
  @Input() banner!: FileAWSI

  bannerFile!:any;
  bannerTemp!:any;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertsService:AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private surveyService:SurveysService
  ) { }

  ngOnInit(): void {

  }

    async saveBanner(){
      await this.ngxSpinnerService.show('generalSpinner');
      this.surveyService.uploadBanner(this.bannerFile,this.surveyId).pipe(
        finalize(async()=> await this.ngxSpinnerService.hide('generalSpinner'))
      )
        .subscribe({
          next:(res:any)=>{
        
            this.banner = res.banner;
            this.alertsService.toastMixin(res.message,'success',2000);
            this.bannerFile=null;
            this.bannerTemp = null;
    
          },error:(e:any)=>{
            this.alertsService.toastMixin('Ocurrió un error al cambiar el banner','error');
          }
        })
    }
}
