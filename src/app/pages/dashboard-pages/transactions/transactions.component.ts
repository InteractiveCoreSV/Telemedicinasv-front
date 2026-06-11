import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PaginationDetailsI } from 'src/app/interfaces/paginationDetails.interface';
import { TransactionsI } from 'src/app/interfaces/trans.interface';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Subscription, finalize } from 'rxjs';
import { UserI } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { ComponentsModule } from "src/app/components/components.module";

declare const $: any; // declare jQuery

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ],
})
export class TransactionsComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('datePicker') datePickerRef!: ElementRef;

  page:number = 1;
  paginationDetails!:PaginationDetailsI;

  userInfo!:UserI | null;
  userId!: string
  filters: any = {};
  subs:Subscription = new Subscription()

  trans:TransactionsI[] =[];

  loading:boolean = false;

  currentMonth =  new Date();
  startDate:any = null;
  endDate:any = null;
  btnCancelSearchByDates:boolean = false;

  typingTimer: any

  constructor(
    private transactionsService: TransactionsService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.filters = {
      ...this.filters,
      // rangeDates: null,
    }

    this.startDate = null;
    this.endDate = null;

    this.subs.add(
      this.authService.getUserInfo().subscribe((userInfo:any)=>{
        this.userInfo = userInfo;

        if(this.userInfo){
          if(this.userInfo.roles && this.userInfo.roles[0]?.name === 'client'){
            this.filters.user = this.userInfo?._id
          }
          
            this.searchWithoutDates()
         
        }
      })
    )

    this.searchWithoutDates()
  }

  ngAfterViewInit(){
    const datePicker = $(this.datePickerRef.nativeElement);

    datePicker.on('apply.daterangepicker', (ev:any, picker:any) => {
      this.startDate = picker.startDate.format('YYYY-MM-DD');
      this.endDate = picker.endDate.format('YYYY-MM-DD');
      this.changeFilters();
      this.btnCancelSearchByDates = true;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  getCurrentMonthDateRange(): { from: Date; to: Date } {
    const today = new Date();

    // Primer día del mes actual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);

    // Último día del mes actual
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      from: startOfMonth,
      to: endOfMonth
    };
  }

  changeFilters(){

    this.filters = {
      ...this.filters, 
      rangeDates: {
        from: this.startDate,
        to: this.endDate
      }
    }

    this.getTransactions();
  }
  
  searchWithoutDates(){
    this.startDate = null;
    this.endDate = null;
    this.changeDetectorRef.detectChanges()

    this.filters = {
      ...this.filters,
      rangeDates: {from:null,to:null}
    }
    
    this.btnCancelSearchByDates=false
    
    this.getTransactions()
  }

  getTransactions(){
    this.loading = true;
    this.transactionsService.getAllTrans(this.page,this.filters).pipe(
      finalize(()=>{
        this.loading = false;
      })
    ).subscribe({
      next:((res:any)=>{
        this.trans = res.trans;
        this.paginationDetails = res.paginationDetails;

      })
    })
  }

  getForSearch(value: string) {
    this.filters.search = value;
    this.page = 1;

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    this.typingTimer = setTimeout(() => {
      this.getTransactions();
    }, 700);
  }
}
