import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { ReloadsDataService } from 'src/app/services/reloads-data.service';
import { SubsidiaryService } from 'src/app/services/subsidiary.service';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';

@Component({
  selector: 'app-form2-new-appointment',
  templateUrl: './form2-new-appointment.component.html',
  styles: [
  ]
})
export class Form2NewAppointmentComponent implements OnInit, OnDestroy {

  formSubmited:boolean = false;

  form2!:FormGroup;
  idSubsidiatySelect: string | undefined = ''
  subsidiaries:SubsidiaryI[] = [];

  subsidiarySelectedValue:string = '';

  loading:boolean = false;
  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  subs:Subscription = new Subscription();

  @Output() nextStepper:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private change: ChangeDetectorRef,
    private subsidiaryService: SubsidiaryService,
    private reloadsDataService: ReloadsDataService,
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.getSubsidiaries();
    this.subs.add(
      this.reloadsDataService.reloadSubsidiaries.subscribe({
        next:((reload)=>{
          if(reload){
            this.getSubsidiaries();
          }
        })
      })
    );
  }

  getControl(name:string){
    return this.form2.get(name);
  }

  createForm(){
    this.form2 = this.formBuilder.group({
      subsidiary:[null,[Validators.required]],
      // fisioterapeuta:['',[Validators.required]],
    });

    Object.assign(this.newAppointmentFormsService.forms,{form2:this.form2})
  }

  getSubsidiaries(){
    this.loading = true;
    this.subsidiaryService.getSubsidiaries(this.page, {status:true}).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.subsidiaries = res.subsidiaries;
        this.paginationDetails = res.paginationDetails;
      }),
      error:((e:any)=>{
        this.subsidiaries = [];
      })
    })
  }

  nextForm(){
    this.formSubmited = true;
    if(this.form2.valid){
      this.nextStepper.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setValue(name:string,value:any){
    this.form2.get(name)?.setValue(value);
  }

  setFisioterapeuta(user:UserI | null){
    if(user){
      this.setValue('fisioterapeuta',user);
    }else{
      this.setValue('fisioterapeuta',null);
      // this.setValue('pet',null);
      // this.petSelected = undefined;
    }
  }

  selectSubsidiary(idSubsidiaty?:string){
    this.idSubsidiatySelect = idSubsidiaty
    this.change.detectChanges();
    // this.selectFisioterapeutaComponent.clear();
  }
}
