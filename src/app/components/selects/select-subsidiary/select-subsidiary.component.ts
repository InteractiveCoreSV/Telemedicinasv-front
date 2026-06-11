import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubsidiaryI } from '../../../interfaces/subsidiary.interface';
import { SubsidiaryService } from '../../../services/subsidiary.service';

@Component({
  selector: 'app-select-subsidiary',
  templateUrl: './select-subsidiary.component.html',
  styles: [
  ]
})
export class SelectSubsidiaryComponent implements OnInit {

  @Input() appendTo:string = '';
  @Input() consultorioMedico:boolean = true;
  @Input() placeholder:string = 'Selecciona la sucursal';

  subsidiaries:SubsidiaryI[] = [];

  @Input() subsidiarySelected!:string;
  @Output() private subsidiarySelectedEv:EventEmitter<SubsidiaryI | undefined> = new EventEmitter<SubsidiaryI | undefined>();

  subs:Subscription = new Subscription();

  constructor(
    private subsidiaryService: SubsidiaryService
  ) { }

  ngOnInit(): void {

    
    // this.subs.add(
    //   this.subsidiaryService.subsidiariesngSelect$.subscribe({
    //     next:((subsidiaries:SubsidiaryI[])=>{
    //       if(subsidiaries.length>0){
    //         this.subsidiaries = subsidiaries;
    //       }else{
    //         this.getSubsidiaries();
    //       }
    //     })
    //   })
    // );
    this.getSubsidiaries();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getSubsidiaries(){
    this.subsidiaryService.getSubsidiaries(0,{forNgSelect:true,consultorioMedico:this.consultorioMedico}).subscribe({
      next:((res:any)=>{
        this.subsidiaryService.subsidiariesngSelect$.next(res.subsidiaries)
        this.subsidiaries = res.subsidiaries;
      })
    })
  }

  selectedSubsidiary(){
    if (!this.subsidiarySelected) return;
    const subsidiaryObject = this.subsidiaries.find(v => v._id == this.subsidiarySelected);
    if (subsidiaryObject) this.subsidiarySelectedEv.emit(subsidiaryObject);
  }

  clear(){
    this.subsidiarySelected = '';
  }

}
