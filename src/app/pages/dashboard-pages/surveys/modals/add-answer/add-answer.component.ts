import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnswerI } from 'src/app/interfaces/survey.interface';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.scss']
})
export class AddAnswerComponent implements OnInit {

  @Input() surveyId!: string;
  @Input() answer!: AnswerI;
  @Input() isForDoctor: boolean = false;


  formSubmited:boolean = false

  form!: FormGroup;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService
  ) { }

  ngOnInit(): void {
    this.createForm();

    if(this.answer){
     this.form.patchValue(this.answer)

     if(this.answer.options && this.answer.options.length > 0){
        this.answer.options.forEach(optionsAnswer => this.addOptions(optionsAnswer.option,optionsAnswer.points,optionsAnswer._id))
     }

    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      type:[null,[Validators.required]],
      required:[true,[]],
      options: this.formBuilder.array([]),
    })
  }

  //PARA ARRAY DE OPCIONES DEL SELECTOR
  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  addOptions(option?: string,points?:number,_id?: string ) {
    const group = this.formBuilder.group({
      option: [option, [Validators.required]], 
      points: [points, [Validators.required]], 
      select: [false],
      _id: [_id]
    });

    if (!this.isForDoctor) {
      group.get('points')?.disable();
    }

    this.options.push(group);
  }

  removeOptions(index: number) {
    const removed = this.options.at(index).value
    this.options.removeAt(index);
    
    if (removed && removed._id) {
      if(this.answer.optionsDelete && this.answer.optionsDelete.length > 0 ){
        this.answer.optionsDelete?.push(removed);
      }else {
        this.answer.optionsDelete = []
        this.answer.optionsDelete?.push(removed);
      }
    }
  }

  getControl(name:string){
    return this.form.get(name)
  }

  selectTypeComponent(){
    if(this.getControl('type')?.value == 'Entrada de texto'){
      this.form.setControl('options', this.formBuilder.array([]));    }

    if(this.getControl('type')?.value == 'Selección') {
      this.addOptions();
    }
  }
  
  saveAnswer(): void {
    this.formSubmited = true
    if(!this.form.valid){
      this.alertService.toastMixin('Ingrese todos los datos','warning',3000);
      return
    }

    if(this.form.valid && this.formSubmited){
      let data = {...this.form.value}
      if(this.answer && this.answer.optionsDelete && this.answer.optionsDelete.length > 0) {data.optionsDelete = this.answer.optionsDelete}
      this.ngbActiveModal.close({data: data})
    }
  }

}
