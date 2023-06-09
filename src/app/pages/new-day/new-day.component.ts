import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DaysService } from '../../shared/services/days.service';
import { UserDay } from '../../shared/models/UserDay';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FruitService } from 'src/app/shared/services/fruit.service';
import { Fruit } from 'src/app/shared/models/Fruit';

@Component({
  selector: 'app-new-day',
  templateUrl: './new-day.component.html',
  styleUrls: ['./new-day.component.scss']
})
export class NewDayComponent implements OnInit{
  fruitForm: FormGroup;
  submitting: boolean = false;
  fruits: Fruit[] = []; 
  email: string;
  gender: string;
  age: number;
  weight: number;
  vitaminC: number[] = [];

  constructor(private formBuilder: FormBuilder, private router:Router, private snackBar: MatSnackBar, private daysService: DaysService, private fruitService: FruitService) {
    this.email = this.gender = '';
    this.age = this.weight = 0;
    
    this.fruitForm = this.formBuilder.group({
      'date': [new Date(), Validators.required],
      'fruit-0': [],
      'fruit-1': [],
      'fruit-2': [],
      'fruit-3': [],
      'fruit-4': [],
      'fruit-5': [],
      'fruit-6': [],
      'fruit-7': [],
      'fruit-8': [],
      'fruit-9': [],
      'fruit-10': [],
      'fruit-11': [],
    });
  }

  ngOnInit(): void {

    let sesh_email = sessionStorage.getItem("session_email");
    this.email = sesh_email || "unknown";
    this.gender = sessionStorage.getItem("session_gender") ?? "female"; // let's assume female if unknown 
    this.age = Number.parseInt(sessionStorage.getItem("session_age") ?? "21"); // let's assume 21 if unknown 
    this.weight = Number.parseInt(sessionStorage.getItem("session_weight") ?? "70"); // let's assume 70 kgs if unknown 

    this.fruitService.getAll().subscribe(f => {
      this.fruits = f
      this.fruits.forEach(fruit => this.vitaminC.push(fruit.vitaminC));
    });
    console.log(this.fruits)

    if (!sesh_email) {
      this.snackBar.open("An error occurred..", "Sorry")
      this.router.navigateByUrl('/login')
      return;
    }
    this.fruitForm.valueChanges.subscribe((value) => {
      if (this.email === '') return;
      
      const quantities: number[] = [];
      for (let i = 0; i < this.fruits.length; i++) {
        quantities.push(this.fruitForm.get('fruit-' + i)?.value);
      }
      
      let vitC = this.calculateVitaminCConsumption(this.age, this.gender, this.weight, quantities)
  
      this.snackBar.open(vitC[1].toFixed(2) + ' / ' + vitC[0].toFixed(2) + ' mg of Vitamin C', '🍋' );
    });
  }

  calculateVitaminCConsumption(age: number, gender: string, weight: number, quantities: number[]): number[] {
    const genderFactor = gender === 'female' ? 25 : 0;
    const dailyIntake = 90 + 0.65 * weight + (-0.51 * age) + genderFactor; // in milligrams
                    // ['🍊 Oranges', '🍐 Pears', '🍌 Bananas', '🍇 Grapes', '🍉 Watermelons', '🍓 Strawberries', '🍑 Peaches', '🍍 Pineapples', '🍒 Cherries', '🍎 Apples'];
    // const vitaminC = [.532, .031, .087, .032, .078, .588, .066, .478, .121, .046];

    // console.log(this.vitaminC);
    // console.log(quantities);
    

    const totalConsumption = quantities.reduce((sum, quantity, i) => sum + quantity * this.vitaminC[i], 0);
    const percentageConsumed = Math.floor((totalConsumption / dailyIntake) * 100);
    return [dailyIntake, totalConsumption, percentageConsumed];
  }

  onSubmit() {
    this.submitting = true;
    let date = this.fruitForm.get('date')?.value;
    if (!date) {
      this.snackBar.open("Select a date!", "OK")
      this.submitting = false;
      return;
    }

    const quantities: number[] = [];
    for (let i = 0; i < this.fruits.length; i++) {
      quantities.push(this.fruitForm.get('fruit-' + i)?.value ??  0);
    }
    let sum = 0;
    quantities.forEach(quantity => sum += quantity ?? 0);
    if (sum === 0) {
      this.snackBar.open("Eat some fruit!", "OK")
      this.submitting = false;
      return;
    }

    // Recommended daily intake (mg) = 
    // 90 mg + 0.65 mg/kg of body weight + (−0.51 × age) + (gender factor)

    let vitC = this.calculateVitaminCConsumption(this.age, this.gender, this.weight, quantities)
    let d = new Date(this.fruitForm.value.date)
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    
    let f = [];
    for (let i = 0; i < quantities.length; i++) {
      if (quantities[i] !== 0) {
        f.push(quantities[i].toString() + 'g ' + this.fruits[i].emoji)
      }
    }

    let userDay: UserDay = {
      date: d.getTime(),
      email: this.email,
      fruits: f,
      vitaminC: vitC[2]
    }

    this.daysService.addDay(this.email, userDay).then(result =>{
      if (result) {
        this.snackBar.open("Successfully added Vitamin Day!", "🍌");
        this.router.navigateByUrl('/main');
      } else {
        this.snackBar.open("An error occurred...", "🙊");
        this.submitting = false;
      }
    })

  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
  }
}
