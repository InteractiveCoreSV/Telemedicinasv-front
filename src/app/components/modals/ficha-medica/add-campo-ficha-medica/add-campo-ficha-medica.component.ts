import {  Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { nanoid } from 'nanoid';
import { CampoFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-add-campo-ficha-medica',
  templateUrl: './add-campo-ficha-medica.component.html',
  styleUrls: ['./add-campo-ficha-medica.component.scss']
})
export class AddCampoFichaMedicaComponent implements OnInit {

  @Input() campo!: CampoFichaMedicaI;

  allWidth:boolean | null = null
  formSubmited:boolean = false

  selectMultiple:boolean | null = false

  form!: FormGroup;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService
  ) { }

  ngOnInit(): void {
    this.createForm();

    if(this.campo){
     this.form.patchValue(this.campo)

     this.allWidth = this.campo.width ? false : true

     if(this.campo.optionsSelect.length > 0){
      this.campo.optionsSelect.forEach(option => this.addOptionsSelect(option))
     }


     if(this.campo.unidades.length > 0){
      this.campo.unidades.map(u => this.addUnidad(u))
     }

     this.selectComponent();

     this.selectMultiple = this.campo.selectMultiple ? this.campo.selectMultiple : false

    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      id:[nanoid(),[Validators.required]],
      name:['',[Validators.required]],
      type:[null,[Validators.required]],
      component:[null,[Validators.required]],
      unidades: this.formBuilder.array([]),
      optionsSelect: this.formBuilder.array([]),
      placeholder:['',[Validators.required]],
      width:[''],
      required:[true,[Validators.required]],
    })

    this.form.get('type')?.disable()
  }

  //PARA ARRAY DE OPCIONES DEL SELECTOR
  get optionsSelect(): FormArray {
    return this.form.get('optionsSelect') as FormArray;
  }

  addOptionsSelect(option: string) {
    this.optionsSelect.push(this.formBuilder.control(option, Validators.required));
  }

  removeOptionsSelect(index: number) {
    this.optionsSelect.removeAt(index);
  }

   // PARA ARRAY DE UNIDADES
   get unidades(): FormArray {
    return this.form.get('unidades') as FormArray;
  }

  addUnidad(unidad: string) {
    this.unidades.push(this.formBuilder.control(unidad, Validators.required));
  }

  removeUnidad(index: number) {
    this.unidades.removeAt(index);
  }

  getControl(name:string){
    return this.form.get(name)
  }

  selectComponent(){
    if(this.getControl('component')?.value == 'Entrada de texto'){
      this.form.get('type')?.enable();
      this.form.get('width')?.enable();
      this.optionsSelect.clear();
      this.selectMultiple = null
    }

    if(this.getControl('component')?.value == 'Selector opción multiple') {
      this.form.get('width')?.enable();
      this.form.get('type')?.disable()
      if(!this.campo || (this.campo && this.campo.optionsSelect.length == 0)){
        this.addOptionsSelect('');
      }
      this.selectMultiple = false
    }

    if(this.getControl('component')?.value == 'Bloque de texto') {
      this.form.get('width')?.disable();
      this.form.get('type')?.disable(); 
      this.optionsSelect.clear();
      this.selectMultiple = null
    }
  }

  saveCampo(): void {
    this.formSubmited = true
    if(this.allWidth === null && this.form.value.component != 'Bloque de texto'){
      this.alertService.toastMixin('Seleccione el tipo de ancho del componente a utilizar','warning',4000);
      return
    }

    if(this.form.valid && this.formSubmited){
      this.ngbActiveModal.close({campo: {...this.form.getRawValue(), selectMultiple:this.selectMultiple}})
    }
  }

}
