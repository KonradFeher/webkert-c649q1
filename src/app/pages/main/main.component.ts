import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/User'
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  loggedInUser: any;

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
    this.loggedInUser = undefined;
    this.router.navigateByUrl('/login')
  }
}
