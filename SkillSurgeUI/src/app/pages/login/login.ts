import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from "../../shared/button/button";
import { ToastService } from '../../core/services/toast.service';
import { LoginRequest } from '../../core/models/requests/AuthRequests';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: '../../app.css',
})
export class Login {
  localAuth = inject(LocalAuthService);
  authService = inject(AuthService);
  userService = inject(UserService);

  isLoading: boolean = false;

  constructor(private router: Router, private toastr: ToastService) { console.log('1 Constructor'); }

  ngOnChanges() { console.log('2 OnChanges'); }
  ngOnInit() { console.log('3 OnInit'); }
  ngAfterViewInit() { console.log('4 AfterViewInit'); }
  ngOnDestroy() { console.log('5 OnDestroy'); }

  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  handleSubmit() {
    if (this.formData.valid) {
      console.log('Login Attempt:', this.formData.value);

      let value = this.formData.value;

      const loginRequest: LoginRequest = {
        email: value.email?.trim()!,
        password: value.password?.trim()!,
        rememberMe: true
      }

      this.isLoading = true;

      // this.authService.login(loginRequest).pipe(
      //   finalize(() => this.isLoading = false)
      // ).subscribe({
      //   next: (res) => {
      //     if (res.success) {

      //     }
      //   }
      // })
      this.authService.login(loginRequest).pipe(
        finalize(() => this.isLoading = false)
      )
        .subscribe({
          next: (res) => {

            if (res.success) {
              this.toastr.success(res.message);

              this.formData.reset();

              this.authService.setAccessToken(res.data?.accessToken!);

              this.userService.loadUserProfile();

              this.router.navigate(['/home']);
            }
            else {
              console.log("ResError", res)
              this.toastr.error(res.message);
            }

          },

          error: (err) => {

            console.error("Error", err);

            const message =
              err?.error?.message ||
              "Something went wrong. Please try again.";

            this.toastr.error(message);
          }
        });
      //   const result = this.localAuth.login(this.formData.value.email!, this.formData.value.password!);

      //   if (result.isSuccess) {
      //     this.route.navigate(['/home']);
      //     this.toastr.success(result.message);
      //   } else {
      //     this.toastr.error(result.message);
      //   }
      // } else {
      //   this.toastr.error('Please fill out the form correctly.');
    }
  }
}