import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private snackBar: MatSnackBar
    ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordAgain: ['', Validators.required],
      gender: [''],
      age: [20, Validators.required],
      weight: [70, Validators.required]
    });
  }

  submitForm() {
    if (this.form.get('password')?.value !== this.form.get('passwordAgain')?.value)
      this.snackBar.open("Your passwords don't match", "...")._dismissAfter(5000);
    else if (this.form.valid) {
      this.authService.signup(this.form.get('email')?.value, this.form.get('password')?.value)
        .then(credentials => {
          console.log(credentials);
          const user: User = {
            id: credentials.user?.uid as string,
            username: this.form.get('username')?.value,
            email: this.form.get('email')?.value,
            gender: this.form.get('gender')?.value,
            age: this.form.get('age')?.value,
            weight: this.form.get('weight')?.value,
          };
          this.userService.create(user)
            .then(_ => {
              console.log(`User ${this.form.get('username')?.value} created successfully.`);
              this.snackBar.open("Account successfully created!", "GO!").afterDismissed().subscribe((info) => {
                this.router.navigateByUrl('/login');
              });
            }).catch(creation_error => {
              console.error(`Error while creating user: ${creation_error}`);
              this.snackBar.open("An error occurred while creating your account...")._dismissAfter(5000);
            })
        }).catch(signup_error => {
          console.error(`Error while signing up user: ${signup_error}`);
          this.snackBar.open("An error occurred while creating your account...")._dismissAfter(5000);
        });
    }

  }
  goBack() {
    this.location.back();
  }

}
