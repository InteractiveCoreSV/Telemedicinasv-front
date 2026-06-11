import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-department2',
  templateUrl: './select-department2.component.html',
  styleUrls: ['./select-department2.component.css']
})
export class SelectDepartment2Component implements OnInit {

  @ViewChild('selectDepartment') selectDepartmentRef!:NgSelectComponent;

  @Input() placeholder: string = 'Departamento';

  @Input() appendTo:string = 'body';

  @Input() departmentSelected: string = '';

  departments: any[] = [
    { name: "Ahuachapán" },
    { name: "Santa Ana" },
    { name: "Sonsonate" },
    { name: "Chalatenango" },
    { name: "La Libertad" },
    { name: "San Salvador" },
    { name: "Cuscatlán" },
    { name: "La Paz" },
    { name: "Cabañas" },
    { name: "San Vicente" },
    { name: "Usulután" },
    { name: "San Miguel" },
    { name: "Morazán" },
    { name: "La Unión" }
  ];
  

  @Output() changeDepartment:EventEmitter<string> = new EventEmitter<string>();
  @Output() changeDepartmentObject:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

  }

  selectedDepartment(){
    const departmentObject = this.departments.find(v=>v.name==this.departmentSelected);
    this.changeDepartmentObject.emit(departmentObject);
    this.changeDepartment.emit(this.departmentSelected);
  }
}
