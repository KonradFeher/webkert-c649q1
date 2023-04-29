import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fruit'
})
export class FruitPipe implements PipeTransform {

  transform(value: Array<number>, ...args: unknown[]): unknown {
    let fruits = ['🍊', '🍐', '🍌', '🍇', '🍉', '🍓', '🍑', '🍍', '🍒', '🍎'];

    let result = "";
    for (let i = 0; i < value.length; i++) {
      const fruitIndex = i % fruits.length;
      if (value[i])
      result += `${value[i]}g${fruits[fruitIndex]} `;
    }

    return result.trim();
  }

}
