import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formSubmitted = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.formSubmitted = true;

    if (this.loginForm.valid) {
      this.authService.SignIn(
        this.loginForm.value.email as string,
        this.loginForm.value.password as string
      );

      this.onReset();
    }
  }

  onReset() {
    this.formSubmitted = false;
    this.loginForm.reset();
  }
}
