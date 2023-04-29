import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vitamin'
})
export class VitaminPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return value.toString() + "%";
  }

}
