import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { InsuranceI } from 'src/app/interfaces/insurance';
import { AlertsService } from 'src/app/services/alerts.service';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'app-new-insurance',
  templateUrl: './new-insurance.component.html',
  // styleUrls: ['./new-insurance.component.scss']
})
export class NewInsuranceComponent implements OnInit {

  insuranceForm!:FormGroup;
  formSubmited:boolean = false;
  insuranceToEdit!: InsuranceI;
  windowsWidth:number=0;

  constructor(
    private formBuilder:FormBuilder,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private insuranceService: InsuranceService,
    private router: Router,
    private changes:ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.windowsWidth = innerWidth;
    this.createForm();
    this.insuranceToEdit = history.state?.insurance;

    if(this.insuranceToEdit){
      this.setEditinsurance();
    }
  }

  @HostListener('window:resize')
  onResize(){
    this.windowsWidth = window.innerWidth;
    this.changes.detectChanges();
  }

  createForm(){
    this.insuranceForm = this.formBuilder.group({
      _id:[null,[Validators.required]],
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      nit:['',[Validators.required]],
      contactName:['',[Validators.required]],
      contactPhone:['',[Validators.required]],
      phone:['',[Validators.required]],
      status:[true,[Validators.required]]
    });

    this.insuranceForm.get('_id')?.disable();
  }

  async register(){
    this.formSubmited =true;

    if(this.insuranceForm.invalid){
      return;
    }

    const data = this.insuranceForm.value;

    await this.ngxSpinnerService.show('generalSpinner')
    this.insuranceService.newInsurance(data).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin(res.message,'success');
        this.insuranceForm.reset();
        this.formSubmited=false;
        this.router.navigate(['/dashboard/aseguradoras'],{replaceUrl:true})
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      }
    })
  }

  async editinsurance(){
    this.formSubmited = true;
    if(this.insuranceForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      this.insuranceService.editInsurance(this.insuranceForm.value).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:(res:any)=>{
          this.alertsService.toastMixin(res['message'],'success');
          this.insuranceForm.reset();
          this.formSubmited = false;
          this.router.navigate(['/dashboard/aseguradoras'],{replaceUrl:true})
        },
        error:(e)=>{
          this.alertsService.toastMixin(e['error']['message'],'error');
        }
      });
    }
  }

  setEditinsurance(){
    this.insuranceForm.get('_id')?.enable();
    this.insuranceForm.get('status')?.disable();

    this.insuranceForm.patchValue(this.insuranceToEdit);
  }

  getErrorMessageName(){
    const name = this.insuranceForm.get('name');

    if(name?.hasError('required')){
      return 'El nombre es requerido';
    }

    return ''
  }

  getErrorMessageDescription(){
    const description = this.insuranceForm.get('description');

    if(description?.hasError('required')){
      return 'La descripción es requerida';
    }

    return ''
  }

  getErrorMessageStatus(){
    const status = this.insuranceForm.get('status');

    if(status?.hasError('required')){
      return 'El estado es necesario';
    }

    return ''
  }

  getErrorEmailMessage() {
    if (this.insuranceForm?.get('email')?.hasError('required')) {
      return 'El E-mail es requerido';
    }

    return 'El E-mail inválido';
  }

}
