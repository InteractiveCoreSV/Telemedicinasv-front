import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-new-especialidad',
  templateUrl: './new-especialidad.component.html',
  styleUrls: ['./new-especialidad.component.scss']
})
export class NewEspecialidadComponent implements OnInit {

  especialidadForm!: FormGroup;
  formSubmited: boolean = false;

  @Input() toEdit!:any;
  @Input() title:string = "Nueva";

  constructor(
    private fb: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    public ngbActiveModal: NgbActiveModal,
    private alertsService: AlertsService,
    private especialidadService: EspecialidadService
  ) { }

  ngOnInit(): void {
    this.createForm()
    if(this.toEdit){
      this.especialidadForm.patchValue(this.toEdit);
    }
  }

  createForm(): void {
    this.especialidadForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
    })
    
    if(!this.toEdit){
      this.especialidadForm.get('_id')?.disable();
    }
  }

  async newEspecialidad(){
    this.formSubmited = true;
    if(this.especialidadForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.especialidadService.newEspecialidad(this.especialidadForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      ).subscribe({
        next: (res: any) => {
          this.alertsService.toastMixin(res.message,'success',2000);
          this.formSubmited = false;
          this.ngbActiveModal.close({reload:true})
        },
        error: (e) =>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      })
    }
  }

  async editEspecialidad(){
    this.formSubmited = true;
    if(this.especialidadForm.valid){

      await this.ngxSpinnerService.show('generalSpinner');
      this.especialidadService.editEspecialidad(this.especialidadForm.value).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner')
        })
      ).subscribe({
        next: (res: any) => {
          this.alertsService.toastMixin(res.message,'success',2000);
          this.formSubmited = false;
          this.ngbActiveModal.close({reload:true})
        },
        error: (e:any) =>{
          const message = e['error']['message'];
          this.alertsService.toastMixin(message?message:'Ocurrió un error','error');
        }
      })

    }
  }

}
