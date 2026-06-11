import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { UserI } from 'src/app/interfaces/user.interface';
import { ReloadsDataService } from 'src/app/services/reloads-data.service';
import { SubsidiaryService } from 'src/app/services/subsidiary.service';
import { NewAppointmentFormsService } from '../new-appointment-forms.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-subsidiary-modal',
  templateUrl: './select-subsidiary-modal.component.html',
  styleUrls: ['./select-subsidiary-modal.component.scss']
})
export class SelectSubsidiaryModalComponent  implements OnInit {

  formSubmited:boolean = false;

  form2!:FormGroup;
  subsidiatySelect: SubsidiaryI | null = null
  subsidiaries:SubsidiaryI[] = [];
  subsidiariesFilters:SubsidiaryI[] = []

  subsidiarySelectedValue:string = '';

  loading:boolean = false;
  page:number = 1;
  paginationDetails?:PaginationDetailsI;

  subs:Subscription = new Subscription();

  inputFilter = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private newAppointmentFormsService: NewAppointmentFormsService,
    private change: ChangeDetectorRef,
    private subsidiaryService: SubsidiaryService,
    private reloadsDataService: ReloadsDataService,
    public ngbActiveModal: NgbActiveModal
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

    this.inputFilter.valueChanges.subscribe(value => {
      this.filtrarDatos(value);
    });
  }

  getPhotoUrl(subsidiary: SubsidiaryI): string | null {
    return subsidiary.photos && subsidiary.photos.length > 0 ? subsidiary.photos[0].location : null;
  }

  getControl(name:string){
    return this.form2.get(name);
  }

  createForm(){
    this.form2 = this.formBuilder.group({
      subsidiary:[null,[Validators.required]],
    });

  }

  filtrarDatos(value: any) {
    this.subsidiariesFilters = []

    this.subsidiaries.map(subsidiarie =>{
      if(subsidiarie.name.toLowerCase().includes(value.toLowerCase())){
        this.subsidiariesFilters.push(subsidiarie)
      }
    });

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
      })
    })
  }

  setSubsidiary(){
    this.formSubmited = true;
    if(this.form2.valid){
      this.ngbActiveModal.close({subsidiary:this.form2.value.subsidiary});
    }
  }

  setValue(name:string,value:any){
    this.form2.get(name)?.setValue(value);
  }


  selectSubsidiary(subsidiary:SubsidiaryI){
    this.subsidiatySelect = subsidiary;
    this.setValue('subsidiary',subsidiary)
    this.change.detectChanges();
  }

  abrirRuta(direccion:string, lat?: number, lng?: number) {
    const hasCoordinates = typeof lat === 'number' && typeof lng === 'number';
    const destination = hasCoordinates ? `${lat},${lng}` : direccion;
    const url = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination);
    window.open(url, '_blank');
  }
}
