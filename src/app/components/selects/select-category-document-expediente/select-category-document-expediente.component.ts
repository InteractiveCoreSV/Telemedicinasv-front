import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-category-document-expediente',
  templateUrl: './select-category-document-expediente.component.html',
  styleUrls: ['./select-category-document-expediente.component.scss']
})
export class SelectCategoryDocumentExpedienteComponent implements OnInit {

  @Input() appendTo:string = '';

  categories:string[] = ['Examen','Tratamiento','Estudio','Otro tipo de documento'];


  @Input() categorySelected:any = null;
  @Output() private categorySelectedEv:EventEmitter<string > = new EventEmitter<string >();

  constructor() { }

  ngOnInit(): void {
  }

  selectedcategory(){
    this.categorySelectedEv.emit(this.categorySelected);
  }

  clear(){
    this.categorySelected = '';
  }

}
