import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-day',
  templateUrl: './new-day.component.html',
  styleUrls: ['./new-day.component.scss']
})
export class NewDayComponent {
  fruitForm = new FormGroup({
    date: new FormControl(),
    'fruit-0': new FormControl(0),
    'fruit-1': new FormControl(0),
    'fruit-2': new FormControl(0),
    'fruit-3': new FormControl(0),
    'fruit-4': new FormControl(0),
    'fruit-5': new FormControl(0),
    'fruit-6': new FormControl(0),
    'fruit-7': new FormControl(0),
    'fruit-8': new FormControl(0),
    'fruit-9': new FormControl(0)
  });

  fruits = ['🍊 Oranges', '🍐 Pears', '🍌 Bananas', '🍇 Grapes', '🍉 Watermelons', '🍓 Strawberries', '🍑 Peaches', '🍍 Pineapples', '🍒 Cherries', '🍎 Apples'];

  onSubmit() {
    const quantities: number[] = [];
    for (let i = 0; i < this.fruits.length; i++) {
      quantities.push(this.fruitForm.get('fruit-' + i)?.value);
    }
    console.log('Date:', this.fruitForm.get('date')?.value);
    console.log('Quantities:', quantities);
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
  }
}
