import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { LocalAuthService } from '../../core/services/localauth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() navItem: any = null;

  isOnAdminDashboard: boolean = false;

  isAuthenticated: boolean = false;
  constructor(private router: Router, private authService: LocalAuthService) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();

    this.isOnAdminDashboard = this.router.url.includes('/admin');
  }
}
