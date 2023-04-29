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


const MOCK_DATA: UserDay[] = [
  {position: 1, email: 'konradfeher@outlook.com', date: Date.parse("2020-03-12"), fruits: [2,0,1,0,2,0,1,0], vitaminC: 65},
  {position: 2, email: 'konradfeher@outlook.com', date: Date.parse("2020-03-14"), fruits: [0,1,1,0,2,0,1,2], vitaminC: 30},
  {position: 3, email: 'konradfeher@outlook.com', date: Date.parse("2020-03-15"), fruits: [0,0,1,1,3,1,2,3], vitaminC: 12},
  {position: 4, email: 'konradfeher@outlook.com', date: Date.parse("2020-03-17"), fruits: [1,0,0,1,3,1,2,6], vitaminC: 37},
];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loggedInUser: any;
  currentUser: string = sessionStorage.getItem('currentUser') ?? "Unknown user...";
  displayedColumns: string[] = ['position', 'date', 'fruits', 'vitaminC'];
  userDays = MOCK_DATA;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(cred => {
      console.log(cred)
      if (cred) {
        this.userService.getById(cred.uid).subscribe(user => {
          console.log(user);
          this.loggedInUser = user;
        })
      }
    })
  }

  logOut(): void {
    this.authService.logout();
    sessionStorage.removeItem('currentUser')
    this.loggedInUser = undefined;
    this.router.navigateByUrl('/login')
  }
}
