import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { placeInfoI } from 'src/app/components/autocomplete-google/autocomplete-google.component';
import { GooglemapLocationComponent } from 'src/app/components/googlemap-location/googlemap-location.component';

SwiperCore.use([Navigation,Pagination]);
import SwiperCore,{Navigation,Pagination, SwiperOptions} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectPlacesForHourComponent } from 'src/app/components/modals/select-places-for-hour/select-places-for-hour.component';
import { SelectHourComponent } from 'src/app/components/selects/select-hour/select-hour.component';
import { HorarioI, Hours2I } from 'src/app/interfaces/hours.interface';
import { SubsidiaryI } from 'src/app/interfaces/subsidiary.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { SubsidiaryService } from 'src/app/services/subsidiary.service';
import { ReloadsDataService } from 'src/app/services/reloads-data.service';
import { HoursService } from 'src/app/services/hours.service';

@Component({
  selector: 'app-new-subsidiary',
  templateUrl: './new-subsidiary.component.html',
  styles: [
  ]
})
export class NewSubsidiaryComponent implements OnInit {
  @ViewChild('swiperPhotos') swiperPhotos!:SwiperComponent;
  @ViewChild('googlemapLocation') googlemapLocation!:GooglemapLocationComponent;
  @ViewChildren(SelectHourComponent) selectHours:QueryList<SelectHourComponent> = new QueryList<SelectHourComponent>();

  subsidiaryForm!:FormGroup;

  settingsSwiper:SwiperOptions={
    navigation:true,
    pagination:{clickable:true}
  };

  formSubmited:boolean = false;

  photos:File[] =[];
  photosTemp:File[] =[];

  subsidiaryToEdit?:SubsidiaryI;
  filesToEdit:File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService,
    private subsidiaryService: SubsidiaryService,
    private router: Router,
    private reloadsDataService: ReloadsDataService,
    private activatedRoute: ActivatedRoute,
    private ngbModal: NgbModal,
    private change:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.configEdit();
  }

 

  configEdit(){

    this.subsidiaryToEdit = this.activatedRoute.snapshot.data['subsidiary']?.['subsidiary'];
   
    if(this.subsidiaryToEdit){
  
      this.setEditSubsidiary();
    }

  }

  getControl(name:string){
    return this.subsidiaryForm.get(name);
  }

  setValue(name:string,value:any){
    this.subsidiaryForm.get(name)?.setValue(value);
  }

  setValueAddress(name:string,value:any){
    this.subsidiaryForm.get('address')?.get(name)?.setValue(value);
  }

  setDefaultCords(){
    const cords = this.getControl('address')?.get('cords')?.value;
    if(Object.keys(cords).length>1){
      this.googlemapLocation.configDefaultCords(cords.lat,cords.lng);
    }
  }

  setPlaceInfo(placeInfo:placeInfoI){
    const cords = {
      ...placeInfo.cords
    }
    this.setValueAddress('address',placeInfo.formatted_address);
    this.setValueAddress('cords',cords);

    this.googlemapLocation.centerInSpecificCords(cords.lat,cords.lng);
  }
 
  
  createForm(){
    this.subsidiaryForm = this.formBuilder.group({
      _id:['',[Validators.required]],
      name: [null,[Validators.required]],
      description: [null],
      address: this.formBuilder.group({
        address:[null,[Validators.required]],
        aditionalInfo:[null,[Validators.max(141)]],
        department:[null,[Validators.required]],
        municipality:[null,[Validators.required]],
        cords:[{},[]],
      }),

      status:[true,[Validators.required]],

      consultorioMedico:[true,[Validators.required]]

    });

    this.getControl('_id')?.disable();
  }

  addPhotoToPhotos(photo:File){
    if(photo){
      this.photos.push(photo);
      this.photosTemp = [];
    }

    setTimeout(()=>{
      this.swiperPhotos.swiperRef.slideNext();
    },1000)
  }

  removeFromPhotos(index:number){
    this.photos.splice(index,1);
  }

  async registerSubsidiary(){
    this.formSubmited =true;

    if(this.subsidiaryForm.invalid){
      return;
    }

    await this.ngxSpinnerService.show('generalSpinner');

    const data = {
      ...this.subsidiaryForm.value,
      photos:this.photos,
    };

    this.subsidiaryService.newSubsidiary(data).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin(res.message,'success');
        this.subsidiaryForm.reset();
        this.getControl('status')?.setValue(true);
        this.getControl('consultorioMedico')?.setValue(true);

        this.formSubmited=false;
        this.photos = [];
        this.reloadsDataService.reloadSubsidiaries.next(true);
        this.router.navigateByUrl('/dashboard/sucursales');
      },
      error:(e:any)=>{
        this.alertsService.toastMixin(e.error.message,'error');
      }
    })
  }

  async editSubsidiary(){
    this.formSubmited = true;
    if(this.subsidiaryForm.valid){
      await this.ngxSpinnerService.show('generalSpinner');

      const data = {
        ...this.subsidiaryForm.value,
      }

      this.subsidiaryService.editSubsidiary(data).pipe(
        finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
      ).subscribe({
        next:((res:any)=>{
          this.alertsService.toastMixin(res.message,'success');
          this.reloadsDataService.reloadSubsidiaries.next(true);
          this.router.navigateByUrl('/dashboard/sucursales');
          this.formSubmited = false;
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }
  }

  async addPhotoToSubsidiary(file:File){
    this.filesToEdit = [file];
    const {result} = await this.alertsService.confirmDialogWithModals('Info.','¿Deseas agregar esta foto a la sucursal?','question');

    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');
      this.subsidiaryService.addPhoto(file,(this.subsidiaryToEdit?._id || '')).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:((res:any)=>{
          if(this.subsidiaryToEdit){
            this.subsidiaryToEdit.photos = res.photos;
          }
          this.alertsService.toastMixin(res.message,'success');
          this.filesToEdit = [];
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
          this.filesToEdit = [];
        })
      })
    }else{
      this.filesToEdit = [];
    }
  }

  async removePhotoFromSubsidiary(keyPhoto:string){
    const {result} = await this.alertsService.confirmDialogWithModals('Info.','¿Deseas eliminar esta foto a la sucursal?','question');

    if(result.isConfirmed){
      await this.ngxSpinnerService.show('generalSpinner');
      this.subsidiaryService.removePhoto((this.subsidiaryToEdit?._id || ''),keyPhoto).pipe(
        finalize(async()=>{
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      ).subscribe({
        next:((res:any)=>{
          if(this.subsidiaryToEdit){
            this.subsidiaryToEdit.photos = res.photos;
          }
          this.alertsService.toastMixin(res.message,'success');
        }),
        error:((e:any)=>{
          this.alertsService.toastMixin(e.error.message,'error');
        })
      })
    }
  }

  async setEditSubsidiary(){
    this.subsidiaryForm.get('_id')?.enable();

    this.subsidiaryForm.patchValue(this.subsidiaryToEdit || {});
  }

  async setHour(hour:Hours2I | null){
    if(!hour){
      return;
    }

    setTimeout(()=>{
      this.selectHours.forEach((v)=>{
        v.clear();
      });
    },100);
  }


}
