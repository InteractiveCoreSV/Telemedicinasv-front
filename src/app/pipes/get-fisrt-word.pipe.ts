import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFisrtWord'
})
export class GetFisrtWordPipe implements PipeTransform {

  transform(value: string, isFullName:boolean = false): string | boolean | null {
    if (value === null || value === undefined) return null

      if(isFullName){
        const words = value.split(' ');

        const initials = words.map(word => word[0]);

        if (initials.length === 1) {
          return initials[0];
        } else if(initials.length == 2){
          return initials[0] + initials[1];
        }else{
          return initials[0] + initials[1];
        }
      }else{
        value = value.split(' ')[0];
        const firstWords = [];
        for (let i = 0; i < value.length; i++)
        {
          const words = value[i].split(' ');
          firstWords.push(words[0]);
        }

        return firstWords[0];

      }
  }

}
