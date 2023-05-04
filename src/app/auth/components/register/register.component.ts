import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css', './register.component.css'],
})
export class RegisterComponent implements OnInit {
  formSubmitted = false;
  passwordMatch = false;
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      this.passwordMatch = password === confirmPassword;
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.registerForm.valid && this.passwordMatch) {
      this.authService.SignUp(
        this.registerForm.value.email as string,
        this.registerForm.value.password as string
      );
      this.onReset();
    }
  }

  onReset() {
    this.formSubmitted = false;
    this.registerForm.reset();
  }
}
