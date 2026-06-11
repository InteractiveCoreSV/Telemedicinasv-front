import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { SectionFichaMedicaI } from 'src/app/interfaces/fichas-medicas';
import { AlertsService } from 'src/app/services/alerts.service';
import { FichaMedicaService } from 'src/app/services/ficha-medica.service';

@Component({
  selector: 'app-all-fichas-medicas',
  templateUrl: './all-fichas-medicas.component.html',
  styleUrls: ['./all-fichas-medicas.component.scss']
})
export class AllFichasMedicasComponent implements OnInit {
  
  fichasMedicas:SectionFichaMedicaI[] = [];
  loading:boolean =true;


  constructor(
    private fichaMedicaService: FichaMedicaService,
    private alertsService: AlertsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getFichasMedicas();
  }

  getFichasMedicas(){
    this.loading =true;

    this.fichaMedicaService.getFichasMedicas().pipe(
      finalize(()=>{
        this.loading = false;
      })  
    ).subscribe({
      next:(res:any)=>{
        this.fichasMedicas = res.fichasMedicas;
      },
      error:(e)=>{
        console.log(e)
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }
}
