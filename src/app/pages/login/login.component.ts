import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loading: boolean = false;
  email = new FormControl('');
  password = new FormControl('');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (sessionStorage.getItem('session_email')) {
      this.router.navigateByUrl('/main');
      return;
    }
    console.log("login attempt:");
    console.log(this.email.value??'' + "\n" + this.password.value??'');
    this.loading = true;

    this.authService.login(this.email.value??'', this.password.value??'').then(cred => {
      // console.log(cred);
      if (cred?.user?.uid){
        this.userService.getById(cred.user.uid).subscribe(user => {
          sessionStorage.setItem('session_email', user?.email || "unknown") 
          sessionStorage.setItem('session_age', user?.age.toString() || "unknown") 
          sessionStorage.setItem('session_gender', user?.gender || "unknown") 
          sessionStorage.setItem('session_weight', user?.weight.toString() || "unknown") 
          sessionStorage.setItem('session_username', user?.username || "unknown") 
          this.router.navigateByUrl('/main');  
        });
      }
      this.loading = false;
    }).catch(error => {
      console.error(error);
      this.snackBar.open("Invalid credentials.")._dismissAfter(5000);
      this.loading = false;
    })
  }
}
