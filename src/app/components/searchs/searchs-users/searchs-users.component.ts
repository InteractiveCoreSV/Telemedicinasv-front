import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AutocompleteComponent } from 'angular-ng-autocomplete';
import { UserI } from '../../../interfaces/user.interface';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/user.service';
import { filter } from 'src/assets/vendor/jszip';

@Component({
  selector: 'app-searchs-users',
  templateUrl: './searchs-users.component.html',
  styleUrls: ['./searchs-users.component.scss']
})
export class SearchsUsersComponent implements OnInit {
  @ViewChild('searchInputComponent',{static:true}) searchInputComponent!:AutocompleteComponent;
  searchInput!:string;

  @Input() classes:string[]=[];
  @Input() placeholder:string ='Busca por Nombres';
  @Input() role!:string;

  keyboard:string = 'names';

  users:UserI[] =[];

  inputSearch!:HTMLElement | null;

  @Output() userSelected:EventEmitter<UserI | null> = new EventEmitter<UserI | null>();

  customFilter = function(users: any[], query: string): any[] {
    return users.filter(x => x.names.toLowerCase().includes(query.toLowerCase()) || x.email.toLowerCase().includes(query.toLowerCase()));
  };

  constructor(
    private router: Router,
    private usersService: UsersService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }


  ngAfterViewInit(){
    this.inputSearch = document.querySelector('.ng-autocomplete .autocomplete-container');
  }

  selected(ev:any){
    if(ev){
      this.inputSearch?.classList.add('input-value');
      // this.router.navigateByUrl(`/dashboard/products/details/${ev.idProduct}`);
      this.userSelected.emit(ev);
    }
  }

  search(){
    // this.router.navigateByUrl(`/dashboard/products/list/${this.searchInput}`);
  }

  changeValue(value:string){
    if(value.length>0){
      this.getUsers(value);
      return this.inputSearch?.classList.add('input-value');
    }
    this.inputSearch?.classList.remove('input-value');
    this.userSelected.emit(null);
  }

  getUsers(search:string){
    let filters:any = {}
    if(this.role)filters.role = this.role
    this.usersService.searchUsers(search,filters).subscribe({
      next:(res:any)=>{
        this.users = res.users;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  searchFor(keyboard:string, placeholder:string){
    this.keyboard = keyboard;
    this.placeholder = 'Buscando por ' +placeholder;
  }
}
