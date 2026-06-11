import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/services/alerts.service';
import { PreviewTextSurveyComponent } from '../preview-text-survey/preview-text-survey.component';
import { FileAWSI } from 'src/app/interfaces/files.interface';

@Component({
  selector: 'app-custom-text-survey',
  templateUrl: './custom-text-survey.component.html',
  styleUrls: ['./custom-text-survey.component.scss']
})
export class CustomTextSurveyComponent implements OnInit {

  @Input() surveyId!: string;
  @Input() title!: string
  @Input() subtitle!: string
  @Input() banner!: FileAWSI;
  

  @Input() textAgradecimiento: boolean = false


  formSubmited:boolean = false

  form!: FormGroup;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      title:[this.title,[Validators.required]],
      subtitle:[this.subtitle,[Validators.required]],
    })
  }

  async openPreviewModal(){
    const modal = this.ngbModal.open(PreviewTextSurveyComponent,{centered:true});

    modal.componentInstance.banner = this.banner
    modal.componentInstance.textAgradecimiento = this.textAgradecimiento

    modal.componentInstance.title = this.form.value.title
    modal.componentInstance.subtitle = this.form.value.subtitle

  }

  saveCampo(): void {
    this.formSubmited = true
    if(!this.form.valid){
      this.alertService.toastMixin('Complete todos los campos','warning',4000);
      return
    }

    if(this.form.valid && this.formSubmited){
      this.ngbActiveModal.close({data: {...this.form.value}})
    }
  }

}
