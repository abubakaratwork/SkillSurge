import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { LocalAuthService } from '../../core/services/localauth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  isAuthenticated:boolean = false;
  constructor(private router: Router, private authService: LocalAuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(){
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
