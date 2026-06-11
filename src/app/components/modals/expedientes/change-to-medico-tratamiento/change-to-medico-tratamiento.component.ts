import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-to-medico-tratamiento',
  templateUrl: './change-to-medico-tratamiento.component.html',
  styleUrls: ['./change-to-medico-tratamiento.component.scss']
})
export class ChangeToMedicoTratamientoComponent  implements OnInit{

  @Input() sello:any
  @Input() firma:any
  @Input() name:any

  imgsSello:File[] = []
  imgsFirma:File[] = []


  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    
  }

    async changeSello(){
    this.sello = null
  }

  async changeFirma(){
    this.firma = null
  }

  save(){
    this.ngbActiveModal.close({name:this.name, sello: this.imgsSello[0], firma: this.imgsFirma[0]})
  }
}
