import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, delay, finalize, of, retryWhen, take, tap, throwError } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-history-user-crm',
  templateUrl: './history-user-crm.component.html',
  styleUrls: ['./history-user-crm.component.scss']
})
export class HistoryUserCrmComponent implements OnInit {
  
  @Input() email_doctor!:string;
  @Input() dni_paciente!:string;
  @Input() fecha_nacimiento!:string;
  @Input() genero!:string;

  loading:boolean =false;
  
  history:any[] = [];

  formSubmited = false;
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  customError!:string

  constructor(
    private alertsService: AlertsService,
    private expedienteService: ExpedienteService,
    private ngbModal: NgbModal,
    public ngbActiveModal: NgbActiveModal,
    private utilsService: UtilsService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // this.getHistoryUserCRM()
  }

  getHistoryUserCRM(){
    this.formSubmited = true
    this.history = []
    if (this.emailControl.invalid) {
      this.alertsService.toastMixin("El correo del médico es necesario", 'info')
      return;
    }

    this.loading = true
    this.email_doctor = this.emailControl.value ?? '';

    this.expedienteService.getHistoryUserCRM(this.email_doctor,this.dni_paciente,this.fecha_nacimiento,this.genero).pipe(
      finalize(()=>{
        this.loading = false;
      })  
    ).subscribe({
      next: ((res:any) => {
        if(res.documents.ordenes){
          this.history = res.documents.ordenes
        }

        if(res.documents.message){
          this.alertsService.toastMixin(res.documents.message, 'info');
          this.customError = res.documents.message ?? 'Ocurrió un error al cargar el historial del paciente.'
        }

      }),
      error: (error => {
        this.customError = error.message ?? 'Ocurrió un error al cargar el historial del paciente.'
        this.alertsService.toastMixin(error.message ?? 'Ocurrió un error al cargar el historial del paciente.', 'error')
      })
    })
  }

  // viewDocument(document:any){
  //   this.loading = true
  //   this.expedienteService.pdfOrderCRM(document.numero_orden,document.hash_orden,this.email_doctor).pipe(
  //     finalize(()=>{
  //       this.loading = false;
  //     })  
  //   ).subscribe({
  //     next: ((res:any) => {
  //       if (res?.pdf) {
  //       const pdfBlob = this.utilsService.base64ToBlob(res.pdf, 'application/pdf');
  //       const pdfUrl = URL.createObjectURL(pdfBlob);
  //       window.open(pdfUrl, '_blank'); // 👉 Abre el PDF en nueva pestaña
  //     }
  //     }),
  //     error: (error => {
  //       console.log(error)
  //       this.alertsService.toastMixin(error.error.message ?? 'Ocurrió un error al cargar el historial del paciente.', 'error')
  //     })
  //   })
  // }

  async viewDocument(document: any) {
    const startTime = performance.now();   

    const maxRetries = 5;   
    let attempt = 0;       

    await this.ngxSpinnerService.show('generalSpinner');
    this.expedienteService.pdfOrderCRM(
      document.numero_orden,
      document.hash_orden,
      this.email_doctor
    )
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(() => {
              attempt++;
              console.warn(`Intento fallido #${attempt}...`);
            }),
            delay(1500), // 
            take(maxRetries),
            // Si llega al límite, lanza error
            concatMap((error, index) =>
              index + 1 === maxRetries
                ? throwError(() => new Error("No se pudo obtener el PDF después de varios intentos."))
                : of(error)
            )
          )
        ),
        finalize(async () => {
          const endTime = performance.now();
          const seconds = ((endTime - startTime) / 1000).toFixed(2);
          console.log(`Tiempo total: ${seconds} segundos`);
          console.log(`Intentos realizados: ${attempt}`);
          await this.ngxSpinnerService.hide('generalSpinner');
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log("Respuesta final:", res);

          // --- Manejo del PDF ---
          if (res?.pdf) {
            const pdfBlob = this.utilsService.base64ToBlob(res.pdf, "application/pdf");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
          }
        },
        error: (error) => {
          console.error(error);
          this.alertsService.toastMixin(
            error.message || "Ocurrió un error al cargar el documento.",
            "error"
          );
        },
      });
  }

}