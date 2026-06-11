import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserI } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/user.service';
import { ViewDetailMedicoProfileComponent } from 'src/app/components/modals/view-detail-medico-profile/view-detail-medico-profile.component';

@Component({
  selector: 'app-select-medico-modal',
  templateUrl: './select-medico-modal.component.html',
  styleUrls: ['./select-medico-modal.component.scss']
})
export class SelectMedicoModalComponent implements OnInit {

  formSubmited:boolean = false;

  medicoForm!:FormGroup;

  loading:boolean = true;
  medicoSelect: UserI | null = null
  medicos:UserI[] = [];
  medicoFilters:UserI[] = []

  inputFilter = new FormControl('');
  especialidad!:string | null

  @Input() subsidiary!:string
  @Input() medicoSelected: UserI | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private change: ChangeDetectorRef,
    private medicoService: UsersService,
    public ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.getmedicos();
  
    this.inputFilter.valueChanges.subscribe(value => {
      this.filtrarDatos(value);
    });
  }

  getControl(name:string){
    return this.medicoForm.get(name);
  }

  createForm(){
    this.medicoForm = this.formBuilder.group({
      medico:[null,[Validators.required]],
    });

    if(this.medicoSelected){
      this.medicoSelect = this.medicoSelected;
      this.setValue('medico', this.medicoSelected);
    }

  }

  openModalDetailMedico(doctor?: UserI){
    const modal = this.ngbModal.open(ViewDetailMedicoProfileComponent,{centered:true,size:'md',scrollable:true, backdrop:'static'});

    modal.componentInstance.doctor = doctor;
    modal.componentInstance.botonAgenda = false;

  }

  getmedicos(){
    this.loading = true;
    this.medicoService.getMedicosForNewAppointment(this.subsidiary,this.especialidad).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.medicos = res.medicos;
        this.syncSelectedMedico();
      })
    })
  }

  syncSelectedMedico(){
    if(!this.medicoSelected?._id){
      return;
    }

    const selected = this.medicos.find((medico)=>medico._id === this.medicoSelected?._id);
    if(selected){
      this.medicoSelect = selected;
      this.setValue('medico', selected);
      this.change.detectChanges();
    }
  }


  filtrarDatos(value: any) {
    this.medicoFilters = []

    this.medicos.map(medico =>{
      const nameUser = `${medico.names} ${medico.last_names}`
      if(nameUser.toLowerCase().includes(value.toLowerCase())){
        this.medicoFilters.push(medico)
      }
    });

  }

  setmedico(){
    this.formSubmited = true;
    if(this.medicoForm.valid){
      this.ngbActiveModal.close({medico:this.medicoForm.value.medico});
    }
  }

  setValue(name:string,value:any){
    this.medicoForm.get(name)?.setValue(value);
  }


  selectmedico(medico:UserI){
    this.medicoSelect = medico;
    this.medicoSelected = medico;
    this.setValue('medico',medico)
    this.change.detectChanges();
  }
}
