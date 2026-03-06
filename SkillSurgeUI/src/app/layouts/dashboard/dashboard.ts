import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { LocalAuthService } from '../../core/services/localauth.service';
import { RoleTypes } from '../../core/models/interfaces/User';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  sidebarCollapsed = false;

  constructor(private authService: LocalAuthService) { }

  headerNavLink: any = null;
  userRole: RoleTypes = RoleTypes.user;

  sidebarNavItems = [
    { label: 'Dashboard', link: '/home', icon: 'dashboard' },
    // { label: 'Products', link: '/products', icon: 'inventory_2' },
    // { label: 'Categories', link: '/categories', icon: 'category' },
    { label: 'Profile', link: '/profile', icon: 'person' },
  ];

  ngOnInit() {
    this.authService.user$.subscribe((u) => this.userRole = u?.role ?? RoleTypes.user)
    if (this.userRole == RoleTypes.admin) {
      this.headerNavLink = {
        label: "Go to Admin Portal",
        link: "/admin/dashboard"
      }
    }
  }
}
