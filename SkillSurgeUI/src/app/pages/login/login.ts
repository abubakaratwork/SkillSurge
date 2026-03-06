import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from "../../shared/button/button";
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: '../../app.css',
})
export class Login {
  localAuth = inject(LocalAuthService);

  constructor(private route: Router, private toastr: ToastService) { console.log('1 Constructor'); }

  ngOnChanges() { console.log('2 OnChanges'); }
  ngOnInit() { console.log('3 OnInit'); }
  ngAfterViewInit() { console.log('4 AfterViewInit'); }
  ngOnDestroy() { console.log('5 OnDestroy'); }

  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  handleSubmit() {
    if (this.formData.valid) {
      console.log('Login Attempt:', this.formData.value);
      const result = this.localAuth.login(this.formData.value.email!, this.formData.value.password!);

      if (result.isSuccess) {
        this.route.navigate(['/home']);
        this.toastr.success(result.message);
      } else {
        this.toastr.error(result.message);
      }
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }
}