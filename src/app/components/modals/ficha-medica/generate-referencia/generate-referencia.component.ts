import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserI } from 'src/app/interfaces/user.interface';
import { UtilsService } from 'src/app/services/utils.service';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-generate-referencia',
  templateUrl: './generate-referencia.component.html',
  styleUrls: ['./generate-referencia.component.scss']
})
export class GenerateReferenciaComponent implements OnInit {
  submit: boolean = false;

  @Input() medico!: UserI;
  @Input() paciente!: any;
  @Input() idEstudio!: any;
  @Input() subsidiary!: string;
  @Input() date!: any;

  @Input() nameDoc!: string;
  @Input() description!: string;

  firma: any;
  sello: any;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private alertService: AlertsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (!this.date) this.date = new Date();

    if (this.medico?.firma?.location) {
      this.utilsService.getImageAsBase64(this.medico.firma.location).subscribe({
        next: (res: any) => { this.firma = res.img; },
        error: (e: any) => { console.error(e); }
      });
    }

    if (this.medico?.sello?.location) {
      this.utilsService.getImageAsBase64(this.medico.sello.location).subscribe({
        next: (res: any) => { this.sello = res.img; },
        error: (e: any) => { console.error(e); }
      });
    }
  }

  generarPDF(): void {
    this.submit = true;
    if (!this.nameDoc || !this.description) {
      this.alertService.toastMixin('Complete todos los campos', 'warning', 3000);
      return;
    }

    this.ngbActiveModal.close({
      nameDoc: this.nameDoc,
      id: this.idEstudio || nanoid(),
      description: this.description,
      generalInfo: {
        ...this.paciente,
        subsidiary: this.subsidiary,
        date: this.date,
        description: this.description,
      },
    });
  }
}
