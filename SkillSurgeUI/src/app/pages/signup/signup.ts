import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from '../../shared/button/button';
import { UtilityService } from '../../core/services/utility.service';
import { RoleTypes, User } from '../../core/models/interfaces/User';
import { ToastService } from '../../core/services/toast.service';
import { SignupRequest } from '../../core/models/requests/AuthRequests';
import { finalize, map } from 'rxjs';

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

  constructor(private utility: UtilityService, private toastr: ToastService, private router: Router) { }

  isSigningUp: boolean = false;

  signupData = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    agreeTerms: new FormControl(false, [Validators.requiredTrue])
  });

  handleSignup() {
    if (this.signupData.valid) {
      const value = this.signupData.value;
      const signupRequest: SignupRequest = {
        email: value.email?.trim()!,
        firstName: value.firstName?.trim()!,
        lastName: value.lastName?.trim()!,
        password: value.password!,
        isAgreedToTerms: value.agreeTerms!
      }

      console.log("Signup Request:", signupRequest);
      this.isSigningUp = true;

      this.authService.signup(signupRequest)
        .pipe(
          finalize(() => this.isSigningUp = false)
        )
        .subscribe({
          next: (res) => {

            if (res.success) {
              this.toastr.success(res.message);
              
              this.signupData.reset();
              
              this.router.navigate(['/login']);
            }
            else {
              console.log("ResError", res)
              this.toastr.error(res.message);
            }

          },

          error: (err) => {

            console.error("Error",err);

            const message =
              err?.error?.message ||
              "Something went wrong. Please try again.";

            this.toastr.error(message);
          }
        });
      // let user: User = {
      //   id: this.utility.generateId(),
      //   email: value.email!,
      //   firstName: value.firstName!,
      //   lastName: value.lastName!,
      //   password: value.password!,
      //   agreeTerms: value.agreeTerms!,
      //   role: RoleTypes.user
      // };
      // let res = this.localAuth.signup(user);
      // if (res.isSuccess) {
      //   this.router.navigate(['/login']);
      //   this.toastr.success(res.message);
      // } else {
      //   this.toastr.error(res.message);
      // }
    }
  }
}