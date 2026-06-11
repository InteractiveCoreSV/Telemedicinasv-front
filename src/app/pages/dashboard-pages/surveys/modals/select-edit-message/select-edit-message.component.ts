import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomTextSurveyComponent } from '../custom-text-survey/custom-text-survey.component';
import { SurveyI } from 'src/app/interfaces/survey.interface';

@Component({
  selector: 'app-select-edit-message',
  templateUrl: './select-edit-message.component.html',
  styleUrls: ['./select-edit-message.component.scss']
})
export class SelectEditMessageComponent  implements OnInit{
  @Input() survey!: SurveyI;
  

  constructor(
    private ngbModal: NgbModal,
    public ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  async customMessagePrincipalModal(){
    const modal = this.ngbModal.open(CustomTextSurveyComponent,{centered:true});

    modal.componentInstance.banner = this.survey.banner

    modal.componentInstance.title = this.survey.title
    modal.componentInstance.subtitle = this.survey.subtitle

    try {
      const result = await modal.result;
      if(result.data){
        this.survey.title = result.data.title        
        this.survey.subtitle = result.data.subtitle        
      }
    } catch (error) {}
  }

  async customMessageAgradecimientoModal(){
    const modal = this.ngbModal.open(CustomTextSurveyComponent,{centered:true});

    modal.componentInstance.textAgradecimiento = true
    modal.componentInstance.banner = this.survey.banner
    
    modal.componentInstance.title = this.survey.titleAgradecimiento
    modal.componentInstance.subtitle = this.survey.subtitleAgradecimiento

    try {
      const result = await modal.result;
      if(result.data){
        this.survey.titleAgradecimiento = result.data.title        
        this.survey.subtitleAgradecimiento = result.data.subtitle        
      }
    } catch (error) {}
  }
  
}
