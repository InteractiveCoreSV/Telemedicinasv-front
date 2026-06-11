import { Pipe, PipeTransform } from '@angular/core';
import { UserI } from '../interfaces/user.interface';

@Pipe({
  name: 'searchUsers'
})
export class SearchUsersPipe implements PipeTransform {

  transform(list: UserI[] | null, text:string): UserI[] | null{

    if(!text){
      return list;
    } ;
    let searchedList = list?.filter(user =>
      user.names.toUpperCase().includes(text.toUpperCase())
      || user.email.toUpperCase().includes(text.toUpperCase())
      || user.roles?.[0]?.nameEs?.toUpperCase().includes(text.toUpperCase())
      || user.roles?.[0]?.name?.toUpperCase().includes(text.toUpperCase())
    )

    return searchedList?searchedList:null;
  }

}
