import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fruit'
})
export class FruitPipe implements PipeTransform {

  transform(value: Array<string>, ...args: unknown[]): unknown {

    let result = "";
    for (let i = 0; i < value.length; i++) {
      result += `${value[i]} `;
    }

    return result.trim();
  }

}
