import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fruit'
})
export class FruitPipe implements PipeTransform {

  transform(value: Array<number>, ...args: unknown[]): unknown {
    let fruits = ['🍊', '🍐', '🍌', '🍇', '🍉', '🍓', '🍑', '🍍', '🍒', '🍎'];

    let result = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 5 === 0) {
        result += "\n";
      }
      const fruitIndex = i % fruits.length;
      result += `${value[i]}${fruits[fruitIndex]} `;
    }

    return result.trim();
  }

}
