import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(words: any, list: any): any {
    if (list === undefined || list === "All lists") {
      return words;
    } 

    return words.filter(function(word) {
      return word.list.toLowerCase().includes(list.toLowerCase());
    })
  }

}
