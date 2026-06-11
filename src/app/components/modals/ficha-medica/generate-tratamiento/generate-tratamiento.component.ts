import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/services/alerts.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserI } from 'src/app/interfaces/user.interface';
import { UtilsService } from 'src/app/services/utils.service';
import { nanoid } from 'nanoid';
import { ChangeToMedicoTratamientoComponent } from '../../expedientes/change-to-medico-tratamiento/change-to-medico-tratamiento.component';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { finalize, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-generate-tratamiento',
  templateUrl: './generate-tratamiento.component.html',
  styleUrls: ['./generate-tratamiento.component.scss']
})
export class GenerateTratamientoComponent  implements OnInit {
  submit:boolean = false;

  @Input() edit:boolean = false
  @Input() medicoChange:boolean = false

  @Input() medico!:UserI
  @Input() medicoName!:string
  @Input() subsidiary!:string
  @Input() date:any = new Date()

  @Input() paciente!:any
  @Input() idTratamiento!:any

  @Input() nameDoc!:string

  name!:string
  @Input() description!:string

  pdfBlob!: Blob; 

  firma: any;
  sello:any

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private alertService:AlertsService,
    private utilsService: UtilsService,
    private ngbModal: NgbModal,
    private expedienteService: ExpedienteService,
    private ngxSpinnerService: NgxSpinnerService, 
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.utilsService.getImageAsBase64(this.medico?.firma?.location).subscribe(
      (res:any) => {
        this.firma = res.img;
      },
      (error) => {
        console.error( error);
      }
    );

    this.utilsService.getImageAsBase64(this.medico?.sello?.location).subscribe(
      (res:any) => {
          this.sello = res.img;
      },
      (error) => {
        console.error( error);
      }
    );
  }

  saveCampo(): void {
    this.submit = true

    // if(this.newSectionName && this.submit){
    //   this.ngbActiveModal.close({section:{newSectionName: this.newSectionName, sectionOnlyWoman:this.sectionOnlyWoman}})
    // }
  }

  generarPDF(): void {
    this.submit = true;
    if (!this.nameDoc || !this.description) {
      this.alertService.toastMixin('Complete todos los campos', 'warning', 3000);
      return;
    }
    this.ngbActiveModal.close({
      nameDoc: this.nameDoc,
      id: this.idTratamiento || nanoid(),
      description: this.description,
      generalInfo: {
        ...this.paciente,
        subsidiary: this.subsidiary,
        date: this.date,
        description: this.description,
      },
    });
  }

  async changeMedico(){
    const modal = this.ngbModal.open(ChangeToMedicoTratamientoComponent,{centered:true, size:'lg'});
      modal.componentInstance.sello = this.sello
      modal.componentInstance.firma = this.firma
      modal.componentInstance.name = this.medicoName

    try {
      const result = await modal.result;
      if(result){
          await this.ngxSpinnerService.show('generalSpinner');

          const promises: Promise<void>[] = [];

         if(result.firma){
          const firmaPromise = this.convertFileToBase64(result.firma).then(base64 => {
              this.firma = base64
            })
            .catch(err => {
              console.error( err);
            });

          promises.push(firmaPromise);
        }

        if(result.sello){
          const selloPromise = this.convertFileToBase64(result.sello).then(base64 => {
              this.sello = base64
            })
            .catch(err => {
              console.error( err);
            }); 

          promises.push(selloPromise);

        }

        this.medicoName = result.name

        Promise.all(promises).then(() => {
          this.changeDetector.detectChanges()
          this.generarOnlyPDF(result)

        }).finally(async () => {
          await this.ngxSpinnerService.hide('generalSpinner');
        });

        
      }
    } catch (error) {}
  }

  close(){
    this.ngbActiveModal.close({reload: this.medicoChange} )
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error('El parámetro no es un archivo válido de tipo Blob o File.'));
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }


  async generarOnlyPDF(result:any) {
    const pdfContent = document.getElementById('pdfContent');

    if (pdfContent && this.nameDoc && this.description) {
      html2canvas(pdfContent, { 
          scale: 3,
          windowWidth: 1200,
          windowHeight: 1600

      }).then(async canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter'
        });
    
        const imgWidth = 190; // Ancho de la imagen
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura proporcional
    
        const topMargin = 20; // Margen superior en mm
        const leftMargin = 12; // Margen izquierdo en mm
        const rightMargin = 10; // Margen derecho en mm
    
        // Ajusta el ancho de la imagen para que respete el margen derecho
        const adjustedImgWidth = imgWidth > (pdf.internal.pageSize.width - leftMargin - rightMargin) 
                                  ? (pdf.internal.pageSize.width - leftMargin - rightMargin) 
                                  : imgWidth;
    
        // Añade la imagen al PDF con márgenes
        pdf.addImage(imgData, 'PNG', leftMargin, topMargin, adjustedImgWidth, imgHeight);
    
        // Genera el PDF como un Blob y almacénalo en la variable pdfBlob
        this.pdfBlob = pdf.output('blob') as Blob;
       

         const data = new FormData();
        data.append('_id', this.idTratamiento); 
        data.append('name', result.name);
        data.append('imgFirma',result.firma);
        data.append('imgSello',result.sello);

        data.append('pdfBlob',this.pdfBlob);

        this.expedienteService.editMedico(data).pipe(
          finalize(async()=>await this.ngxSpinnerService.hide('generalSpinner'))
        ).subscribe({
          next:(res:any)=>{
            this.medicoChange = true
            const tratamiento = res.document

            this.medicoName = tratamiento.medico
            this.sello = tratamiento.sello.location
            this.firma = tratamiento.firma.location

            this.utilsService.getImageAsBase64(this.edit ? this.firma : this.medico.firma?.location).subscribe(
              (res:any) => {
                this.firma = res.img;
              },
              (error) => {
                console.error( error);
              }
            );

            this.utilsService.getImageAsBase64(this.edit ? this.sello : this.medico.sello?.location).subscribe(
              (res:any) => {
                  this.sello = res.img;
              },
              (error) => {
                console.error( error);
              }
            );
          },
          error:(e)=>{
            this.alertService.toastMixin(e['error']['message'],'error');
          }
        });
    
      });
    }else {
      this.alertService.toastMixin('Complete todos los campos','warning',3000)
    }
  }

}
