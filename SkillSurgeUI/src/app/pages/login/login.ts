import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LocalAuthService } from '../../core/services/localauth.service';
import { Button } from "../../shared/button/button";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: '../../app.css',
})
export class Login {
  localAuth = inject(LocalAuthService);

  constructor(private route: Router) { console.log('1 Constructor'); }

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

      if(result) {
        console.log('Login Successful.')
        alert('Login Successful.');
        this.route.navigate(['/home']);
      }else{
        console.log('User not found | Invalid email or password.')
        alert('User not found | Invalid email or password.')
      }
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}