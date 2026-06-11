import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionI } from 'src/app/interfaces/survey.interface';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent  implements OnInit {

  @Input() surveyId!: string;
  @Input() question!: QuestionI;


  formSubmited:boolean = false

  form!: FormGroup;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService
  ) { }

  ngOnInit(): void {
    this.createForm();

    if(this.question){
      this.getControl('question')?.setValue(this.question.question);
      this.getControl('description')?.setValue(this.question.description);
      this.getControl('referentMedico')?.setValue(this.question.referentMedico);
    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      question:['',[Validators.required]],
      description:[null,[]],
      referentMedico:[false,[]],
    })
  }
  
  getControl(name:string){
    return this.form.get(name)
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
