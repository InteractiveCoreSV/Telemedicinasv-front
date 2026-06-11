import {  Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nanoid } from 'nanoid';
import { CampoFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-add-section-ficha-medica',
  templateUrl: './add-section-ficha-medica.component.html',
  styleUrls: ['./add-section-ficha-medica.component.scss']
})
export class AddSectionFichaMedicaComponent implements OnInit {

  @Input()newSectionSubmit:boolean = false;
  @Input()newSectionName!:string | null;
  @Input()sectionOnlyWoman:boolean = false

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService
  ) { }

  ngOnInit(): void {
  }

  saveCampo(): void {
    this.newSectionSubmit = true

    if(this.newSectionName && this.newSectionSubmit){
      this.ngbActiveModal.close({section:{newSectionName: this.newSectionName, sectionOnlyWoman:this.sectionOnlyWoman}})
    }
  }

}
