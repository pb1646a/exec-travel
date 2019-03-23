import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    //return hours + ':' + minutes;
const hours = Math.floor((value)/60);
const minutes: number = Math.floor((value)%60);
return `${hours}h ${minutes}m`;

  }
}
