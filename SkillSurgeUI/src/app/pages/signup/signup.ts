import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './signup.html',
  styleUrl: '../../app.css'
})
export class Signup {
  authService = inject(AuthService);
  localAuth = inject(LocalAuthService);

  signupData = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    agreeTerms: new FormControl(false, [Validators.requiredTrue])
  });

  handleSignup() {
    if (this.signupData.valid) {
      console.log('Account Created:', this.signupData.value);
      this.localAuth.signup(this.signupData.value);
      // this.authService.login(this.signupData.value).subscribe({
      //   next: (response) => {
      //     if (response.isSuccess){
      //       console.log('Success!', response.message);
      //     } else {
      //       console.error('Logic Error:', response.message);
      //     }
      //   },
      //   error: (err) => {
      //     console.error('HTTP Error (e.g. 404 or 500):', err);
      //   }
      // })
    }
  }
}