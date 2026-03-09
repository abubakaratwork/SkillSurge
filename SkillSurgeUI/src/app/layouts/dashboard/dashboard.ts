import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { RoleTypes } from '../../core/models/interfaces/User';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  sidebarCollapsed = false;

  constructor(private userService: UserService) { }

  headerNavLink: any = null;
  userRole: string = RoleTypes.user.toString();

  sidebarNavItems = [
    { label: 'Dashboard', link: '/home', icon: 'dashboard' },
    // { label: 'Products', link: '/products', icon: 'inventory_2' },
    // { label: 'Categories', link: '/categories', icon: 'category' },
    { label: 'Profile', link: '/profile', icon: 'person' },
  ];

  ngOnInit() {
    this.userService.userProfile$.subscribe((u) => {
      this.userRole = u?.role.toLowerCase() ?? RoleTypes.user.toString();
    })
    if (this.userRole == RoleTypes.admin.toString()) {
      this.headerNavLink = {
        label: "Go to Admin Portal",
        link: "/admin/dashboard"
      }
    }
  }
}
