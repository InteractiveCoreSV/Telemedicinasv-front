import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import * as dayjs from 'dayjs';
import { BehaviorSubject,Subject, filter, map, mergeMap, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx-js-style';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

const baseurlapi = environment.urlApi + '/utils';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private currentDataRoute$:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  currentPosition:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  registerUser:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private scrollSubject = new Subject<string>();
  scrollEvent$ = this.scrollSubject.asObservable();

  emitScrollEvent(elementId: string): void {
    this.scrollSubject.next(elementId);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private http: HttpClient
  ) { }

  getCurrentDataRoute(){
    return this.currentDataRoute$.asObservable();
  }

  setData(){
    this.router.events.pipe(
      filter(ev=>ev instanceof NavigationEnd),
      map(()=>this.activatedRoute),
      map((route)=>{
        while (route.firstChild){
          route = route.firstChild;
        }
        return route;
      }),
      filter((route)=>route.outlet === PRIMARY_OUTLET),
      mergeMap((route)=>route.data)
    ).subscribe((event)=>{
      // const currentTitle = this.title.getTitle();
      this.currentDataRoute$.next(event);
      this.title.setTitle(`Telemedicina Analiza El Salvador`);
    })
  }

  generateDates(startDate:string,endDate:any){
    if(!startDate || !endDate){
      return [];
    }

    const dates = [];
    let currentDate = dayjs(startDate).startOf('day');
    endDate = dayjs(endDate).endOf('day');

    while(currentDate.isBefore(endDate) || currentDate.isSame(endDate)){
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1,'day');
    }
    return dates;
  }

  orderAppointmentsCalendar(appointments:any){
    appointments.sort((a:any,b:any)=>{
      if(a.extendedProps.hour && b.extendedProps.hour){
        if (a.extendedProps.hour.time === b.extendedProps.hour.time) {
          return a.extendedProps.hour.order - b.extendedProps.hour.order;
        } else if (a.extendedProps.hour.time === 'morning') {
          return -1;
        } else {
          return 1;
        }
      }else {
        return 1;
      }
    })
  }

  base64ToBlob(base64: string, contentType = '') {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArrays)], { type: contentType });
  }

  getImageAsBase64(url: any) {
    return this.http.get(`${baseurlapi}/getImgeBase64`,{params:{url}})
  }

  exportAsExcel(data: any,excelFileName: string,columnsName:string[],columnWidths:any[],title?:string): void {

    const plainWorksheet: XLSX.WorkSheet = this.createPlainWorksheet(data,columnsName,columnWidths,title);
    const sheetName = excelFileName.substring(0, 31);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        [sheetName]: plainWorksheet,
      },
      SheetNames: [sheetName]
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  
  private createPlainWorksheet(data: any[],columnsName:string[],columnWidths:any[], title?:string): XLSX.WorkSheet {
    // Crear la fila de título (una celda con texto y formato)
    const titleRow = [];
    if(title){
          titleRow.push({
          v: title,
          s: {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: 'center' }
          }
        })
    }

    // Define headers
    const headers = columnsName.map(c => {
      return {
        v: c,
        s: {
          font: { bold: true },
          alignment: { horizontal: 'center' }
        }
      };
    });

    // Convert data to sheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(title ? [titleRow, headers] : [headers]);

    if(title){
      ws['!merges'] = [{
        s: { r: 0, c: 0 }, // fila 0, columna 0
        e: { r: 0, c: columnsName.length - 1 } // fila 0, última columna
      }];
    }
    
    // Add data below headers
   XLSX.utils.sheet_add_json(ws, data, { origin: titleRow.length > 0 ? 'A3' : 'A2', skipHeader: true });

    const range = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { // Start from row after headers
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue; // Skip if cell is not defined
        if (!ws[cell_ref].s) ws[cell_ref].s = {};
        if (!ws[cell_ref].s.alignment) ws[cell_ref].s.alignment = {};
        ws[cell_ref].s.alignment.horizontal = 'center';
      }
    }

    // Adjust column widths
    ws['!cols'] = columnWidths;

    return ws;
  }

  exportAsExcelWithFormat(
    data: any,
    excelFileName: string,
    columnsName: string[],
    columnWidths: any[],
    title?: string
  ): void {

     const worksheet: XLSX.WorkSheet =
    this.createPlainWorksheet(data, columnsName, columnWidths, title);

  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);

  // ---- DEFINIR ALTURA DE FILAS (desde fila 3) ----
  worksheet['!rows'] = worksheet['!rows'] || [];

  for (let R = 2; R <= range.e.r; R++) {
    worksheet['!rows'][R] = {
      hpt: 30 // 👈 altura en puntos (prueba 25–40)
    };
  }

  // ---- CENTRAR VERTICALMENTE LAS CELDAS ----
  for (let R = 2; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      cell.s = {
        ...(cell.s || {}),
        alignment: {
          ...(cell.s?.alignment || {}),
          vertical: 'center',
          horizontal: 'center', // opcional
          wrapText: true,        // recomendado
        },
      };
    }
  }

  const sheetName = excelFileName.substring(0, 31);
  const workbook: XLSX.WorkBook = {
    Sheets: { [sheetName]: worksheet },
    SheetNames: [sheetName],
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  });

  this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}

