import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ExpedienteI } from 'src/app/interfaces/document-expediente';
import { AlertsService } from 'src/app/services/alerts.service';
import { ExpedienteService } from 'src/app/services/expediente.service';


@Component({
  selector: 'app-new-document-expediente',
  templateUrl: './new-document-expediente.component.html',
  styleUrls: ['./new-document-expediente.component.scss']
})
export class NewDocumentExpedienteComponent implements OnInit, AfterViewInit {
  @ViewChild('comment', { static: true }) comment!: ElementRef;

  @Input() documentToEdit!: ExpedienteI;

  document:File[] =[];
  user!:string
  name!: string
  category: string | null = null

  loading: boolean = false

  changeDocumentOption: boolean = true

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private expedienteService: ExpedienteService,
    private alertsService: AlertsService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    if(this.documentToEdit){
      this.changeDocumentOption = false
      this.name = this.documentToEdit.name;
      this.category = this.documentToEdit.category ? this.documentToEdit.category : null;
      this.comment.nativeElement.textContent =  this.documentToEdit.comment;
    }
  }

  ngAfterViewInit() {
    // if(this.documentToEdit){

    //   this.loading = false
    // }
  }

  adddocument(document: any): void {
    if(document){
      this.document.push(document)
    }
  }

  async savedocument(){
    if(this.document.length === 0){
      this.alertsService.toastMixin('Ingresa el document que deseas guardar.','error');
      return
    }

    if(!this.name){
      this.alertsService.toastMixin('Ingresa el el nombre que le asignara al document.','error');
      return
    }

    
    if(!this.category){
      this.alertsService.toastMixin('Ingresa la catégoria para el document.','error');
      return
    }

    const formData: FormData = new FormData();

    formData.append('archivo', this.document[0]);

    formData.append('user', this.user);
    formData.append('comment', this.comment.nativeElement.value);
    formData.append('name', this.name);
    formData.append('category', this.category);

    const typeDocument =  this.document[0].type == 'application/pdf' ? 'pdf' :
                          ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.document[0].type) ? 'word':
                          'image';
    
    formData.append('typeDocument', typeDocument);
 
    await this.ngxSpinnerService.show('generalSpinner');

    this.expedienteService.saveDocumentExpediente(formData).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin(res['message'],'success');
        this.ngbActiveModal.close({reload:true});
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    });

  }

  async editDocument(){
    if(this.document.length === 0 && this.changeDocumentOption){
      this.alertsService.toastMixin('Ingresa el document que deseas guardar.','error');
      return
    }

    if(!this.name){
      this.alertsService.toastMixin('Ingresa el nombre que le asignara al document.','error');
      return
    }

    if(!this.category){
      this.alertsService.toastMixin('Ingresa la catégoria para el document.','error');
      return
    }

    const formData: FormData = new FormData();

    formData.append('_id', this.documentToEdit._id ? this.documentToEdit._id : '');
    formData.append('user', this.user);
    formData.append('comment', this.comment.nativeElement.value);
    formData.append('name', this.name);
    formData.append('category', this.category);

    if(this.document.length > 0){
      formData.append('archivo', this.document[0]);

      const typeDocument =  this.document[0].type == 'application/pdf' ? 'pdf' :
                            ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(this.document[0].type) ? 'word':
                            'image';
      
      formData.append('typeDocument', typeDocument);
    } 

    await this.ngxSpinnerService.show('generalSpinner');

    this.expedienteService.editDocument(formData).pipe(
      finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
    ).subscribe({
      next:(res:any)=>{
        this.alertsService.toastMixin(res['message'],'success');
        this.ngbActiveModal.close({reload:true});
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    });

  }

  changeDocument(){
    this.changeDocumentOption = true
  }
}
