import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DaysService } from '../../shared/services/days.service';
import { UserDay } from '../../shared/models/UserDay';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-day',
  templateUrl: './new-day.component.html',
  styleUrls: ['./new-day.component.scss']
})
export class NewDayComponent implements OnInit{
  fruitForm: FormGroup;
  submitting: boolean = false;
  fruits = ['🍊 Oranges', '🍐 Pears', '🍌 Bananas', '🍇 Grapes', '🍉 Watermelons', '🍓 Strawberries', '🍑 Peaches', '🍍 Pineapples', '🍒 Cherries', '🍎 Apples'];
  email: string;
  gender: string;
  age: number;
  weight: number;

  constructor(private formBuilder: FormBuilder, private router:Router, private snackBar: MatSnackBar, private daysService: DaysService) {
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
    });
  }

  ngOnInit(): void {
    let sesh_email = sessionStorage.getItem("session_email");
 
    this.email = sesh_email || "unknown";
    this.gender = sessionStorage.getItem("session_gender") ?? "female"; // let's assume female if unknown 
    this.age = Number.parseInt(sessionStorage.getItem("session_age") ?? "21"); // let's assume 21 if unknown 
    this.weight = Number.parseInt(sessionStorage.getItem("session_weight") ?? "70"); // let's assume 70 kgs if unknown 

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
    const vitaminC = [.532, .031, .087, .032, .078, .588, .066, .478, .121, .046];

    const totalConsumption = quantities.reduce((sum, quantity, i) => sum + quantity * vitaminC[i], 0);
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

    let userDay: UserDay = {
      date: new Date(this.fruitForm.value.date).getTime() - (new Date(this.fruitForm.value.date).getTime() % 86400000),
      email: this.email,
      fruits: quantities,
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
