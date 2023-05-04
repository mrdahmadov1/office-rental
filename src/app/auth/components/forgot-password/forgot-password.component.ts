import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    '../login/login.component.css',
    './forgot-password.component.css',
  ],
})
export class ForgotPasswordComponent implements OnInit {
  formSubmitted = false;
  resetForm = new FormGroup({
    passwordResetEmail: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  });

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.formSubmitted = true;

    if (this.resetForm.valid) {
      this.authService.ForgotPassword(
        this.resetForm.value.passwordResetEmail as string
      );

      this.onReset();
    }
  }

  onReset() {
    this.resetForm.reset();
    this.formSubmitted = false;
  }
}
