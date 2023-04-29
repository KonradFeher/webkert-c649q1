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
  loggedInUser: any;
  session_email: string = sessionStorage.getItem('session_email') ?? "Unknown user...";
  displayedColumns: string[] = ['date', 'fruits', 'vitaminC', 'delete'];
  userDays: UserDay[] = [];

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private daysService: DaysService) {
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(cred => {
      console.log(cred)
      if (cred) {
        this.userService.getById(cred.uid).subscribe(user => {
          console.log(user);
          this.loggedInUser = user;

          // Fetch user's days from the DaysService
          this.daysService.getByEmail(this.loggedInUser.email).subscribe((days: any) => {
            if (days) {
              // Convert object of days to array
              this.userDays = Object.values(days);
              this.userDays.sort((a, b) => a.date - b.date);
            }
          });
        })
      }
    })
  }

  logOut(): void {
    this.authService.logout();
    sessionStorage.removeItem('session_email')
    this.loggedInUser = undefined;
    this.router.navigateByUrl('/login')
  }

  onDelete(userDay: UserDay) {
    console.log(userDay);
    this.daysService.deleteByDate(userDay.email, userDay.date).then(() => {
      // Remove the deleted userDay from the userDays array
      this.userDays = this.userDays.filter(day => day.date !== userDay.date);
    }).catch(error => console.log('Error deleting userDay: ', error));
  }

}
