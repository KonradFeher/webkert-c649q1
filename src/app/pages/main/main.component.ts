import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserDay } from 'src/app/shared/models/UserDay';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FruitPipe } from 'src/app/shared/pipes/fruit.pipe';
import { VitaminPipe } from 'src/app/shared/pipes/vitamin.pipe';
import { DaysService } from 'src/app/shared/services/days.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  displayedColumns: string[] = ['date', 'fruits', 'vitaminC', 'delete'];
  userDays: UserDay[] = [];
  loggedInUser: string = "";

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private daysService: DaysService) {
  }

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('session_email')??"";
    this.daysService.getByEmail(this.loggedInUser).subscribe((days: any) => {
      if (days) {
        // Convert object of days to array
        this.userDays = Object.values(days);
        this.userDays.sort((a, b) => a.date - b.date);
      }
    });
  }

  async logMeOut(){
    // bugos az SDK
    this.authService.logout();
    await new Promise(f => setTimeout(f, 1000));
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  onDelete(userDay: UserDay) {
    console.log(userDay);
    this.daysService.deleteByDate(userDay.email, userDay.date).then(() => {
      // Remove the deleted userDay from the userDays array
      this.userDays = this.userDays.filter(day => day.date !== userDay.date);
    }).catch(error => console.log('Error deleting userDay: ', error));
  }

}
