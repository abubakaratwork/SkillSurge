import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from '../../shared/button/button';
import { UtilityService } from '../../core/services/utility.service';
import { RoleTypes, User } from '../../core/models/interfaces/User';
import { ToastService } from '../../core/services/toast.service';

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

  signupData = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    agreeTerms: new FormControl(false, [Validators.requiredTrue])
  });

  handleSignup() {
    if (this.signupData.valid) {
      const value = this.signupData.value;
      let user: User = {
        id: this.utility.generateId(),
        email: value.email!,
        firstName: value.firstName!,
        lastName: value.lastName!,
        password: value.password!,
        agreeTerms: value.agreeTerms!,
        role: RoleTypes.user
      };
      let res = this.localAuth.signup(user);
      if (res.isSuccess) {
        this.router.navigate(['/login']);
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    }
  }
}