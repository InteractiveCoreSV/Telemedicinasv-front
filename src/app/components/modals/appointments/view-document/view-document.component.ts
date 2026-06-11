import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as mammoth from 'mammoth';
import { Fancybox } from '@fancyapps/ui';
import { ExpedienteService } from 'src/app/services/expediente.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  @Input() url!: string;
  @Input() typeDocument!: string;
  @Input() name!: string;


  documentContent: string = ''; // Para guardar el contenido HTML

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private expedienteService: ExpedienteService
  ) { }

  ngOnInit(): void {
    if(this.typeDocument == 'word'){
      fetch(this.url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const arrayBuffer = reader.result as ArrayBuffer; // Tipo seguro
          mammoth.convertToHtml({ arrayBuffer })
            .then(result => {
              this.documentContent = result.value; // Guardar contenido HTML
            })
            .catch(err => console.error(err));
        };
        reader.readAsArrayBuffer(blob);
      })
      .catch(err => console.error(err));
    }
  }

  viewAtt(src:any){
    new Fancybox(
      [
        {
          src: src,
          type: "image",
        },
      ]
    );
  }

  descargar(){
    this.expedienteService.downloadDocumentExpediente(this.url,`${this.name}.${this.typeDocument ==  'pdf' ? 'pdf' : this.typeDocument ==  'word' ? 'docx' :'png' }`);
  }

}
